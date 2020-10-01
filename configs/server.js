/*!
 * Copyright (c) 2016-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
require('bedrock-server');

// server info
config.server.port = process.env.BEDROCK_HTTPS_PORT;
config.server.httpPort = process.env.BEDROCK_HTTP_PORT;
config.server.domain = process.env.NODE_HOST;
config.server.host = process.env.BEDROCK_SERVER_HOST;
