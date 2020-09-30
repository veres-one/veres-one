/*
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const brIdentity = require('bedrock-identity');
const database = require('bedrock-mongodb');
const validate = require('bedrock-validation').validate;
const BedrockError = bedrock.util.BedrockError;

// module API
const api = {};
module.exports = api;

// add routes
bedrock.events.on('bedrock-express.configure.routes', addRoutes);

function addRoutes(app) {
  app.post('/identifier/email',
    validate('services.identifier.postEmailIdentifier'),
    function(req, res, next) {
      _check({
        lookup: brIdentity.getAll,
        query: {'identity.email': req.body.email}
      }, function(err) {
        if(err) {
          return next(err);
        }
        res.status(204).end();
      });
    });

  app.post('/identifier/identity',
    validate('services.identifier.postIdentityIdentifier'),
    function(req, res, next) {
      _check({
        lookup: brIdentity.getAll,
        query: {'identity.sysSlug': req.body.sysSlug}
      }, function(err) {
        if(err) {
          return next(err);
        }
        res.status(204).end();
      });
    });
}

/**
 * Common identifier lookup code.
 *
 * @param options object with checking options:
 *          lookup: function to use to lookup identifier
 *          id: id to check (optional)
 *          query: query options (optional, default: {id: hash(id)})
 * @param callback callback(err) called when done with possible error.
 */
function _check(options, callback) {
  // check for ID existence
  const query = options.query || {id: database.hash(options.id)};
  options.lookup(null, query, {_id: true}, {limit: 1}, function(err, exists) {
    if(err) {
      return callback(err);
    }
    if(exists.length !== 0) {
      // ID is not available
      return callback(new BedrockError(
        'The chosen identifier is already in use.',
        'DuplicateId', {
          httpStatusCode: 409,
          public: true
        }));
    }
    callback();
  });
}
