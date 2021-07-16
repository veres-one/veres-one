/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config: {constants}} = require('bedrock');
const v1 = require('did-veres-one');
// const helpers = require('./helpers');

const mock = {};
module.exports = mock;

mock.configurations = {};
mock.didDocuments = {};
mock.events = {};
mock.operations = {};
mock.keys = {};

//mock.keys.alpha = helpers.generateDidKeys();
//mock.keys.beta = helpers.generateDidKeys();
//mock.keys.delta = helpers.generateDidKeys();
//mock.keys.epsilon = helpers.generateDidKeys();
//mock.keys.gamma = helpers.generateDidKeys();

(async function() {
  const didv1 = v1.driver();
  mock.didDocuments.alpha = await didv1.generate({passphrase: null});
})();

mock.configurations.alpha = {
  '@context': [
    constants.WEB_LEDGER_CONTEXT_V1_URL,
    constants.ED25519_2020_CONTEXT_V1_URL
  ],
  type: 'WebLedgerConfiguration',
  ledger: null,
  consensusMethod: 'Continuity2017',
  electorSelectionMethod: {
    type: 'ElectorPoolElectorSelection',
    electorPool: 'did:v1:uuid:1ab9d607-c2cf-47d3-a3e2-bfecfdd0fce6',
  },
  sequence: 0,
  ledgerConfigurationValidator: [{
    type: 'VeresOneValidator2017',
  }],
  operationValidator: [{
    type: 'VeresOneValidator2017',
    validatorFilter: [{
      type: 'ValidatorFilterByType',
      validatorFilterByType: ['CreateWebLedgerRecord', 'UpdateWebLedgerRecord']
    }]
  }]
};

mock.operations.create = {
  '@context': constants.WEB_LEDGER_CONTEXT_V1_URL,
  type: 'CreateWebLedgerRecord',
  record: {}
};

mock.operations.update = {
  '@context': constants.WEB_LEDGER_CONTEXT_V1_URL,
  type: 'UpdateWebLedgerRecord',
  ledgerRecord: 'did:...',
  patch: '',
  proof: {}
};
