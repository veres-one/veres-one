/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
const config = bedrock.config;
const path = require('path');

// common paths
config.paths.cache = path.join('/var', 'cache', 'veres.one');
config.paths.log = path.join('/var', 'log', 'veres.one');

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
config.loggers.email.to = ['cluster@veres.one'];
config.loggers.email.from = 'cluster@veres.one';

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
config.server.domain = 'veres.one';
config.server.host = config.server.domain;

// mongodb config
config.mongodb.name = 'veres_one';
config.mongodb.host = 'localhost';
config.mongodb.port = 27017;
config.mongodb.local.collection = 'veres_one';
config.mongodb.username = 'veres';
config.mongodb.password = null;
// FIXME: this should be false
config.mongodb.adminPrompt = true;

// this impacts did-io's acquisition of documements from authio
config.jsonld.strictSSL = true;

// Configures `authorization.io` URL for DID lookup
config['did-client']['authorization-io'].baseUrl =
  'https://demo.authorization.io';

// views branding
config.views.brand.name = 'Veres One';

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

// restrict elector candidates to peers on the veres.one domain
// FIXME: this is for testnet_v2 only, used in leui of electorPool document
config['ledger-consensus-continuity-es-most-recent-participants']
  .electorCandidateFilterPattern =
    /^https:\/\/[^\/.][^\/]*\.veres\.one\/consensus\/continuity2017\/voters\//;

// load deployed secrets file
require('./production-secrets.js');
