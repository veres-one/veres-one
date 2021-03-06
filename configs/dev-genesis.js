/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const config = require('bedrock').config;
const os = require('os');
const path = require('path');

// common paths
config.paths.cache = path.join(__dirname, '..', '.cache');
config.paths.log = path.join(os.tmpdir(), 'veres.one.localhost');
config.paths.secrets = path.join(__dirname, 'secrets');

// core
// 0 means use # of cpus
config.core.workers = 1;
config.core.master.title = 'veres-one-1d';
config.core.worker.title = 'veres-one-1d-worker';
config.core.worker.restart = false;

// logging
config.loggers.email.silent = true;
config.loggers.email.to = ['cluster@veres.one.localhost'];
config.loggers.email.from = 'cluster@veres.one.localhost';

// server info
config.server.port = 42443;
config.server.httpPort = 42080;
config.server.domain = 'genesis.veres.one.localhost';
// config.server.key = path.join(_cfgdir, 'pki', 'veres.dev.key');
// config.server.cert = path.join(_cfgdir, 'pki', 'veres.dev.crt');

// express info
config.express.session.secret = 'NOTASECRET';
config.express.session.key = 'veres-one.sid';
config.express.session.prefix = 'veres-one.';

// mongodb config
config.mongodb.name = 'veres_one_localhost_genesis';
config.mongodb.host = 'localhost';
config.mongodb.port = 27017;
config.mongodb.local.collection = 'veres_one_localhost_genesis';
config.mongodb.username = 'veres';
config.mongodb.password = 'password';
config.mongodb.adminPrompt = true;

config['https-agent'].rejectUnauthorized = false;

// mail config
config.mail.connection = {
  host: 'localhost',
  ssl: false
};
config.mail.send = false;
config.mail.vars = {
  // FIXME: what is this?
  productionMode: '',
  baseUri: config.server.baseUri,
  subject: {
    prefix: '[DEV VERES ONE] ',
    identityPrefix: '[DEV VERES ONE] '
  },
  service: {
    name: 'Dev Veres One',
    host: config.server.host
  },
  system: {
    name: 'System',
    email: 'support@' + config.server.domain
  },
  support: {
    name: 'Customer Support',
    email: 'support@' + config.server.domain
  },
  registration: {
    email: 'registration@' + config.server.domain
  },
  comments: {
    email: 'support@' + config.server.domain
  },
  offers: {
    email: 'support@' + config.server.domain
  },
  machine: require('os').hostname()
};
// email templates
// TODO: determine if Ledger will do credential notifications at all
/*
const ids = [
  'veres.Credential.created-identity',
  'veres.Credential.created'
];

ids.forEach(function(id) {
  config.mail.templates[id] = {
    filename: path.join(__dirname, '../email-templates', id + '.tpl')
  };
});
*/

const rootPath = path.join(__dirname, '../email-templates');
config.mail.templates.paths.push(rootPath);

/*
// mail events
config.mail.events.push({
  type: 'veres.Credential.created',
  // admin email
  template: 'veres.Credential.created'
});
config.mail.events.push({
  type: 'veres.Credential.created.notification',
  // user email
  template: 'veres.Credential.created-identity'
});
*/
// Veres One development config
config['veres-one'].did = 'did:v1:uuid:00000000-0000-0000-0000-000000000000';

// enable consensus workers
config.ledger.jobs.scheduleConsensusWork.enabled = true;

config.jobs.queueOptions.prefix = 'v1devgenesis';

require('./secrets/dev-genesis-secrets');
