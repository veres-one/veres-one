/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
const {config} = bedrock;
const path = require('path');

config.paths.config = path.join('/etc', 'veres-one');
require('./lib/index');

// use docker specific database hosts
config.mongodb.host = 'mongo';
config.redis.host = 'redis';
config.jobs.queueOptions.redis.host = config.redis.host;

bedrock.start();
