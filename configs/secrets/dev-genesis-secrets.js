/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const config = require('bedrock').config;
const path = require('path');

// temporary development passwords, replace in testnet / production
config['veres-one'].adminPassphrase =
  'password';
config['veres-one'].peers = [];

// maintainer
config['veres-one'].maintainerConfigFile =
  path.join(config.paths.secrets, 'maintainer.ddo');
config['veres-one'].maintainerPassphrase =
  'insecure_eyium0phookoh9geeshewomaekuoTeib';

// governors
config['veres-one'].governorsConfigFile =
  path.join(config.paths.secrets, 'governors.ddo');
config['veres-one'].governorsPassphrase =
  'insecure_shee0iyeifah0Zeew1bufeech4vo8wah';

// accelerator
config['veres-one'].acceleratorEnabled = true;
config['veres-one'].acceleratorConfigFile =
  path.join(config.paths.secrets, 'accelerator.ddo');
config['veres-one'].acceleratorPassphrase =
  'insecure_Gx77CpVMq6Lmyq8452Z3o0TmtrcDnUWH';
