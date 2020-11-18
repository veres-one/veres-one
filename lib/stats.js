/*!
 * Copyright (c) 2017-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const {config} = bedrock;

require('bedrock-stats');
require('bedrock-stats-storage-redis');
require('bedrock-ledger-node-cooldown-monitor');
require('bedrock-ledger-node-stats-monitor');
require('bedrock-ledger-consensus-continuity-stats-monitor');
require('bedrock-stats-prometheus');

const {
  env: {
    MAX_LOCAL_OPERATIONS_LIST_LENGTH,
    VERES_ONE_STATS_WORKER_ENABLE,
  }
} = process;

config.stats.worker.enable = !!VERES_ONE_STATS_WORKER_ENABLE;

// generate stats reports at this interval in ms
config.stats.report.interval = 10 * 1000;

// align window size with the reporting interval
config['ledger-consensus-continuity-stats-monitor'].operations
  .slidingWindowSeconds = 10;

// setup storage API bedrock-stats-storage-redis
config.stats.storage.push({name: 'redis'});

// the TTL of history to maintain in redis in ms
config['stats-storage-redis'].history.ttl = 5 * 60 * 1000;

// setup max local operations list length
config['ledger-consensus-continuity-stats-monitor'].operations.local
  .maxListLength = parseInt(MAX_LOCAL_OPERATIONS_LIST_LENGTH, 10) ||
  config['ledger-consensus-continuity-stats-monitor'].operations.local
    .maxListLength;
