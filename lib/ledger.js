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
const didv1 = require('did-veres-one');
const fs = require('fs');
const forge = require('node-forge');
const jsigs = require('jsonld-signatures');
const logger = bedrock.loggers.get('app').child('veres-one');
const request = require('request');
const url = require('url');

// module API
const api = {};
module.exports = api;

// setup JSIGS to use bedrock JSON-LD document loader
jsigs.use('jsonld', bedrock.jsonld);

// add routes
bedrock.events.on('bedrock.init', setupJsonldProcessor);
bedrock.events.on('bedrock-express.ready', (app, callback) =>
  setupVeresOneLedger(callback));

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

  // Ensure that the ledger genesis DDO and public key are always available
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
function setupVeresOneLedger(callback) {
  // check to see if the Veres One Ledger agent already exists
  const options = {
    owner: config.server.baseUri + config['identity-http'].basePath + '/admin'
  };
  brLedgerAgent.getAgentIterator(null, options, (err, iterator) => {
    if(err) {
      logger.error('Error while scanning for Veres One ledger', {error: err});
      return callback(err);
    }
    // search all ledger agents (there should only be one in the system)
    let found = false;
    async.eachSeries(iterator, (promise, callback) => {
      promise.then(ledgerAgent => {
        if(ledgerAgent.node.id) {
          found = true;
          api.agent = ledgerAgent;
          callback();
        }
      }).catch(callback);
    }, err => {
      if(err) {
        logger.error('Error while processing Veres One agents', {error: err});
        return callback(err);
      }
      // if no ledger agents are found and there are no peers
      if(!found && config['veres-one'].peers.length < 1) {
        // this is the genesis node - no ledger agents, no peers
        return bedrock.runOnce('veres-one.setupLedger', callback =>
          _setupGenesisNode(callback), {}, (err, ran) => {
            if(err) {
              return callback(err);
            }
            setTimeout(() => setupVeresOneLedger(callback), 3000);
          });
      } else if (!found && config['veres-one'].peers.length > 0) {
        // this is a peer node - no ledger agents, list of peers
        return bedrock.runOnce('veres-one.setupLedger', callback =>
          _setupPeerNode(callback), {}, (err, ran) => {
            if(err) {
              return callback(err);
            }
            setTimeout(() => setupVeresOneLedger(callback), 3000);
          });
      }
      // this node has been initialized - fire it up
      _emitReadyEvent(callback);
    });
  });
}

