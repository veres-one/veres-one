/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

// eslint-disable-next-line dot-notation
process.env['NODE_PATH'] = '../node_modules';
const bedrock = require('bedrock');
const path = require('path');

const {config} = bedrock;
config.paths.config = path.join(__dirname, '..', 'configs');

// NOTE: it is critical that bedrock-protractor be required first so that
// it can register a bedrock.cli event listener
require('../lib/index');

config.paths.config = path.join(__dirname, '..', 'configs');

require('../configs/dev-genesis');

require('bedrock-test');

// ensure `helpers` attaches bedrock event listeners
require('./mocha/helpers');

bedrock.start();
