/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
const {config} = require('bedrock');

const cfg = config['ledger-consensus-continuity'];

// continuity config
const {
  env: {
    ENABLE_CONSENUS_WORKERPOOL,
    WRITER_MAX_EVENTS
  }
} = process;

cfg.consensus.workerpool.enabled = ENABLE_CONSENUS_WORKERPOOL !== 'false';
cfg.writer.maxEvents = parseInt(WRITER_MAX_EVENTS, 10) || cfg.writer.maxEvents;
