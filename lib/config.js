/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
const cc = bedrock.util.config.main.computer();
const config = bedrock.config;
const {constants} = config;
const path = require('path');
require('bedrock-express');
require('bedrock-server');
require('bedrock-views');

require(path.join(config.paths.config, 'paths'));
require(path.join(config.paths.config, 'core'));
require(path.join(config.paths.config, 'logging'));
require(path.join(config.paths.config, 'server'));
require(path.join(config.paths.config, 'express'));
require(path.join(config.paths.config, 'database'));

const ROOT_PATH = path.join(__dirname, '..');

// mongo
config.mongodb.requirements.serverVersion = '>=3.6';

// veres-one pseudo package
config.views.bundle.packages.push({
  path: path.join(ROOT_PATH, 'components'),
  manifest: path.join(ROOT_PATH, 'package.json')
});

// special static paths
config.express.static.push({
  route: '/favicon.ico',
  file: true,
  path: path.join(__dirname, '..', 'components', 'images', 'favicon.ico')
});
config.express.static.push({
  route: '/images',
  path: path.join(__dirname, '..', 'components', 'images')
});

// common validation schemas
config.validation.schema.paths.push(
  path.join(ROOT_PATH, 'schemas')
);

config['veres-one'] = {};
config['veres-one'].did =
  'did:v1:test:uuid:11111111-2222-3333-4444-555555555555';
config['veres-one'].routes = {};
config['veres-one'].routes.accelerator = '/accelerator';
config['veres-one'].routes.dids = '/dids';
config['veres-one'].peers = [];

// accelerator
config['veres-one'].acceleratorEnabled = false;

// load production config which may be customized by bedrock-setup/packager
// must be after config['veres-one'] is initialized
require(path.join(config.paths.config, 'product-config'));

// enable consensus workers
config.ledger.jobs.scheduleConsensusWork.enabled = true;

config['veres-one'].electorPool =
  'did:v1:uuid:a3dd75aa-bb78-431d-b767-630831882545';

cc('veres-one.config', () => ({
  '@context': constants.WEB_LEDGER_CONTEXT_V1_URL,
  type: 'WebLedgerConfiguration',
  ledger: config['veres-one'].did,
  consensusMethod: 'Continuity2017',
  electorSelectionMethod: {
    // FIXME: change to veres one or elector pool selection
    // veres-one-validator will need to be updated as well to allow new type
    type: 'MostRecentParticipants',
    electorPool: config['veres-one'].electorPool,
  },
  sequence: 0,
  ledgerConfigurationValidator: [{
    type: 'VeresOneValidator2017',
  }],
  //   FIXME: validator can't validate sigs using DID keys, how is that supposed
  //   to work?  Maintainer DID is generated in ledger.js and the key associated
  //   with that is used to sign configuration.  Signature Validator attempts to
  //   dereference the key (e.g. did:v1:test:nym:z2cJ...Kx7#authn-key-1)
  //   and fails.
  //
  //   type: 'SignatureValidator2017',
  //   validatorFilter: [{
  //     type: 'ValidatorFilterByType',
  //     validatorFilterByType: ['WebLedgerConfiguration']
  //   }],
  //   approvedSigner: [], // this will be filled in by ledger.js
  //   minimumSignaturesRequired: 1 // is this right?
  // }*/],
  operationValidator: [{
    type: 'VeresOneValidator2017',
    validatorFilter: [{
      type: 'ValidatorFilterByType',
      validatorFilterByType: ['CreateWebLedgerRecord', 'UpdateWebLedgerRecord']
    }]
  }]
}));

// roles
require('../configs/roles');
