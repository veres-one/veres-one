/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
const config = bedrock.config;
const fs = require('fs');
const path = require('path');

// common paths
config.paths.log = path.join('/var', 'log', 'testnet.veres.one');
config.paths.keys = path.join(__dirname, 'keys');

// core configuration
config.core.workers = 1;
config.core.worker.restart = true;

// master process while starting
config.core.starting.groupId = 'veres-one';
config.core.starting.userId = 'veres-one';

// master and workers after starting
config.core.running.groupId = 'veres-one';
config.core.running.userId = 'veres-one';

// logging
config.loggers.app.bedrock.enableChownDir = true;
config.loggers.access.bedrock.enableChownDir = true;
config.loggers.error.bedrock.enableChownDir = true;
config.loggers.email.silent = true;
config.loggers.email.to = ['cluster@testnet.veres.one'];
config.loggers.email.from = 'cluster@testnet.veres.one';

// only run application on HTTP port
bedrock.events.on('bedrock-express.ready', function(app) {
  // attach express to regular http
  require('bedrock-server').servers.http.on('request', app);
  // cancel default behavior of attaching to HTTPS
  return false;
});

// server info
config.server.port = 10443;
config.server.httpPort = 10080;
config.server.domain = 'testnet.veres.one';
config.server.host = config.server.domain;

// mongodb config
config.mongodb.name = 'testnet_veres_one';
config.mongodb.host = 'localhost';
config.mongodb.port = 27017;
// mongodb auth options are commented out, because if a username
// and password are set it tries to login.
// uncomment them to use auth
//config.mongodb.username = 'veres';
//config.mongodb.password = null;
//config.mongodb.connectOptions.authSource = 'kubernetes-auth-collection';
// FIXME: this should be false
//config.mongodb.adminPrompt = true;

config['https-agent'].rejectUnauthorized = false;

// Configures `authorization.io` URL for DID lookup
config['did-client']['authorization-io'].baseUrl =
  'https://demo.authorization.io';

// views branding
config.views.brand.name = 'Veres One Testnet';

// update view vars
config.views.vars.productionMode = true;
config.views.vars.baseUri = config.server.baseUri;
config.views.vars.title = config.views.brand.name;
config.views.vars.siteTitle = config.views.brand.name;
config.views.vars.supportDomain = config.server.domain;
config.views.vars.debug = false;
config.views.vars.minify = true;

// FIXME: add logo img
config.views.vars.style.brand.alt = config.views.brand.name;

// REST API documentation
config.docs.vars.brand = config.brand.name;
config.docs.vars.baseUri = config.server.baseUri;

// Veres One development config
config['veres-one'].did = 'did:v1:testnet:ledger';
config['veres-one'].privateKey =
  path.join(config.paths.keys, 'testnet-private-key.pem');
config['veres-one'].publicKeyPem =
  fs.readFileSync(
    path.join(config.paths.keys, 'testnet-public-key.pem'), 'utf-8');

// use quick equihash setting
config['veres-one-validator'].equihash.equihashParameterN = 64;
config['veres-one-validator'].equihash.equihashParameterK = 3;

// load deployed secrets file
require('./testnet-secrets.js');
