/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');

require('./lib/index');
require('./configs/testnet');

bedrock.start();
