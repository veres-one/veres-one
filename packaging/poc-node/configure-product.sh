#!/usr/bin/env bash

# $config_file will be defined here

genesis_node=`cat $config_file | grep genesis_node | cut -f2 -d=`

if [ -z "$genesis_node" ]; then
  genesis_node_value="[]"
else
  genesis_node_value="['$genesis_node']"
fi

maintainerPassphrase=`pwgen -s 32 -1`
governorsPassphrase=`pwgen -s 32 -1`
acceleratorPassphrase=`pwgen -s 32 -1`

# Disable memory-backed sessions as they cause memory leaks in express
cat >>/etc/$VPP_PRODUCT_ID/configs/express.js <<EOFEXPRESS

// disable sessions server wide
config.express.useSession = false;
EOFEXPRESS

# NOTE: DO NOT USE BACKTICKS IN JS CODE HERE, BASH INTERPRETS AS CMD EXECUTION
mkdir -p /etc/$vpp_product_id/configs/secrets

cat >/etc/$vpp_product_id/configs/product-config.js <<EOFPRODUCT
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
  '$maintainerPassphrase';

// governors
config['veres-one'].governorsConfigFile =
  path.join(config.paths.secrets, 'governors.jsonld');
config['veres-one'].governorsPassphrase =
  '$governorsPassphrase';

// accelerator
config['veres-one'].acceleratorEnabled = false;
config['veres-one'].acceleratorConfigFile =
  path.join(config.paths.secrets, 'accelerator.jsonld');
config['veres-one'].acceleratorPassphrase =
  '$acceleratorPassphrase';
config['veres-one'].acceleratorCapability =
  'did:v1:test:uuid:aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

EOFPRODUCT
