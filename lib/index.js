/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const _ = require('lodash');
const bedrock = require('bedrock');

// required bedrock modules
require('bedrock-account');
require('bedrock-cooldown');
require('bedrock-express');
require('bedrock-i18n');
require('bedrock-identity');
require('bedrock-https-agent');
require('bedrock-jobs');
require('bedrock-ledger-agent');
require('bedrock-ledger-context');
require('bedrock-ledger-consensus-continuity');
require('bedrock-ledger-consensus-continuity-stats-monitor');
require('veres-one-context');
require('bedrock-veres-one-context');
const brLedgerNode = require('bedrock-ledger-node');
require('veres-one-validator');
require('bedrock-ledger-storage-mongodb');
require('bedrock-mail');
require('bedrock-mongodb');
require('bedrock-passport');
require('bedrock-permission');
require('bedrock-redis');
require('bedrock-request-limiter');
require('bedrock-rest');
require('bedrock-server');
require('bedrock-validation');
// require('bedrock-views');
// require('bedrock-webpack');
// require('veres-one-consensus-continuity-elector-selection');
// FIXME: use veres-one-consensus-continuity-elector-selection
require('bedrock-ledger-consensus-continuity-es-elector-pool');

// ledger telemetry
require('./stats');

// require default config
require('./config');

// NOTE: plugins must be registered before `./ledger` is required below
brLedgerNode.use(
  'veres-one-ticket-service-agent', require('./plugins/ticketService'));

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
