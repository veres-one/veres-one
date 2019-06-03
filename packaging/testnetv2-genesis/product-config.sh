#!/usr/bin/env bash

# $config_file will be defined here

# For the genesis node, peers below is hard coded to []

# NOTE: DO NOT USE BACKTICKS IN JS CODE HERE, BASH INTERPRETS AS CMD EXECUTION
cat >/home/$vpp_user/src/$vpp_product_id/configs/product-config.js <<EOFPRODUCT
'use strict';

const {config} = require('bedrock');
const path = require('path');

// core configuration
config.core.workers = 2;

// set validator environment which determines what DID pattern is acceptable:
// 'test' = did:v1:test:<foo>
// 'dev' or 'live' = did:v1:<foo>
config['veres-one-validator'].environment = 'test';

// temporary development passwords, replace in testnet / production
config['veres-one'].adminPassphrase = 'password';
config['veres-one'].peers = [];

// restrict electors to nodes operating on veres.one domain
config['ledger-consensus-continuity-es-most-recent-participants']
  .electorCandidateFilterPattern =
    /^https:\/\/[^\/.][^\/]*\.veres\.one\/consensus\/continuity2017\/voters\//;

// maintainer
config['veres-one'].maintainerConfigFile =
  path.join(config.paths.secrets, 'maintainer.jsonld');
config['veres-one'].maintainerPassphrase =
  'insecure_eyium0phookoh9geeshewomaekuoTeib';

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

EOFPRODUCT
