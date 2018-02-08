/*!
 * Veres One HTTP API.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const async = require('async');
const bedrock = require('bedrock');
const brPassport = require('bedrock-passport');
const brRest = require('bedrock-rest');
const config = require('bedrock').config;
const constants = config.constants;
const cors = require('cors');
const docs = require('bedrock-docs');
const url = require('url');
const vrLedger = require('./ledger');
const BedrockError = bedrock.util.BedrockError;

const ensureAuthenticated = brPassport.ensureAuthenticated;

require('bedrock-express');
require('bedrock-permission');

require('./config');

// module API
const api = {};
module.exports = api;

// const logger = bedrock.loggers.get('app');

bedrock.events.on('bedrock-express.configure.routes', app => {
  const routes = config['veres-one'].routes;

  app.options(routes.dids, cors());

  // POST /dids/{DID}
  // Register or updates an existing DID
  app.post(routes.dids + '/:did', brRest.when.prefers.ld, (req, res, next) => {
    const wlEvent = {
      '@context': constants.WEB_LEDGER_CONTEXT_V1_URL,
      type: 'WebLedgerEvent',
      operation: [req.body]
    };

    vrLedger.agent.node.events.add(wlEvent, (err, event) => {
      if(err) {
        return next(err);
      }
      // FIXME: set location to something else, or nothing at all?
      res.location(event.meta.eventHash);
      res.status(202).end();
    });
  });
  docs.annotate.post(routes.dids + '/:did', {
    description: 'Register a new DID',
    schema: 'services.veresOne.registerDid',
    responses: {
      202: 'DID update is pending.',
      400: 'DID update failed due to malformed request.',
      403: 'DID update failed due to invalid proof.'
    }
  });

  // GET /dids/{DID}
  // Get the latest DID information from the ledger
  app.get(routes.dids + '/:did', brRest.when.prefers.ld,
    brRest.linkedDataHandler({
      get: (req, res, callback) => {
        const did = decodeURIComponent(req.params.did) || null;
        const options = {};

        async.auto({
          get: callback => {
            if(!did) {
              return new BedrockError(
              'A Decentralized Identifier (DID) must be provided.',
              'BadRequest', {
                httpStatusCode: 400,
                public: true
              });
            }
            vrLedger.agent.node.stateMachine.get(did, options, callback);
          }
      }, (err, results) => {
        if(err) {
          return callback(err);
        }

        callback(null, results.get.object);
      });
  }}));
  docs.annotate.get(routes.dids + '/:did', {
    description:
      'Get a DID.',
    responses: {
      200: {
        'application/ld+json': {
          example: 'examples/get.did.jsonld'
        }
      }
    }
  });
});
