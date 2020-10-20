/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');

const cfg = config.loggers;

// logging
cfg.email.silent = true;
cfg.email.to = ['cluster@veres.io'];
cfg.email.from = 'cluster@veres.io';

const {
  env: {
    BEDROCK_LOG_LEVEL
  }
} = process;

// transport for console logging
cfg.console.level = BEDROCK_LOG_LEVEL || cfg.console.level;

// file transport for app logging
cfg.app.level = BEDROCK_LOG_LEVEL || cfg.app.level;
