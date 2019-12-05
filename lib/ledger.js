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
const {config, util: {delay, uuid, BedrockError}} = bedrock;
const {constants} = config;
const {documentLoader} = require('bedrock-jsonld-document-loader');
const fs = require('fs').promises;
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
const {CapabilityInvocation} = require('ocapld');
const {WebLedgerClient} = require('web-ledger-client');

const brLedgerAgentAdd = promisify(brLedgerAgent.add);

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
    const Store = require('flex-docstore');
    const didStore = Store.using('files', {
      dir: path.join(process.cwd(), 'secret_dids'),
      extension: '.json',
    });
    const didv1 = new (require('did-veres-one')).VeresOne({
      didStore,
      // NOTE: this will contain the port number as required
      hostname: config.server.host,
      httpsAgent: brHttpsAgent.httpsAgent,
      mode: config['veres-one-validator'].environment,
    });
    const ledgerOwner = await _getLedgerOwner();
    // generate the Maintainers's DID Document

    // FIXME: enable passphrase
    // const maintainerDoc = await didv1.generate(
    //   {passphrase: config['veres-one'].maintainerPassphrase});
    const maintainerDoc = await didv1.generate();

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

    // TODO: Validator currently does not require `test` in UUID documents
    // if that requriement changes, this code can be used

    // if(config['veres-one-validator'].environment === 'test') {
    // } else {
    // }

    const electorPoolId = ledgerConfig.electorSelectionMethod.electorPool =
    'did:v1:uuid:a3dd75aa-bb78-431d-b767-630831882545';

    // FIXME: what is the ledger supposed to be?
    ledgerConfig.ledger = maintainerDoc.doc.id;

    // const sigValidatorConfig =
    //   ledgerConfig.ledgerConfigurationValidator[1];
    // sigValidatorConfig.approvedSigner.push(
    //   `${maintainerDoc.publicDidDocument.id}#authn-key-1`);

    // TODO: decrypt the maintainer and governor private keys
    const method = maintainerDoc.getVerificationMethod(
      {proofPurpose: 'assertionMethod'});
    const assertionMethodKey = maintainerDoc.keys[method.id];
    const signedConfig = await jsigs.sign(ledgerConfig, {
      compactProof: false,
      documentLoader,
      suite: new Ed25519Signature2018({key: assertionMethodKey}),
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
    await didv1.register({didDocument: maintainerDoc});

    // wait for maintainer's DID to reach consensus
    await pRetry(async () => {
      await ledgerNode.records.get({recordId: maintainerDoc.doc.id});
    }, {
      retries: 300,
      onFailedAttempt: async error => {
        if(error.name === 'NotFoundError') {
          const {attemptNumber, retriesLeft} = error;
          logger.debug(
            'Unable to acquire the maintainer\'s DID. Retrying...',
            {attemptNumber, retriesLeft}
          );
          await delay(500);
        } else {
          logger.error(
            'Unable to acquire the maintainer\'s DID. Aborting...', {error});
          throw error;
        }
      }
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

async function _getEndpoints({hostnames}) {
  return Promise.all(hostnames.map(hostname => (async () => {
    const client = new WebLedgerClient(
      {hostname, httpsAgent: brHttpsAgent.httpsAgent});

    // there is no benefit in running these in parallel
    const endpoint = await client.getServiceEndpoint(
      {serviceId: 'ledgerOperationService'});
    const targetNode = await client.getTargetNode();
    return {client, endpoint, hostname, targetNode};
  })()));
}

async function _sendElectorPool({electorPoolId, maintainerDoc}) {
  const method = maintainerDoc.getVerificationMethod(
    {proofPurpose: 'capabilityInvocation'});
  const capabilityInvocationKey = maintainerDoc.keys[method.id];
  const hostnames = config['veres-one'].electorHosts;
  let targets;
  try {
    targets = await _getEndpoints({hostnames});
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
    controller: maintainerDoc.doc.id,
    electorPool: [],
  };
  for(const t of targets) {
    electorPoolDoc.electorPool.push({
      // FIXME: is this right? where does the elector nym did come from?
      id: `urn:uuid:${uuid()}`,
      elector: 'did:v1:nym:z6MkgxjunEaHCzuu56Nkgj6WdCQG8VhY8jyRYEFgmQCXF4Rp',
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
  const operation = await target.client.wrap({record: electorPoolDoc});

  // FIXME: this is a mock accelerator proof that is only schema validated
  operation.proof = {
    type: 'Ed25519Signature2018',
    created: '2019-01-10T23:10:25Z',
    capability: 'did:v1:uuid:c37e914a-1e2a-4d59-9668-ee93458fd19a',
    capabilityAction: 'write',
    jws: 'MOCKPROOF',
    proofPurpose: 'capabilityInvocation',
    verificationMethod: 'did:v1:nym:z279yHL6HsxRzCPU78DAWgZVieb8xPK1mJKJBb' +
      'P8T2CezuFY#z279tKmToKKMjQ8tsCgTbBBthw5xEzHWL6GCqZyQnzZr7wUo'
  };

  const signedOperation = await jsigs.sign(operation, {
    compactProof: false,
    documentLoader,
    suite: new Ed25519Signature2018({key: capabilityInvocationKey}),
    purpose: new CapabilityInvocation({
      capability: electorPoolDoc.id,
      capabilityAction: 'create'
    })
  });

  logger.debug('Sending electorPool operation.', {operation: signedOperation});
  await target.client.sendOperation({operation: signedOperation});
}
