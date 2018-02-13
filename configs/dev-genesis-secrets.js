/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const config = require('bedrock').config;
const path = require('path');

// temporary development passwords, replace in testnet / production
config['veres-one'].adminPassphrase =
  'password';
config['veres-one'].maintainerConfigFile =
  path.join(config.paths.keys, 'maintainer.ddo');
config['veres-one'].governorsConfigFile =
  path.join(config.paths.keys, 'governors.ddo');
config['veres-one'].maintainerPassphrase =
  'insecure_eyium0phookoh9geeshewomaekuoTeib';
config['veres-one'].governorsPassphrase =
  'insecure_shee0iyeifah0Zeew1bufeech4vo8wah';