// setup the genesis node
function _setupGenesisNode(callback) {
  async.auto({
    ledgerOwner: callback => _getLedgerOwner({nodeType:'genesis'}, callback),
    // generate the Maintainers's DID Document
    maintainerDdo: callback => didv1.generate(
      {passphrase: config['veres-one'].maintainerPassphrase}, callback),
    // generate the Board of Governors' DID Document
    governorsDdo: callback => didv1.generate(
      {passphrase: config['veres-one'].governorsPassphrase}, callback),
    // Store the Maintainer's DID Document
    storeMaintainerDdo: ['maintainerDdo', (results, callback) =>
      fs.writeFile(config['veres-one'].maintainerConfigFile,
        JSON.stringify(results.maintainerDdo.privateDidDocument, null, 2),
        'utf-8', callback)],
    // Store the Board of Governors' DID Document
    storeGovernorsDdo: ['governorsDdo', (results, callback) =>
      fs.writeFile(config['veres-one'].governorsConfigFile,
        JSON.stringify(results.governorsDdo.privateDidDocument, null, 2),
        'utf-8', callback)],
    // Build the Veres One Genesis Block Ledger Configuration
    buildConfig: ['storeMaintainerDdo', 'storeGovernorsDdo',
      (results, callback) => {
      const ledgerConfig = config['veres-one'].config;
      // FIXME: Enable event validators
      /*
      ledgerConfig.eventValidator.push({
        type: 'SignatureValidator2017',
        eventFilter: [{
          type: 'EventTypeFilter',
          eventType: ['WebLedgerConfigurationEvent']
        }],
        approvedSigner: [
          results.maintainerDdo.authentication[0].publicKey.id,
          results.governorsDdo.authentication[0].publicKey.id
        ],
        minimumSignaturesRequired: 1
      });*/

      callback(null, ledgerConfig);
    }],
    sign: ['buildConfig', (results, callback) => {
      // decrypt the maintainer and governor private keys
      const maintainerPrivateKey = forge.pki.decryptRsaPrivateKey(
        results.maintainerDdo.privateDidDocument.authentication[0].
          publicKey.privateKeyPem,
        config['veres-one'].maintainerPassphrase, {algorithm: 'aes256'});
      const governorsPrivateKey = forge.pki.decryptRsaPrivateKey(
        results.governorsDdo.privateDidDocument.authentication[0].
          publicKey.privateKeyPem,
        config['veres-one'].governorsPassphrase, {algorithm: 'aes256'});
      const maintainerPrivateKeyPem =
        forge.pki.privateKeyToPem(maintainerPrivateKey);
      const governorsPrivateKeyPem =
        forge.pki.privateKeyToPem(governorsPrivateKey);

      // place the maintainer and governor signatures on the config event
      async.parallel([
        callback => jsigs.sign(results.buildConfig, {
          algorithm: 'RsaSignature2018',
          privateKeyPem: governorsPrivateKeyPem,
          creator: results.governorsDdo.privateDidDocument.authentication[0].
            publicKey.id
        }, callback),
        callback => jsigs.sign(results.buildConfig, {
          algorithm: 'RsaSignature2018',
          privateKeyPem: maintainerPrivateKeyPem,
          creator: results.maintainerDdo.privateDidDocument.authentication[0].
            publicKey.id
        }, callback)
      ], (err, signedObjects) => {
        // FIXME: Update to use "proof"
        results.buildConfig.proof = signedObjects.map(obj => obj.proof);
        callback(err, results.buildConfig);
      });
    }],
    create: ['ledgerOwner', 'sign', (results, callback) => {
      // create Veres One ledger
      const options = {
        configEvent: results.sign,
        genesis: true,
        public: true,
        owner: results.ledgerOwner.identity.id
      };
      brLedgerAgent.add(results.ledgerOwner.identity, null, options, callback);
    }]
  }, (err, results) => {
    if(err) {
      logger.error('Error while initializing Veres One ledger', {error: err});
      return callback(err);
    }
    api.agent = results.create;
    _emitReadyEvent(callback);
  });
}

// setup a peer node by fetching the genesis block from another peer
function _setupPeerNode(callback) {
  logger.debug('Retrieving genesis block from peers',
    {peers: config['veres-one'].peers});
  const productionMode = config['veres-one'].did !==
    'did:v1:uuid:00000000-0000-0000-0000-000000000000';

  async.auto({
    ledgerOwner: callback => _getLedgerOwner({nodeType:'peer'}, callback),
    genesisBlock: callback => async.retry(
      {times: 300, interval: 5000}, callback => {
        const peer = _.sample(config['veres-one'].peers);
        request({
          method: 'GET',
          url: url.resolve(peer, '/ledger-agents/'),
          json: true,
          strictSSL: (productionMode) ? true : false
        }, callback)}, (err, res) => {
          if(err) {
            return callback(err);
          }
          if(res.statusCode !== 200) {
            logger.debug('Error retrieving peer ledger agents.', {
              statusCode: res.statusCode,
              body: res.body
            });
            return callback(new Error('Error retrieving peer ledger agents.'));
          }
          request({
            method: 'GET',
            // FIXME: Ensure we're connecting to the right ledger
            url: res.body.ledgerAgent[0].service.ledgerBlockService,
            json: true,
            strictSSL: (productionMode) ? true : false
          }, callback)
        },
      callback),
    ledgerNode: ['genesisBlock', 'ledgerOwner', (results, callback) => {
      const genesisBlock = results.genesisBlock[0].body.genesis.block;

      brLedgerNode.add(null, {
        genesisBlock: genesisBlock
      }, callback);
    }],
    ledgerAgent: ['ledgerNode', (results, callback) => {
      const options = {
        public: true,
        owner: results.ledgerOwner.identity.id
      };
      brLedgerAgent.add(null, results.ledgerNode.id, options, callback);
    }],
  }, (err, results) => {
    if(err) {
      logger.error('Failed to retrieve genesis block from peers.', err);
      return callback(err);
    }

    logger.debug('Successfully retrieved genesis block from peers.');
    api.agent = results.ledgerAgent;
    _emitReadyEvent(callback);
  });
}

function _getLedgerOwner(options, callback) {
  const adminUrl = config.server.baseUri + config['identity-http'].basePath +
    '/admin';

  // attempt to get the admin identity
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

function _emitReadyEvent(callback) {
  bedrock.events.emit('veres-one.ready', callback);
}
