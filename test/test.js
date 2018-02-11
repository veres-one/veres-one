/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

process.env['NODE_PATH'] = '../node_modules';
const bedrock = require('bedrock');
// NOTE: it is critical that bedrock-protractor be required first so that
// it can register a bedrock.cli event listener
require('bedrock-protractor');
require('../lib');

require('../configs/dev-genesis');

require('bedrock-test');

// ensure `helpers` attaches bedrock event listeners
require('./mocha/helpers');

bedrock.start();
