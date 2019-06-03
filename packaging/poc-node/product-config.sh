#!/usr/bin/env bash

# $config_file will be defined here

genesis_node=`cat $config_file | grep genesis_node | cut -f2 -d=`

if [ -z "$genesis_node" ]; then
  genesis_node_value="[]"
else
  genesis_node_value="['$genesis_node']"
fi

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
config['veres-one'].peers = $genesis_node_value;

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
