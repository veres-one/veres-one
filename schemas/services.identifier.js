/*
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const schemas = require('bedrock-validation').schemas;

const postEmailIdentifier = {
  type: 'object',
  properties: {
    email: schemas.email({}, {lowerCaseOnly: true})
  },
  additionalProperties: false
};

const postIdentityIdentifier = {
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
