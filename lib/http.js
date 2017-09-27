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
    vrLedger.agent.node.events.add(req.body, (err, event) => {
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
        res.status(500).end();
      }
  }));
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
