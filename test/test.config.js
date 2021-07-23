/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const config = require('bedrock').config;
const os = require('os');
const path = require('path');

const permissions = config.permission.permissions;
const roles = config.permission.roles;

// mocha tests
config.mocha.tests.push(path.join(__dirname, 'mocha'));

// common paths
config.paths.cache = path.join(__dirname, '..', '.cache');
config.paths.log = path.join(os.tmpdir(), 'test.veres.one.localhost');

// server info
config.server.port = 23443;
config.server.httpPort = 22080;
config.server.domain = 'genesis.veres.one.localhost';
config.server.host = 'genesis.veres.one.localhost:23443';

// mongodb config
config.mongodb.name = 'veres_one_test';
config.mongodb.collection = 'veres_one_test';
config.mongodb.dropCollections = {};
config.mongodb.dropCollections.onInit = true;
config.mongodb.dropCollections.collections = [];

roles['veres-one.test'] = {
  id: 'veres-one.test',
  label: 'Test Role',
  comment: 'Role for Test User',
  sysPermission: [
    permissions.LEDGER_NODE_ACCESS.id,
    permissions.LEDGER_NODE_CREATE.id,
    permissions.LEDGER_NODE_REMOVE.id,
    permissions.LEDGER_AGENT_ACCESS.id,
    permissions.LEDGER_AGENT_CREATE.id,
    permissions.LEDGER_AGENT_REMOVE.id
    /*
    permissions.IDENTITY_REMOVE.id,
    permissions.IDENTITY_ACCESS.id,
    permissions.IDENTITY_INSERT.id,
    permissions.IDENTITY_EDIT.id,
    permissions.IDENTITY_UPDATE_MEMBERSHIP.id,
    permissions.PUBLIC_KEY_REMOVE.id,
    permissions.PUBLIC_KEY_ACCESS.id,
    permissions.PUBLIC_KEY_CREATE.id,
    permissions.PUBLIC_KEY_EDIT.id
    */
  ]
};

// const dir = path.join(__dirname);
// config.requirejs.bower.packages.push({
//   path: path.join(dir, 'components'),
//   manifest: path.join(dir, 'bower.json')
// });

//const parentDir = path.join(__dirname, '..');
//config.requirejs.bower.packages.push({
//  path: path.join(parentDir, 'components'),
//  manifest: path.join(parentDir, 'bower.json')
//});

// determine what types of dids are produced
// environment === dev produces did:v1:<did>
// environment === test produces did:v1:test:<did>
config['veres-one-validator'].environment = 'dev';

// enable consensus workers
config.ledger.jobs.scheduleConsensusWork.enabled = true;

config['veres-one'].maintainerConfigFile =
  path.join(process.cwd(), 'maintainer.jsonld');

config['veres-one'].electorHosts = [config.server.host];
