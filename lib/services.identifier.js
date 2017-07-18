/*
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');
var brIdentity = require('bedrock-identity');
var database = require('bedrock-mongodb');
var docs = require('bedrock-docs');
var validate = require('bedrock-validation').validate;
var BedrockError = bedrock.util.BedrockError;

// module API
var api = {};
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
  docs.annotate.post('/identifier/email', {
    description: 'Check to see if the given email address has already ' +
      'been registered.',
    securedBy: ['cookie', 'hs1'],
    schema: 'services.identifier.postEmailIdentifier',
    responses: {
      204: 'The email address is not in use.',
      409: 'The email address is in use.'
    }
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
  docs.annotate.post('/identifier/identity', {
    description: 'Check to see if the given identity nickname is in use.',
    securedBy: ['cookie', 'hs1'],
    schema: 'services.identifier.postIdentityIdentifier',
    responses: {
      204: 'The nickname is not in use.',
      409: 'The nickname address is in use.'
    }
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
  var query = options.query || {id: database.hash(options.id)};
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
          'public': true
        }));
    }
    callback();
  });
}
