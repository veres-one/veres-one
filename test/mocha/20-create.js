/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* globals should */
'use strict';

const async = require('async');
const bedrock = require('bedrock');
const config = bedrock.config;
const equihashSigs = require('equihash-signature');
const helpers = require('./helpers');
const jsigs = require('jsonld-signatures');
const mockData = require('./mock.data');
let request = require('request');
request = request.defaults({json: true, strictSSL: false});
const url = require('url');
const uuid = require('uuid/v4');
const querystring = require('querystring');

const urlObj = {
  protocol: 'https',
  host: config.server.host,
  pathname: config['ledger-agent'].routes.agents
};

// use local JSON-LD processor for signatures
jsigs.use('jsonld', bedrock.jsonld);

describe.skip('Create DID', () => {
  const regularActor = mockData.identities.regularUser;
  let ledgerAgent;

  it('should allow valid DID to be created', done => {
    done();
  });
  it('should prevent DID creation without proof', done => {
    done();
  });
  it('should prevent DID creation with insufficient work proof', done => {
    done();
  });
  it('should prevent DID creation with invalid proof', done => {
    done();
  });
});
