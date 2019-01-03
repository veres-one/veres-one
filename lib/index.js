/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const _ = require('lodash');
const bedrock = require('bedrock');

// required bedrock modules
require('bedrock-did-client');
require('bedrock-docs');
require('bedrock-express');
require('bedrock-i18n');
require('bedrock-identity');
require('bedrock-identity-http');
require('bedrock-key');
require('bedrock-jobs');
require('bedrock-ledger-agent');
require('bedrock-ledger-context');
require('bedrock-ledger-consensus-continuity');
require('veres-one-context');
require('bedrock-veres-one-context');
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
require('bedrock-validation');
require('bedrock-views');
// require('veres-one-consensus-continuity-elector-selection');
require('bedrock-ledger-consensus-continuity-es-most-recent-participants');

// require default config
require('./config');

// require Veres One subsystems
require('./services.identifier');
require('./ledger');
require('./accelerator');
require('./http');

bedrock.events.on('bedrock-session-http.session.get', function(req, session) {
  if(req.isAuthenticated()) {
    // FIXME: temporary overwrite that exposes all server-side identity
    // information; restrict what is exposed
    session.identity = _.assign(session.identity, req.user.identity);
  }
});

const api = {};
module.exports = api;
