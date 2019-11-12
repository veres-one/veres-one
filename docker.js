/*
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
const {config} = bedrock;
const path = require('path');
const process = require('process');

// load configs from /etc/veres-one
config.paths.config = path.join('/etc', 'veres-one');

// ensure that files in /etc/veres-one can require files in app directory
process.env.NODE_PATH = '/home/node/app/node_modules';
require('module').Module._initPaths();

// load system and base configs
require('./lib/index');

bedrock.start();
