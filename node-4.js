/*!
 * Copyright (c) 2017-2019 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
const {config} = bedrock;
const path = require('path');

config.paths.config = path.join(__dirname, 'configs');
require('./lib/index');

// disable sessions server wide
config.express.useSession = false;

// core configuration
config.core.workers = 4;

config.server.port = 49443;
config.server.httpPort = 49080;
config.server.domain = 'node-4.veres.one.local';
config.mongodb.name = 'veres_one_node_4';

// ensure TLS is used for all https-agent connections
config['https-agent'].rejectUnauthorized = false;

// set validator environment which determines what DID pattern is acceptable:
// 'test' = did:v1:test:<foo>
// 'dev' or 'live' = did:v1:<foo>
config['veres-one-validator'].environment = 'test';

// temporary development passwords, replace in testnet / production
config['veres-one'].peers = ['node-1.veres.one.local:46443'];
config['veres-one'].electorHosts = [
  'node-1.veres.one.local:46443',
  'node-2.veres.one.local:47443',
  'node-3.veres.one.local:48443',
  'node-4.veres.one.local:49443'
];

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

// accelerator
config['veres-one'].acceleratorEnabled = false;
config['veres-one'].acceleratorConfigFile =
  path.join(config.paths.secrets, 'accelerator.jsonld');
config['veres-one'].acceleratorPassphrase =
  'password';
config['veres-one'].acceleratorCapability =
  'did:v1:test:uuid:aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

bedrock.start();
