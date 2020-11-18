/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
const {config} = require('bedrock');

const cfg = config['ledger-consensus-continuity'];

// continuity config
const {
  env: {
    ENABLE_CONSENUS_WORKERPOOL,
    GOSSIP_MAX_EVENTS,
    VERES_ONE_ENABLE_GOSSIP_EVENTS_WORKER,
    VERES_ONE_MAX_CONCURRENT_EVENTS_PER_WORKER,
    WRITER_MAX_EVENTS,
  }
} = process;

cfg.consensus.workerpool.enabled = ENABLE_CONSENUS_WORKERPOOL !== 'false';
cfg.gossip.maxEvents = parseInt(GOSSIP_MAX_EVENTS, 10) || cfg.gossip.maxEvents;
cfg.writer.maxEvents = parseInt(WRITER_MAX_EVENTS, 10) || cfg.writer.maxEvents;

cfg.gossip.batchProcess.enable = !!VERES_ONE_ENABLE_GOSSIP_EVENTS_WORKER;
cfg.gossip.batchProcess.concurrentEventsPerWorker =
  !!VERES_ONE_MAX_CONCURRENT_EVENTS_PER_WORKER;
