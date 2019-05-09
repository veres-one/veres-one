/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
require('bedrock-express');

// express info
config.express.session.secret = 'NOTASECRET';
config.express.session.key = 'veres-one.sid';
config.express.session.prefix = 'veres-one.';
