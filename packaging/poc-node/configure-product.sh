#!/usr/bin/env bash

# $config_file will be defined here

genesis_node=`cat $config_file | grep genesis_node | cut -f2 -d=`
elector_hosts=`cat $config_file | grep elector_hosts | cut -f2 -d=` | sed "s/\s//g" | sed "s/,/', '/g"

if [ -z "$genesis_node" ]; then
  genesis_node_value="[]"
else
  genesis_node_value="['$genesis_node']"
fi

if [ -z "$elector_hosts" ]; then
  elector_hosts_value="[]"
else
  elector_hosts_value="['$elector_hosts']"
fi

adminPassphrase=`pwgen -s 32 -1`
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

// ensure TLS is used for all https-agent connections
config['https-agent'].rejectUnauthorized = true;

// set validator environment which determines what DID pattern is acceptable:
// 'test' = did:v1:test:<foo>
// 'dev' or 'live' = did:v1:<foo>
config['veres-one-validator'].environment = 'test';

// temporary development passwords, replace in testnet / production
config['veres-one'].adminPassphrase = '$adminPassphrase';
config['veres-one'].peers = $genesis_node_value;
config[‘veres-one’].electorHosts = $elector_hosts_value;

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
