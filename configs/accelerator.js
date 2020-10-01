/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
const {config} = require('bedrock');
const path = require('path');

// accelerator
config['veres-one'].acceleratorEnabled = false;
config['veres-one'].acceleratorConfigFile =
  path.join(config.paths.secrets, 'accelerator.jsonld');
config['veres-one'].acceleratorPassphrase =
  'password';
config['veres-one'].acceleratorCapability =
  'did:v1:test:uuid:aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
