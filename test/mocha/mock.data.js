/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const config = require('bedrock').config;
const constants = config.constants;
const helpers = require('./helpers');

const mock = {};
module.exports = mock;

mock.equihashParameterN = 64,
mock.equihashParameterK = 3,

mock.didDescriptions = {};
mock.events = {};
mock.operations = {};
mock.keys = {};

mock.keys.alpha = helpers.generateDidKeys();
mock.keys.beta = helpers.generateDidKeys();
mock.keys.delta = helpers.generateDidKeys();
mock.keys.epsilon = helpers.generateDidKeys();
mock.keys.gamma = helpers.generateDidKeys();

mock.didDescriptions.alpha = helpers.generateDid(mock.keys.alpha);
mock.didDescriptions.beta = helpers.generateDid(mock.keys.beta);
mock.didDescriptions.delta = helpers.generateDid(mock.keys.delta);
mock.didDescriptions.epsilon = helpers.generateDid(mock.keys.epsilon);
mock.didDescriptions.gamma = helpers.generateDid(mock.keys.gamma);

mock.operations.create = {
  '@context': constants.WEB_LEDGER_CONTEXT_V1_URL,
  type: 'CreateWebLedgerRecord',
  record: {}
};

mock.events.create = {
  '@context': constants.WEB_LEDGER_CONTEXT_V1_URL,
  type: 'WebLedgerEvent',
  operation: []
};

mock.events.update = {
  '@context': constants.WEB_LEDGER_CONTEXT_V1_URL,
  type: 'WebLedgerEvent',
  operation: [{
    type: 'UpdateWebLedgerRecord',
    ledgerRecord: 'did:...',
    patch: '',
    proof: {}
  }]
};
