/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
var config = require('bedrock').config;
var os = require('os');
var path = require('path');

// common paths
config.paths.cache = path.join(__dirname, '..', '.cache');
config.paths.log = path.join(os.tmpdir(), 'one.veres.dev');

// core
// 0 means use # of cpus
config.core.workers = 1;
config.core.master.title = 'veres-one-1d';
config.core.worker.title = 'veres-one-1d-worker';
config.core.worker.restart = false;

// logging
config.loggers.email.silent = true;
config.loggers.email.to = ['cluster@one.veres.dev'];
config.loggers.email.from = 'cluster@one.veres.dev';

// server info
config.server.port = 42443;
config.server.httpPort = 42080;
config.server.domain = 'one.veres.dev';
// config.server.key = path.join(_cfgdir, 'pki', 'veres.dev.key');
// config.server.cert = path.join(_cfgdir, 'pki', 'veres.dev.crt');

// express info
config.express.session.secret = 'NOTASECRET';
config.express.session.key = 'veres-one.sid';
config.express.session.prefix = 'veres-one.';

// mongodb config
config.mongodb.name = 'one_veres_dev';
config.mongodb.host = 'localhost';
config.mongodb.port = 27017;
config.mongodb.local.collection = 'one_veres_dev';
config.mongodb.username = 'veres';
config.mongodb.password = 'password';
config.mongodb.adminPrompt = true;

// this impacts did-io's acquisition of documements from authio
config.jsonld.strictSSL = false;
config['authn-did-jwt'].crossDomainAuthn.trustedRepositories.push(
  'did:e618740c-38f4-42ba-82fc-c90a51faba95');

// mail config
config.mail.connection = {
  host: 'localhost',
  ssl: false
};
config.mail.send = false;
config.mail.vars = {
  productionMode: config.views.vars.productionMode,
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
var ids = [
  'veres.Credential.created-identity',
  'veres.Credential.created'
];
ids.forEach(function(id) {
  config.mail.templates.config[id] = {
    filename: path.join(__dirname, '../email-templates', id + '.tpl')
  };
});
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

// views
// branding
config.views.brand.name = 'Development Veres One';
// update view vars
config.views.vars.baseUri = config.server.baseUri;
config.views.vars.title = config.views.brand.name;
config.views.vars.siteTitle = config.views.brand.name;
config.views.vars.supportDomain = config.server.domain;
config.views.vars.debug = false;
config.views.vars.minify = false;

config.views.vars.demoWarningUrl = null;
// br-form vocabularies
config.views.vars.forms = {vocabs: []};
// contact info
config.views.vars.contact.address = {
  label: 'Veres One',
  address:
    '123 FIXME\n' +
    'FIXME, XX 12345\n' +
    'United States of America',
  htmlAddress:
    '123 FIXME<br/>' +
    'FIXME, XX 12345<br/>' +
    'United States of America'
};
// config.views.vars.contact.blog = {
//   label: 'Veres Blog',
//   url: 'http://blog.' + config.server.domain + '/'
// };
config.views.vars.contact.email = {
  label: 'Customer Support',
  url: 'mailto:support@' + config.server.domain,
  email: 'support@' + config.server.domain
};
// config.views.vars.contact.facebook = {
//   label: 'XXX',
//   url: 'https://www.facebook.com/pages/XXX/1234'
// };
// config.views.vars.contact.github = {label: '...', url: ''};
// config.views.vars.contact.googlePlus = {
//   label: '+Veres',
//   url: 'https://plus.google.com/1234'
// };
// config.views.vars.contact.irc = {
//   label: '#XXX',
//   url: 'irc://irc.freenode.net/XXX'
// };
// config.views.vars.contact.twitter = {
//   label: '@veres',
//   url: 'https://twitter.com/veres'
// };
// config.views.vars.contact.youtube = {label: '...', url: ''};
// context URLs exposed to client

// REST API documentation
config.docs.vars.brand = config.brand.name;
config.docs.vars.baseUri = config.server.baseUri;
