/*
 * Copyright (c) 2012-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const _ = require('lodash');
const bedrock = require('bedrock');
const brAccount = require('bedrock-account');
const brHttpsAgent = require('bedrock-https-agent');
const brLedgerAgent = require('bedrock-ledger-agent');
const brLedgerNode = require('bedrock-ledger-node');
const {config, util: {uuid, BedrockError}} = bedrock;
const {constants} = config;
const {documentLoader} = require('bedrock-jsonld-document-loader');
const fs = require('fs').promises;
const jsigs = require('jsonld-signatures');
const ledgerInitJob = require('./ledger-init-job');
const logger = require('./logger');
const pRetry = require('p-retry');
const {promisify} = require('util');
const getAgentIterator = promisify(brLedgerAgent.getAgentIterator);
const {
  purposes: {AssertionProofPurpose},
} = jsigs;
const {CapabilityInvocation} = require('@digitalbazaar/zcapld');
const {Ed25519Signature2020} =
  require('@digitalbazaar/ed25519-signature-2020');
const {Ed25519VerificationKey2020} =
  require('@digitalbazaar/ed25519-verification-key-2020');
const v1 = require('did-veres-one');
const {WebLedgerClient} = require('web-ledger-client');

const brLedgerAgentAdd = promisify(brLedgerAgent.add);

// the maximum number of milliseconds between two retries
const RETRY_MAX_TIMEOUT = 30000;

// module API
const api = {};
module.exports = api;

// add routes
bedrock.events.on('bedrock.started', async () => {
  let ledgerAgent;
  while(!ledgerAgent) {
    logger.debug('Attempting ledger setup...');
    try {
      ({ledgerAgent} = await setupVeresOneLedger());
    } catch(e) {
      logger.error('Error during ledger setup.', {error: e});
    }
    if(!ledgerAgent) {
      logger.debug('Retrying ledger setup...');
    }
  }
  logger.debug('Successfully initialized ledger agent in worker.', {
    ledgerAgentId: ledgerAgent.id
  });
  api.agent = ledgerAgent;
  const {ledgerNode} = ledgerAgent;

  // Gather Peer IDs of nodes based on their hostname
  const endpoints = await _getEndpoints({
    hostnames: config['veres-one'].peers
  });
  // Ensure we filter out the local peer from the list of peers
  const localPeerId = await ledgerNode.consensus._localPeers.getPeerId(
    {ledgerNodeId: ledgerNode.id});

  const peers = endpoints.filter(({targetNode}) => targetNode !== localPeerId)
    .map(({targetNode}) => {
      return {id: targetNode, url: targetNode};
    });

  const promises = peers.map(async peer => {
    try {
      await ledgerNode.peers.add({peer});
    } catch(e) {
      if(e.name !== 'DuplicateError') {
        throw e;
      }
    }
  });
  await Promise.all(promises);

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
    logger.debug('Setting up genesis node...');
    setup = _setupGenesisNode;
  } else {
    // this is a peer node - no ledger agents, list of peer
    logger.debug('Setting up peer node...');
    setup = _setupPeerNode;
  }
  await ledgerInitJob.start({setup});

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
    const didv1 = v1.driver({
      // NOTE: this will contain the port number as required
      hostname: config.server.host,
      httpsAgent: brHttpsAgent.httpsAgent,
      mode: config['veres-one-validator'].environment,
    });
    const ledgerOwner = await _getLedgerOwner();
    // generate the Maintainers's DID Document
    // this needs to be an Ed22519VerificationKey2020
    const keyOptions = {
      seed: Buffer.from(config['veres-one'].maintainerPassphrase)
    };
    const invokeKey = await Ed25519VerificationKey2020.generate(keyOptions);
    const maintainerDoc = await didv1.generate({invokeKey});

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
      JSON.stringify(maintainerDoc, null, 2),
      {encoding: 'utf-8', mode: 0o444});

    // Build the Veres One Genesis Block Ledger Configuration
    const ledgerConfig = config['veres-one'].config;

    // Generate proper did:v1:uuid for elector pool
    let electorPoolId = 'did:v1:uuid:a3dd75aa-bb78-431d-b767-630831882545';
    if(config['veres-one-validator'].environment === 'test') {
      electorPoolId = 'did:v1:test:uuid:a3dd75aa-bb78-431d-b767-630831882545';
    }

    ledgerConfig.electorSelectionMethod.electorPool = electorPoolId;

    // FIXME: what is the ledger supposed to be?
    ledgerConfig.ledger = maintainerDoc.didDocument.id;

    // const sigValidatorConfig =
    //   ledgerConfig.ledgerConfigurationValidator[1];
    // sigValidatorConfig.approvedSigner.push(
    //   `${maintainerDoc.publicDidDocument.id}#authn-key-1`);

    // TODO: decrypt the maintainer and governor private keys
    const assertionMethodKey =
      maintainerDoc.methodFor({purpose: 'assertionMethod'});
    // FIXME: This is a temporary fix until did-v1 driver is updated. Currently,
    // the driver does not export the latest ld-key format. This code also
    // dangerously presumes that the key is an Ed25519VerificationKey2020 which
    // is only safe momentarily.
    const signedConfig = await jsigs.sign(ledgerConfig, {
      documentLoader,
      suite: new Ed25519Signature2020({key: assertionMethodKey}),
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
    const {ledgerNode} = await brLedgerAgentAdd(ledgerOwner, null, options);

    // create the maintainer's DID on the ledger
    logger.debug('Attempting to register the Maintainer\'s DID.');
    await pRetry(async () => didv1.register({
      didDocument: maintainerDoc.didDocument,
      keyPairs: maintainerDoc.keyPairs
    }), {
      retries: 30,
      onFailedAttempt: error => logger.error(
        `Failed to register maintainer DID. Attempt ${error.attemptNumber}.`,
        {error}),
      maxTimeout: RETRY_MAX_TIMEOUT,
    });

    // wait for maintainer's DID to reach consensus
    await pRetry(async () => {
      await ledgerNode.records.get({recordId: maintainerDoc.didDocument.id});
    }, {
      retries: 300,
      onFailedAttempt: async error => {
        if(error.name === 'NotFoundError') {
          const {attemptNumber, retriesLeft} = error;
          logger.debug(
            'Unable to acquire the maintainer\'s DID. Retrying...',
            {attemptNumber, retriesLeft}
          );
        } else {
          logger.error(
            'Unable to acquire the maintainer\'s DID. Aborting...', {error});
          throw error;
        }
      },
      maxTimeout: RETRY_MAX_TIMEOUT,
    });
    logger.debug('Maintainer\'s DID successfully commited to the ledger.');

    await _sendElectorPool({electorPoolId, maintainerDoc});
    logger.debug('Elector Pool Document successfully commited to the ledger.');

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

    const ledgerOwner = await _getLedgerOwner();

    const genesisBlock = await pRetry(() => {
      const hostname = _.sample(config['veres-one'].peers);
      const clientOptions = {
        hostname,
        httpsAgent: brHttpsAgent.httpsAgent
      };
      logger.debug(`Attempting to contact host ${hostname}`);
      const client = new WebLedgerClient(clientOptions);
      return client.getGenesisBlock();
    }, {
      retries: 300,
      onFailedAttempt: async error => {
        logger.error(
          'Unable to acquire the genesis block. Retrying...', {error});
      },
      timeouts: {
        maxTimeout: RETRY_MAX_TIMEOUT,
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

async function _getEndpoints({hostnames}) {
  return Promise.all(hostnames.map(hostname => (async () => {
    const client = new WebLedgerClient(
      {hostname, httpsAgent: brHttpsAgent.httpsAgent});

    try {
      // there is no benefit in running getServiceEndpoint and getTargetNode
      // in parallel
      const endpoint = await client.getServiceEndpoint(
        {serviceId: 'ledgerOperationService'});
      const targetNode = await client.getTargetNode();
      return {client, endpoint, hostname, targetNode};
    } catch(e) {
      // FIXME: remove overly verbose axios error, WebLedgerClient should be
      // update to tame these errors
      delete e.details.error;
      throw e;
    }
  })()));
}

async function _sendElectorPool({electorPoolId, maintainerDoc}) {
  const capabilityInvocationKey =
    maintainerDoc.methodFor({purpose: 'capabilityInvocation'});
  const hostnames = config['veres-one'].electorHosts;
  let targets;
  try {
    targets = await pRetry(() => _getEndpoints({hostnames}), {
      retries: 300,
      onFailedAttempt: async error => {
        logger.error(
          'Unable to acquire details from electorHosts. Retrying...', {error});
      },
      maxTimeout: RETRY_MAX_TIMEOUT,
    });
  } catch(e) {
    logger.debug('Failed to collect target details.', {errorName: e.name});
    throw e;
  }

  const didContexts = [
    constants.DID_CONTEXT_URL,
    constants.VERES_ONE_CONTEXT_V1_URL
  ];
  // targets = [{endpoint, hostname, targetNode}]
  const electorPoolDoc = {
    '@context': didContexts,
    id: electorPoolId,
    type: 'ElectorPool',
    // FIXME: this has to be in the v1 context before we can sign documents
    // veresOneTicketRate: 10, /* TBD */
    controller: maintainerDoc.didDocument.id,
    electorPool: [],
  };
  for(const t of targets) {
    electorPoolDoc.electorPool.push({
      id: `urn:uuid:${uuid()}`,
      type: 'Continuity2017Elector',
      service: {
        type: 'Continuity2017Peer',
        id: `urn:uuid:${uuid()}`,
        serviceEndpoint: t.targetNode
      }
    });
  }

  // pick one node to send the electorPool document to
  const [target] = targets;
  const operation =
    await target.client.wrap({record: electorPoolDoc});

  // FIXME: this is a mock accelerator proof that is only schema validated
  operation.proof = {
    type: 'Ed25519Signature2020',
    created: '2019-01-10T23:10:25Z',
    capability: 'did:v1:uuid:c37e914a-1e2a-4d59-9668-ee93458fd19a',
    capabilityAction: 'write',
    proofValue: 'MOCKPROOF',
    proofPurpose: 'capabilityInvocation',
    invocationTarget: 'urn:zcap:root:ledger',
    verificationMethod: 'did:v1:nym:z279yHL6HsxRzCPU78DAWgZVieb8xPK1mJKJBb' +
      'P8T2CezuFY#z279tKmToKKMjQ8tsCgTbBBthw5xEzHWL6GCqZyQnzZr7wUo'
  };

  const signedOperation = await jsigs.sign(operation, {
    documentLoader,
    suite: new Ed25519Signature2020({key: capabilityInvocationKey}),
    purpose: new CapabilityInvocation({
      capability: electorPoolDoc.id,
      capabilityAction: 'write'
    })
  });

  logger.debug('Sending electorPool operation.', {operation: signedOperation});
  await target.client.sendOperation({operation: signedOperation});
}
