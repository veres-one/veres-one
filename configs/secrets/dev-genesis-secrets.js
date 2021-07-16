/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const config = require('bedrock').config;
const path = require('path');

// temporary development passwords, replace in testnet / production
config['veres-one'].adminPassphrase = 'password';
config['veres-one'].peers = [];

// maintainer
config['veres-one'].maintainerConfigFile =
  path.join(config.paths.secrets, 'maintainer.jsonld');
// FIXME remove this password entirely and replace it with a temporary key
// pair that MUST be replaced in production but is only used in dev mode
// consider using `ensureOverride` feature,
// see: https://github.com/digitalbazaar/bedrock/blob/main/lib/config.js#L61
config['veres-one'].maintainerPassphrase = 'vlSkAkQQOpSrBf9H1L7KVOU6wuHM0+t' +
  'ack9x9kq2ECpew5uOaaqWxIj7MDUX9jEc03YuG6uAakgcriMDCrOKBTLvS6IDgLKpF1OLdJ0' +
  'k8HBruVOAhiHuHlhyrAfmUIP3fo3B69NtZ6lVJ6V17yQElbhcIWrdoO4jgf5qMEKEyhQ=';

// governors
config['veres-one'].governorsConfigFile =
  path.join(config.paths.secrets, 'governors.jsonld');
config['veres-one'].governorsPassphrase =
  'insecure_shee0iyeifah0Zeew1bufeech4vo8wah';

// accelerator
config['veres-one'].acceleratorEnabled = false;
config['veres-one'].acceleratorConfigFile =
  path.join(config.paths.secrets, 'accelerator.jsonld');
config['veres-one'].acceleratorPassphrase =
  'insecure_Gx77CpVMq6Lmyq8452Z3o0TmtrcDnUWH';
config['veres-one'].acceleratorCapability =
  'did:v1:test:uuid:aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
