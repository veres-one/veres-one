/*!
 * Veres One HTTP API.
 *
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
const accelerator = require('./accelerator');
const async = require('async');
const bedrock = require('bedrock');
const brPassport = require('bedrock-passport');
const brRest = require('bedrock-rest');
const config = require('bedrock').config;
const constants = config.constants;
const cors = require('cors');
const docs = require('bedrock-docs');
const logger = require('./logger');
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

bedrock.events.on('bedrock-express.configure.routes', app => {
  const routes = config['veres-one'].routes;

  app.options(routes.dids, cors());

  // POST /dids/{DID}
  // Register or updates an existing DID
  app.post(routes.dids + '/:did', brRest.when.prefers.ld, (req, res, next) => {
    vrLedger.agent.node.operations.add(req.body, (err, event) => {
      if(err) {
        return next(err);
      }
      res.status(204).end();
    });
  });
  docs.annotate.post(routes.dids + '/:did', {
    description: 'Register a new DID',
    schema: 'services.veresOne.registerDid',
    responses: {
      204: 'DID update is pending.',
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

  // POST /accelerator/proofs
  // Accelerates DID creation
  app.post(routes.accelerator + '/proofs',
    // FIXME: enable auth
    /*ensureAuthenticated,*/ brRest.when.prefers.ld, (req, res, next) => {
    // check if enabled
    if(!accelerator.enabled()) {
      res.status(404).end();
      return;
    }

    accelerator.proofs(req.body, (err, op) => {
      if(err) {
        return next(err);
      }
      res.status(200).json(op);
    });
  });
  docs.annotate.post(routes.accelerator + '/proofs', {
    description: 'Validate a DID',
    //schema: 'services.veresOne.accelerator.validateDid',
    responses: {
      // FIXME
    }
  });
});
