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

config.redis.host = REDIS_HOST || config.redis.host;
config.redis.port = REDIS_PORT || config.redis.port;
