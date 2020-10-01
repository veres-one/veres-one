/*!
 * Copyright (c) 2016-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
const {production} = require('./project');
require('bedrock-mongodb');

// mongodb config
const {
  env: {
    MONGODB_AUTH_SOURCE,
    MONGODB_HOST,
    MONGODB_PORT,
    MONGODB_USERNAME,
    MONGODB_PASSWORD,
    MONGODB_NAME,
    MONGODB_URL,
  }
} = process;

config.mongodb.url = MONGODB_URL;
config.mongodb.host = MONGODB_HOST;
config.mongodb.port = MONGODB_PORT;
config.mongodb.username = MONGODB_USERNAME;
config.mongodb.password = MONGODB_PASSWORD;
config.mongodb.name = MONGODB_NAME;
config.mongodb.connectOptions.authSource = MONGODB_AUTH_SOURCE || MONGODB_NAME;
config.mongodb.adminPrompt = production ? false : true;
