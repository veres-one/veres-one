/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');

// core configuration
config.core.workers = 1;
config.core.master.title = 'veres-one-1d';
config.core.worker.title = 'veres-one-1d-worker';
config.core.worker.restart = false;
