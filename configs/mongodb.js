/*!
 * Copyright (c) 2016-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
require('bedrock-mongodb');

// mongodb config
config.mongodb.name = 'veres_one';
config.mongodb.username = 'veres';
config.mongodb.password = 'password';
config.mongodb.adminPrompt = true;
