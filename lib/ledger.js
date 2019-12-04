/*
 * Copyright (c) 2012-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const _ = require('lodash');
const bedrock = require('bedrock');
const brAccount = require('bedrock-account');
const brLedgerAgent = require('bedrock-ledger-agent');
const brLedgerNode = require('bedrock-ledger-node');
const {config, util: {delay, BedrockError}} = bedrock;
const {documentLoader} = require('bedrock-jsonld-document-loader');
const fs = require('fs').promises;
const https = require('https');
const jsigs = require('jsonld-signatures');
const logger = require('./logger');
const path = require('path');
const pRetry = require('p-retry');
const {promisify} = require('util');
const getAgentIterator = promisify(brLedgerAgent.getAgentIterator);
const {
  purposes: {AssertionProofPurpose},
  suites: {Ed25519Signature2018}
} = jsigs;
const {WebLedgerClient} = require('web-ledger-client');

const brLedgerAgentAdd = promisify(brLedgerAgent.add);

const Store = require('flex-docstore');
const didStore = Store.using('files', {
  dir: path.join(process.cwd(), 'secret_dids'),
  extension: '.json',
});
const didv1 = new (require('did-veres-one')).VeresOne({didStore});

// module API
const api = {};
module.exports = api;

// add routes
bedrock.events.on('bedrock.started', async () => {
  let ledgerAgent;
  while(!ledgerAgent) {
    ({ledgerAgent} = await setupVeresOneLedger());
    if(!ledgerAgent) {
      // wait a second before trying again
      await delay(1000);
    }
  }
  logger.debug(
    'Successfully initialized ledger agent in worker.',
    {ledgerAgentId: ledgerAgent.id});
  api.agent = ledgerAgent;
  return bedrock.events.emit('veres-one.ready');
});

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
  await bedrock.runOnce('veres-one.setupLedger', setup);
  return {ledgerAgent: null};
}

async function _findAgent() {
  const options = {
    owner: 'admin'
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
async function _setupGenesisNode() {
  try {
    const ledgerOwner = await _getLedgerOwner();
    // generate the Maintainers's DID Document
    // FIXME: MAKE ASYNC
    const maintainerDoc = await didv1.generate(
      {passphrase: config['veres-one'].maintainerPassphrase});

    // TODO: generate the Board of Governors' DID Document
    // governorsDoc: callback => generateDid(
    //   {passphrase: config['veres-one'].governorsPassphrase}, callback),
    // Store the Board of Governors' DID Document
    // storeGovernorsDoc: ['governorsDoc', (results, callback) =>
    //   fs.writeFile(config['veres-one'].governorsConfigFile,
    //     JSON.stringify(results.governorsDoc.privateDidDocument, null, 2),
    //     'utf-8', callback)],

    // store the maintainers DID and make it read-only
    await fs.writeFile(config['veres-one'].maintainerConfigFile,
      JSON.stringify(bedrock.util.clone(maintainerDoc), null, 2),
      {encoding: 'utf-8', mode: 0o444});

    // Build the Veres One Genesis Block Ledger Configuration
    const ledgerConfig = config['veres-one'].config;
    ledgerConfig.ledger = maintainerDoc.doc.id;
    // const sigValidatorConfig =
    //   ledgerConfig.ledgerConfigurationValidator[1];
    // sigValidatorConfig.approvedSigner.push(
    //   `${maintainerDoc.publicDidDocument.id}#authn-key-1`);

    // TODO: decrypt the maintainer and governor private keys
    const method = maintainerDoc.getVerificationMethod(
      {proofPurpose: 'capabilityInvocation'});
    const signingKey = maintainerDoc.keys[method.id];
    const signedConfig = await jsigs.sign(ledgerConfig, {
      compactProof: false,
      documentLoader,
      suite: new Ed25519Signature2018({key: signingKey}),
      purpose: new AssertionProofPurpose()
    });

    // create Veres One ledger
    const options = {
      ledgerConfiguration: signedConfig,
      genesis: true,
      public: true,
      owner: ledgerOwner.id,
      plugins: ['veres-one-ticket-service-agent'],
    };
    await brLedgerAgentAdd(ledgerOwner, null, options);
  } catch(error) {
    logger.error('Error while initializing Veres One ledger', {error});
    throw error;
  }
}

// setup a peer node by fetching the genesis block from another peer
async function _setupPeerNode() {
  try {
    logger.debug('Retrieving genesis block from peers',
      {peers: config['veres-one'].peers});
    const productionMode = config['veres-one'].did !==
      'did:v1:uuid:00000000-0000-0000-0000-000000000000';

    const ledgerOwner = await _getLedgerOwner();

    const genesisBlock = await pRetry(() => {
      const hostname = _.sample(config['veres-one'].peers);
      const clientOptions = {
        hostname,
        httpsAgent: new https.Agent({rejectUnauthorized: productionMode})
      };
      logger.debug(`Attempting to contact host ${hostname}`);
      const client = new WebLedgerClient(clientOptions);
      return client.getGenesisBlock();
    }, {
      retries: 300,
      onFailedAttempt: async error => {
        logger.error(
          'Unable to acquire the genesis block. Retrying...', {error});
        await delay(5000);
      }
    });

    const ledgerNode = await brLedgerNode.add(null, {genesisBlock});

    const options = {
      public: true,
      owner: ledgerOwner.id,
      plugins: ['veres-one-ticket-service-agent'],
    };
    await brLedgerAgentAdd(null, ledgerNode.id, options);
  } catch(error) {
    logger.error('Failed to retrieve genesis block from peers.', {error});
    throw error;
  }
  logger.debug('Successfully retrieved genesis block from peers.');
}

async function _getLedgerOwner() {
  const id = 'admin';

  // attempt to get the admin identity
  const account = await brAccount.getCapabilities({id});
  // if sysResoureRole is empty array, the account does not exist
  if(account.sysResourceRole.length !== 0) {
    return account;
  }
  // create admin identity if it doesn't exist
  const adminAccount = {
    id,
    email: 'admin@' + config.server.domain,
  };
  const meta = {
    sysResourceRole: [{
      sysRole: 'veres.admin',
      generateResource: 'id'
    }],
  };

  await brAccount.insert({actor: null, account: adminAccount, meta});
  // the admin account exists now
  return brAccount.getCapabilities({id});
}
