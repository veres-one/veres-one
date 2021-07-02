/*!
 * Copyright (c) 2016-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
const {production} = require('./project');

require('bedrock-mongodb');

// mongodb config
config.mongodb.name = 'veres_one_node';
config.mongodb.adminPrompt = production ? false : true;
