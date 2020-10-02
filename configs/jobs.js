/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');

const {
  env: {
    REDIS_HOST,
    REDIS_PORT,
  }
} = process;

config.jobs.queueOptions.redis.host = REDIS_HOST ||
  config.jobs.queueOptions.redis.host;
config.jobs.queueOptions.redis.port = REDIS_PORT ||
  config.jobs.queueOptions.redis.port;
