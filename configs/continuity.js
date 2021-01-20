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
    VERES_ONE_ENABLE_LOCAL_EVENTS_VALIDATION,
    WRITER_MAX_EVENTS,
    MAX_LOCAL_OPERATIONS_LIST_LENGTH
  }
} = process;

cfg.consensus.workerpool.enabled = ENABLE_CONSENUS_WORKERPOOL === 'true';
cfg.gossip.maxEvents = parseInt(GOSSIP_MAX_EVENTS, 10) || cfg.gossip.maxEvents;
cfg.writer.maxEvents = parseInt(WRITER_MAX_EVENTS, 10) || cfg.writer.maxEvents;

// setup max operation queue size
cfg.operations.maxQueueSize = parseInt(MAX_LOCAL_OPERATIONS_LIST_LENGTH, 10) ||
  cfg.operations.maxQueueSize;

if(VERES_ONE_ENABLE_LOCAL_EVENTS_VALIDATION === 'true') {
  const host = process.env.VERES_ONE_GOSSIP_EVENTS_WORKER_SERVICE_HOST;
  const port = process.env.VERES_ONE_GOSSIP_EVENTS_WORKER_SERVICE_PORT_HTTPS;
  const baseUrl = port === '443' ?
    `https://${host}` : `https://${host}:${port}`;

  const httpsAgentOpts = {
    rejectUnauthorized: false,
    keepAlive: true,
  };

  cfg.gossip.eventsValidation.baseUrl = baseUrl;
  cfg.gossip.eventsValidation.httpsAgentOpts = httpsAgentOpts;
}
