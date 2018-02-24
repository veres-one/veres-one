/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const _ = require('lodash');
const async = require('async');
const bedrock = require('bedrock');
//const didio = require('did-io');
const didv1 = require('did-veres-one');
const jsigs = require('jsonld-signatures');
const request = require('request');

// required bedrock modules
require('bedrock-authn-did');
require('bedrock-authn-did-jwt');
require('bedrock-credentials-mongodb');
require('bedrock-did-client');
require('bedrock-docs');
require('bedrock-express');
require('bedrock-i18n');
require('bedrock-identity');
require('bedrock-issuer');
require('bedrock-key');
require('bedrock-key-http');
require('bedrock-identity-http');
// FIXME: bedrock-authn-password is being loaded after bedrock-identity-http
// to ensure that the `password` validation schema in bedrock-authn-password
// is utilized.
// see: https://github.com/digitalbazaar/bedrock-website-user-http/issues/4
require('bedrock-authn-password');
require('bedrock-jobs');
require('bedrock-ledger-agent');
require('bedrock-ledger-consensus-continuity');
require('veres-one-context');
require('bedrock-ledger-node');
require('bedrock-ledger-validator-signature');
require('veres-one-validator');
require('bedrock-ledger-storage-mongodb');
require('bedrock-mail');
require('bedrock-mongodb');
require('bedrock-passport');
require('bedrock-permission');
require('bedrock-request-limiter');
require('bedrock-rest');
require('bedrock-server');
require('bedrock-session-mongodb');
require('bedrock-website-user-http');
require('bedrock-validation');
require('bedrock-views');
require('bedrock-webpack');

// require default config
require('./config');

// require Veres One subsystems
require('./services.identifier');
require('./ledger');
require('./accelerator');
require('./http');

bedrock.events.on('bedrock.init', function() {
  // configure modules
  //didio.use('async', async);
  //didio.use('jsigs', jsigs);
  //didio.use('request', request);
  //didio.use('_', _);
  jsigs.use('jsonld', bedrock.jsonld);
  didv1.use('jsonld', bedrock.jsonld);
  didv1.use('jsonld-signature', jsigs);
});

bedrock.events.on('bedrock-session-http.session.get', function(req, session) {
  if(req.isAuthenticated()) {
    // FIXME: temporary overwrite that exposes all server-side identity
    // information; restrict what is exposed
    session.identity = _.assign(session.identity, req.user.identity);
  }
});

const api = {};
module.exports = api;
