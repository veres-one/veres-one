/*
 * Copyright (c) 2012-2018 Digital Bazaar, Inc. All rights reserved.
 */
const _ = require('lodash');
const async = require('async');
const bedrock = require('bedrock');
const brDidClient = require('bedrock-did-client');
const brIdentity = require('bedrock-identity');
const brLedgerAgent = require('bedrock-ledger-agent');
const brLedgerNode = require('bedrock-ledger-node');
const config = bedrock.config;
const fs = require('fs');
const https = require('https');
const jsigs = require('jsonld-signatures');
const logger = require('./logger');
const path = require('path');
const {callbackify, promisify} = require('util');
const getAgentIterator = promisify(brLedgerAgent.getAgentIterator);
const {util: {BedrockError}} = bedrock;
const {Ed25519Signature2018} = jsigs.suites;
const {AssertionProofPurpose} = jsigs.purposes;
const {WebLedgerClient} = require('web-ledger-client');

const Store = require('flex-docstore');
const didStore = Store.using('files', {
  dir: path.join(process.cwd(), 'secret_dids'),
  extension: '.json',
});
const didv1 = new (require('did-veres-one')).VeresOne({didStore});

const generateDid = callbackify(didv1.generate).bind(didv1);

// module API
const api = {};
module.exports = api;

