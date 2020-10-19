/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
const {config} = require('bedrock');

const cfg = config['ledger-consensus-continuity'];

cfg.writer.maxEvents = 100;
