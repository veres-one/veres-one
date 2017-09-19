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

mock.didDescriptions.alpha = helpers.generateDid();
mock.didDescriptions.beta = helpers.generateDid();
mock.didDescriptions.gamma = helpers.generateDid();
mock.didDescriptions.delta = helpers.generateDid();

mock.events.create = {
  '@context': 'https://w3id.org/webledger/v1',
  type: 'WebLedgerEvent',
  operation: 'Create',
  input: []
};
