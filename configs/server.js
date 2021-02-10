/*!
 * Copyright (c) 2016-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
require('bedrock-server');

// server info
config.server.port = 45443;
config.server.httpPort = 45080;
config.server.domain = 'localhost';
config.server.host = 'localhost:45443';
