/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');

require('./lib/index');
require('./configs/dev');

bedrock.start();
