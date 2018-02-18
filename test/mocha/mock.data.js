/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const config = require('bedrock').config;
const constants = config.constants;
const didv1 = require('did-veres-one');
const helpers = require('./helpers');

const mock = {};
module.exports = mock;

mock.equihashParameterN = 64,
mock.equihashParameterK = 3,

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
mock.didDocuments.alpha = await didv1.generate({passphrase: null});
})();

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
