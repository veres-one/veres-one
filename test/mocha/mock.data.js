/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const config = require('bedrock').config;
const constants = config.constants;
const helpers = require('./helpers');

const mock = {};
module.exports = mock;

mock.didDescriptions = {}
mock.events = {};

mock.didDescriptions.beta = helpers.generateDid();
mock.didDescriptions.gamma = helpers.generateDid();
mock.didDescriptions.delta = helpers.generateDid();
mock.didDescriptions.alpha = helpers.generateDid({
  authorization: [{
    // anyone may update the authenticationCredential and authorization
    // fields as long as they provide a specific multi-signature proof
    capability: 'UpdateDidDescription',
    field: ['authenticationCredential', 'authorization'],
    permittedProofType: [{
      proofType: 'RsaSignature2017',
      minimumSignatures: 3,
      authenticationCredential: [
        mock.didDescriptions.beta.authenticationCredential[0],
        mock.didDescriptions.gamma.authenticationCredential[0],
        mock.didDescriptions.delta.authenticationCredential[0]
      ]
    }]
  }]
});

mock.events.create = {
  '@context': 'https://w3id.org/webledger/v1',
  type: 'WebLedgerEvent',
  operation: 'Create',
  input: []
};
