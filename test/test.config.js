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

// mongodb config
config.mongodb.name = 'veres_one_test';
config.mongodb.local.collection = 'veres_one_test';
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

// Set mode to 'test', so that DIDs are created as 'did:v1:test:...' in tests
config['veres-one-validator'].environment = 'test';
