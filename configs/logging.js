/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');

// logging
config.loggers.email.silent = true;
config.loggers.email.to = ['cluster@veres.io'];
config.loggers.email.from = 'cluster@veres.io';
