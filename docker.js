/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
const {config} = bedrock;

require('./lib/index');

// use docker specific database hosts
config.redis.host = 'redis';
config.mongodb.host = 'mongo';

bedrock.start();
