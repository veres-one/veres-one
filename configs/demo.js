/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');
var config = bedrock.config;
var path = require('path');

// common paths
config.paths.cache = path.join('/var', 'cache', 'demo.one.veres.io');
config.paths.log = path.join('/var', 'log', 'demo.one.veres.io');

// core configuration
config.core.workers = 1;
config.core.worker.restart = true;

// master process while starting
config.core.starting.groupId = 'adm';
config.core.starting.userId = 'root';

// master and workers after starting
config.core.running.groupId = 'bedrock';
config.core.running.userId = 'bedrock';

// logging
config.loggers.app.bedrock.enableChownDir = true;
config.loggers.access.bedrock.enableChownDir = true;
config.loggers.error.bedrock.enableChownDir = true;
config.loggers.email.silent = true;
config.loggers.email.to = ['cluster@demo.one.veres.io'];
config.loggers.email.from = 'cluster@demo.one.veres.io';

// only run application on HTTP port
bedrock.events.on('bedrock-express.ready', function(app) {
  // attach express to regular http
  require('bedrock-server').servers.http.on('request', app);
  // cancel default behavior of attaching to HTTPS
  return false;
});

// server info
config.server.port = 8081;
config.server.httpPort = 8080;
config.server.domain = 'demo.one.veres.io';
config.server.host = config.server.domain;

// mongodb config
config.mongodb.name = 'demo_one_veres_io';
config.mongodb.host = 'localhost';
config.mongodb.port = 27017;
config.mongodb.local.collection = 'demo_one_veres_io';
config.mongodb.username = 'veres';
config.mongodb.password = null;
// FIXME: this should be false
config.mongodb.adminPrompt = true;

// this impacts did-io's acquisition of documements from authio
config.jsonld.strictSSL = true;

// Configures `authorization.io` URL for DID lookup
config['did-client']['authorization-io'].baseUrl =
  'https://demo.authorization.io';

// this is DID for demo wallet
config['authn-did-jwt'].crossDomainAuthn.trustedRepositories.push(
  'did:b85d12e5-77cb-4e97-8cb3-a88478b428bc');

// views branding
config.views.brand.name = 'Demo Veres One';

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

// load deployed secrets file
// require('./demo-secrets.js');
