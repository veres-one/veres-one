/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
const {config} = require('bedrock');
const {production} = require('./project');

// allow self-signed certificates in dev
config['https-agent'].rejectUnauthorized = production ? false : true;
