/*!
 * Veres One HTTP API.
 *
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
const accelerator = require('./accelerator');
const async = require('async');
const bedrock = require('bedrock');
const brRest = require('bedrock-rest');
const config = require('bedrock').config;
const cors = require('cors');
const LRU = require('lru-cache');
const responseTime = require('response-time');
const vrLedger = require('./ledger');
const BedrockError = bedrock.util.BedrockError;

require('bedrock-express');
require('bedrock-permission');

require('./config');

const REQUEST_CACHE = new LRU({maxAge: 10 * 1000});
const MAX_RESPONSE_TIME_MS = 600;
const MAX_SLOW_REQUESTS = 2;

const responseTimer = responseTime((req, res, time) => {
  if(time > MAX_RESPONSE_TIME_MS) {
    REQUEST_CACHE.set(bedrock.util.uuid(), time);
  }
});

// module API
const api = {};
module.exports = api;

bedrock.events.on('bedrock-cooldown.report', ({addAlert}) => {
  REQUEST_CACHE.prune();
  console.log('reporting', REQUEST_CACHE.length >= MAX_SLOW_REQUESTS);
  if(REQUEST_CACHE.length >= MAX_SLOW_REQUESTS) {
    addAlert('veres-one:health-check-duration', {
      module: 'veres-one',
      message: `Health Check exceeded the maximum of ${MAX_SLOW_REQUESTS} ` +
        `slow requests.`
    });
  }
});

bedrock.events.on('bedrock-express.configure.routes', app => {
  const routes = config['veres-one'].routes;

  // NOTE: health-check / readiness endpoint
  app.get('/', responseTimer, (req, res) => {
    res.send('VERES-ONE OK.');
  });

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
