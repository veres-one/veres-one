/*!
 * Veres One HTTP API.
 *
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
const accelerator = require('./accelerator');
const async = require('async');
const {asyncHandler} = require('bedrock-express');
const bedrock = require('bedrock');
const brRest = require('bedrock-rest');
const config = require('bedrock').config;
const cors = require('cors');
const vrLedger = require('./ledger');
const BedrockError = bedrock.util.BedrockError;

require('bedrock-express');
require('bedrock-permission');

require('./config');

// module API
const api = {};
module.exports = api;

bedrock.events.on('bedrock-express.configure.routes', app => {
  const routes = config['veres-one'].routes;

  // NOTE: health-check / readiness endpoint
  app.get('/', (req, res) => {
    res.send('VERES-ONE OK.');
  });

  app.get('/keep-alive', asyncHandler(async (req, res) => {
    try {
      let {timeout} = req.query;
      const defaultTimeout = bedrock.config['veres-one'].keepAlive.timeout;
      timeout = timeout ? timeout * 1000 : defaultTimeout;
      await bedrock.util.delay(timeout);
      res.status(200).end();
    } catch(e) {
      res.status(400).json({error: e});
    }
  }));

  app.options(routes.dids, cors());

  // POST /dids/{DID}
  // Register or updates an existing DID
  app.post(routes.dids + '/:did', brRest.when.prefers.ld, (req, res, next) => {
    vrLedger.agent.ledgerNode.operations.add(req.body, err => {
      if(err) {
        return next(err);
      }
      res.status(204).end();
    });
  });

  // GET /dids/{DID}
  // Get the latest DID information from the ledger
  app.get(routes.dids + '/:did', brRest.when.prefers.ld,
    brRest.linkedDataHandler({
      get: (req, res, callback) => {
        const did = decodeURIComponent(req.params.did) || null;
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
            vrLedger.agent.ledgerNode.records.get({recordId: did}, callback);
          }
        }, (err, results) => {
          if(err) {
            return callback(err);
          }

          callback(null, results.get.record);
        });
      }}));

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
});
