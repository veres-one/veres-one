/*!
 * Copyright (c) 2017-2020 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
const {config} = bedrock;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

config.paths.config = path.join(__dirname, 'configs');
require('./lib/index');

// set validator environment which determines what DID pattern is acceptable:
// 'test' = did:v1:test:<foo>
// 'dev' or 'live' = did:v1:<foo>
config['veres-one-validator'].environment = 'dev';

// temporary development passwords, replace in testnet / production
config['veres-one'].peers = [];
config['veres-one'].electorHosts = [config.server.host];

// maintainer
config['veres-one'].maintainerConfigFile =
  path.join(config.paths.secrets, 'maintainer.jsonld');
config['veres-one'].maintainerPassphrase =
  'password';

// governors
config['veres-one'].governorsConfigFile =
  path.join(config.paths.secrets, 'governors.jsonld');
config['veres-one'].governorsPassphrase =
  'password';

bedrock.start();