// add routes
bedrock.events.on('bedrock.init', setupJsonldProcessor);
bedrock.events.on('bedrock.ready', async () => {
  let ledgerAgent;
  while(!ledgerAgent) {
    ({ledgerAgent} = await setupVeresOneLedger());
    if(!ledgerAgent) {
      // wait a second before trying again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  logger.debug(
    'Successfully initialized ledger agent in worker.',
    {ledgerAgentId: ledgerAgent.id});
  api.agent = ledgerAgent;
  return bedrock.events.emit('veres-one.ready');
});

/**
 * Sets up the the JSON-LD processor's document loader for the Veres One Ledger.
 */
function setupJsonldProcessor() {
  const jsonld = bedrock.jsonld;
  const oldLoader = jsonld.documentLoader;

  // FIXME: Need to pull did:v1:*-based stuff from the state machine
  // const ddoUrl = config['veres-one'].ddo.id;
  // const ddoPublicKeyUrl = config['veres-one'].ddoPublicKey.id;
  const ledgerPresets = {};
  // ledgerPresets[ddoUrl] = config['veres-one'].ddo;
  // ledgerPresets[ddoPublicKeyUrl] = config['veres-one'].ddoPublicKey;

  // ensure that the ledger genesis DID Doc and public key are always available
  jsonld.documentLoader = function(url, callback) {
    if(Object.keys(ledgerPresets).includes(url)) {
      return callback(null, {
        contextUrl: null,
        document: ledgerPresets[url],
        documentUrl: url
      });
    }
    oldLoader(url, callback);
  };
  // override jsonld.documentLoader in brDidClient so this document loader
  // can be used for did: and https: URLs
  brDidClient.jsonld.documentLoader = jsonld.documentLoader;
}

/**
 * Setup the Veres One Ledger.
 */
async function setupVeresOneLedger() {
  // check to see if the Veres One Ledger agent already exists
  try {
    const ledgerAgent = await _findAgent();
    return {ledgerAgent};
    // return bedrock.events.emit('veres-one.ready');
  } catch(e) {
    if(e.name !== 'NotFoundError') {
      throw e;
    }
  }
  // ledgerAgent was not found and needs to be initialized
  let setup;
  if(config['veres-one'].peers.length === 0) {
    // this is the genesis node - no ledger agents, no peers
    setup = _setupGenesisNode;
  } else {
    // this is a peer node - no ledger agents, list of peers
    setup = _setupPeerNode;
  }
  return new Promise((resolve, reject) => bedrock.runOnce(
    'veres-one.setupLedger', setup, err => err ? reject(err) :
      resolve({ledgerAgent: null})));
}

async function _findAgent() {
  const options = {
    owner: config.server.baseUri + config['identity-http'].basePath + '/admin'
  };
  let iterator;
  try {
    iterator = await getAgentIterator(null, options);
  } catch(e) {
    logger.error('Error while scanning for Veres One ledger', {error: e});
    throw e;
  }
  for(const promise of iterator) {
    const ledgerAgent = await promise;
    if(ledgerAgent.ledgerNode.id) {
      return ledgerAgent;
    }
  }
  throw new BedrockError('Ledger agent not found.', 'NotFoundError');
}

// setup the genesis node
function _setupGenesisNode(callback) {
  async.auto({
    ledgerOwner: callback => _getLedgerOwner({nodeType: 'genesis'}, callback),
    // generate the Maintainers's DID Document
    maintainerDoc: callback => generateDid(
      {passphrase: config['veres-one'].maintainerPassphrase}, callback),
    // generate the Board of Governors' DID Document
    // governorsDoc: callback => generateDid(
    //   {passphrase: config['veres-one'].governorsPassphrase}, callback),
    // Store the Maintainer's DID Document
    storeMaintainerDoc: ['maintainerDoc', (results, callback) => {
      // store the maintainers DID and make it read-only
      fs.writeFile(config['veres-one'].maintainerConfigFile,
        JSON.stringify(bedrock.util.clone(results.maintainerDoc), null, 2),
        {encoding: 'utf-8', mode: 0o444}, callback);

    }],
    // Store the Board of Governors' DID Document
    // storeGovernorsDoc: ['governorsDoc', (results, callback) =>
    //   fs.writeFile(config['veres-one'].governorsConfigFile,
    //     JSON.stringify(results.governorsDoc.privateDidDocument, null, 2),
    //     'utf-8', callback)],
    // Build the Veres One Genesis Block Ledger Configuration
    buildConfig: ['storeMaintainerDoc', /*'storeGovernorsDoc', */
      (results, callback) => {
        const ledgerConfig = config['veres-one'].config;
        const {maintainerDoc} = results;
        ledgerConfig.ledger = maintainerDoc.doc.id;
        // const sigValidatorConfig =
        //   ledgerConfig.ledgerConfigurationValidator[1];
        // sigValidatorConfig.approvedSigner.push(
        //   `${maintainerDoc.publicDidDocument.id}#authn-key-1`);
        callback(null, ledgerConfig);
      }],
    sign: ['buildConfig', (results, callback) => {
      // decrypt the maintainer and governor private keys
      const {maintainerDoc} = results;
      const method = maintainerDoc.getVerificationMethod(
        {proofPurpose: 'capabilityInvocation'});
      const signingKey = maintainerDoc.keys[method.id];
      const sign = callbackify(jsigs.sign);
      return sign(results.buildConfig, {
        compactProof: false,
        documentLoader: bedrock.jsonld.documentLoader,
        suite: new Ed25519Signature2018({key: signingKey}),
        purpose: new AssertionProofPurpose()
      }, callback);
    }],
    create: ['ledgerOwner', 'sign', (results, callback) => {
      // create Veres One ledger
      const options = {
        ledgerConfiguration: results.sign,
        genesis: true,
        public: true,
        owner: results.ledgerOwner.identity.id,
        plugins: ['veres-one-ticket-service-agent'],
      };
      brLedgerAgent.add(results.ledgerOwner.identity, null, options, callback);
    }]
  }, err => {
    if(err) {
      logger.error('Error while initializing Veres One ledger', {error: err});
      return callback(err);
    }
    callback();
  });
}

// setup a peer node by fetching the genesis block from another peer
function _setupPeerNode(callback) {
  logger.debug('Retrieving genesis block from peers',
    {peers: config['veres-one'].peers});
  const productionMode = config['veres-one'].did !==
    'did:v1:uuid:00000000-0000-0000-0000-000000000000';

  async.auto({
    ledgerOwner: callback => _getLedgerOwner({nodeType: 'peer'}, callback),
    genesisBlock: callback => async.retry(
      {times: 300, interval: 5000}, callback => {
        const hostname = _.sample(config['veres-one'].peers);
        const clientOptions = {
          hostname,
          httpsAgent: new https.Agent({rejectUnauthorized: productionMode})
        };
        const client = new WebLedgerClient(clientOptions);
        const getGenesisBlock = callbackify(client.getGenesisBlock);
        getGenesisBlock(callback);
      }, callback),
    ledgerNode: ['genesisBlock', 'ledgerOwner', (results, callback) => {
      const {genesisBlock} = results;
      brLedgerNode.add(null, {genesisBlock}, callback);
    }],
    ledgerAgent: ['ledgerNode', (results, callback) => {
      const options = {
        public: true,
        owner: results.ledgerOwner.identity.id,
        plugins: ['veres-one-ticket-service-agent'],
      };
      brLedgerAgent.add(null, results.ledgerNode.id, options, callback);
    }],
  }, err => {
    if(err) {
      logger.error('Failed to retrieve genesis block from peers.', err);
      return callback(err);
    }
    logger.debug('Successfully retrieved genesis block from peers.');
    callback();
  });
}

function _getLedgerOwner(options, callback) {
  const adminUrl = config.server.baseUri + config['identity-http'].basePath +
    '/admin';

  // attempt to get the admin identity

  // FIXME: the return values of the `get` and `insert` APIs are not the same
  // this has not been an issue because the `get` codepath here always fails
  // and the result of `insert` is always returned.

  brIdentity.get(null, adminUrl, (err, identity, meta) => {
    if(!err) {
      return callback(err, identity, meta);
    }
    // create admin identity if it doesn't exist
    const nodeType =
      (options.nodeType === 'genesis') ? 'Genesis Node' : 'Peer Node';
    const adminIdentity = {
      id: adminUrl,
      type: 'Identity',
      sysSlug: 'admin',
      email: 'admin@' + config.server.domain,
      url: config.server.baseUri,
      label: 'Administrator Account for Veres One ' + nodeType,
      description: 'Used to manage this Veres One ' + nodeType,
      sysPassword: config['veres-one'].adminPassword,
      sysPublic: ['label', 'url', 'description'],
      sysResourceRole: [{
        sysRole: 'veres.admin',
        generateResource: 'id'
      }],
    };
    brIdentity.insert(null, adminIdentity, callback);
  });
}
