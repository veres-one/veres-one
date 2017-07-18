/*
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 */
var schemas = require('bedrock-validation').schemas;

var postEmailIdentifier = {
  type: 'object',
  properties: {
    email: schemas.email({}, {lowerCaseOnly: true})
  },
  additionalProperties: false
};

var postIdentityIdentifier = {
  type: 'object',
  properties: {
    sysSlug: schemas.slug()
  },
  additionalProperties: false
};

module.exports.postEmailIdentifier = function() {
  return postEmailIdentifier;
};
module.exports.postIdentityIdentifier = function() {
  return postIdentityIdentifier;
};
