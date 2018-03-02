/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
const cc = bedrock.util.config.main.computer();
const config = bedrock.config;
const path = require('path');

// core
// 0 means use # of cpus
config.core.workers = 1;
config.core.master.title = 'veres-one-1d';
config.core.worker.title = 'veres-one-1d-worker';
config.core.worker.restart = false;

// job scheduler
config.scheduler.idleTime = 1000;

// logging
config.loggers.email.silent = true;
config.loggers.email.to = ['cluster@veres.io'];
config.loggers.email.from = 'cluster@veres.io';

// express info
// this value is reset in the secrets config
config.express.session.secret = 'NOTASECRET';
config.express.session.key = 'veres-one.sid';
config.express.session.prefix = 'veres-one.';
// use CORS for static contexts

// FIXME: is this needed?
// config.express.static.push({
//   route: '/contexts',
//   path: path.join(__dirname, '..', 'contexts'),
//   cors: true
// });
config.express.static.push({
  route: '/images',
  path: path.join(__dirname, '..', 'components', 'images'),
  cors: true
});
config.express.static.push({
  route: '/favicon.ico',
  path: path.join(__dirname, '..', 'components', 'images', 'favicon.ico'),
  cors: true
});

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
    prefix: '[WHITE LABEL LEDGER DEV] ',
    identityPrefix: '[WHITE LABEL LEDGER DEV] '
  },
  service: {
    name: 'White Label Ledger Development',
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

// mongo
config.mongodb.requirements.serverVersion = '>=3.6';

// veres-one pseudo package
config.views.system.packages.push({
  path: path.join(__dirname, '..', 'components'),
  manifest: path.join(__dirname, '..', 'package.json')
});

// common validation schemas
config.validation.schema.paths.push(
  path.join(__dirname, '..', 'schemas')
);

// views
// branding
config.views.brand.name = 'Veres One Development';
config.views.vars.debug = false;
config.views.vars.demoWarningUrl = null;
// FIXME: add logo img
config.views.vars.style.brand.alt = config.views.brand.name;
config.views.vars.style.brand.src = '/images/veres-logo-white';
config.views.vars.style.brand.height = '35';
config.views.vars.style.brand.width = '39';
// br-form vocabularies
config.views.vars.forms = {vocabs: []};
// explicit options object for PropertyGroup ids
// fields:
//   enabled: boolean
config.views.vars['veres-one'] = {};
config.views.vars['veres-one'].portal = {
  url: 'https://veresio.atlassian.net/servicedesk/customer/portal/1'
};
config.views.vars['veres-one'].propertyGroups = {};
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
//  label: 'Veres Blog',
//  url: 'http://blog.' + config.server.domain + '/'
// };
config.views.vars.contact.email = {
  label: 'Customer Support',
  url: 'mailto:support@' + config.server.domain,
  email: 'support@' + config.server.domain
};
// config.views.vars.contact.facebook = {
//  label: 'XXX',
//  url: 'https://www.facebook.com/pages/XXX/1234'
// };
// config.views.vars.contact.github = {label: '...', url: ''};
// config.views.vars.contact.googlePlus = {
//  label: '+Veres',
//  url: 'https://plus.google.com/1234'
// };
// config.views.vars.contact.irc = {
//  label: '#XXX',
//  url: 'irc://irc.freenode.net/XXX'
// };
// config.views.vars.contact.twitter = {
//   label: '@Veres',
//   url: 'https://twitter.com/veres'
// };
// config.views.vars.contact.youtube = {label: '...', url: ''};

// context URLs exposed to client
// config.views.vars.contextUrls.xxx =
//  config.constants.XXX_CONTEXT_V1_URL;

// cc(['views', 'vars', 'contextMap', config.constants.XXX_CONTEXT_V1_URL],
//  () => config.server.baseUri + '/contexts/xxx-v1.jsonld');

// URLs for Authorization.io
cc('views.vars.authorization-io.baseUri', () =>
  config['did-client']['authorization-io'].baseUrl);
cc('views.vars.authorization-io.agentUrl', () =>
  config['did-client']['authorization-io'].agentUrl);
cc('views.vars.authorization-io.didUrl', () =>
  config['did-client']['authorization-io'].didBaseUrl);
cc('views.vars.authorization-io.registerUrl', () =>
  config['did-client']['authorization-io'].registerUrl);

// enable user joining
config['website-user-http'].features.join = true;

// REST API documentation
config.docs.vars.brand = config.brand.name;
config.docs.vars.baseUri = config.server.baseUri;

// Footer configuration
config.views.vars.footer.show = true;
config.views.vars['bedrock-angular-footer'] = {};
config.views.vars['bedrock-angular-footer'].copyright =
  'Copyright © 2018 Digital Bazaar, Inc. All rights reserved.';

config['veres-one'] = {};
config['veres-one'].did =
  'did:v1:test:uuid:11111111-2222-3333-4444-555555555555';
config['veres-one'].routes = {};
config['veres-one'].routes.accelerator = '/accelerator';
config['veres-one'].routes.dids = '/dids';
config['veres-one'].peers = [];

// accelerator
config['veres-one'].acceleratorEnabled = false;

// enable consensus workers
config.ledger.jobs.scheduleConsensusWork.enabled = true;

cc('veres-one.config', () => ({
  '@context': 'https://w3id.org/veres-one/v1',
  type: 'WebLedgerConfiguration',
  ledger: config['veres-one'].did,
  consensusMethod: 'Continuity2017',
  // FIXME: add config validator
  ledgerConfigurationValidator: [],
  // FIXME: Enable validation
  operationValidator: [/*{
    type: 'VeresOneValidator2017',
    validatorFilter: [{
      type: 'ValidatorFilterByType',
      validatorFilterByType: ['CreateWebLedgerRecord']
    }]
  }*/]
}));

// roles
require('../configs/roles');
