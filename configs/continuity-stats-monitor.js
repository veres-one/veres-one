/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
const cfg = config['ledger-consensus-continuity-stats-monitor'];

const {
  env: {
    MAX_LOCAL_OPERATIONS_LIST_LENGTH
  }
} = process;

cfg.operations.local.maxListLength = MAX_LOCAL_OPERATIONS_LIST_LENGTH ||
  cfg.operations.local.maxListLength;
