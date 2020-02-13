/*!
 * Copyright (c) 2017-2019 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
const {config} = bedrock;
const path = require('path');

config.paths.config = path.join(__dirname, 'configs');
require('./lib/index');

config.server.domain = 'node-1.veres.one.local';
config.server.host = config.server.domain;
config.server.baseUri = 'https://' + config.server.domain;

bedrock.start();
