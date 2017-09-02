/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

process.env['NODE_PATH'] = '../node_modules';
const bedrock = require('bedrock');
const brDidClient = require('bedrock-did-client');
// NOTE: it is critical that bedrock-protractor be required first so that
// it can register a bedrock.cli event listener
require('bedrock-protractor');
//require('bedrock-permission'); // FIXME
require('bedrock-ledger-node');
require('bedrock-ledger-agent');
require('bedrock-ledger-consensus-uni');
require('bedrock-ledger-context');
require('bedrock-ledger-validator-equihash');
require('bedrock-ledger-validator-signature');
require('bedrock-ledger-storage-mongodb');
require('../lib');
require('../configs/dev');

require('bedrock-test');
bedrock.start();
