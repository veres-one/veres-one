/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global should */
'use strict';

const async = require('async');
const bedrock = require('bedrock');
const config = bedrock.config;
const brIdentity = require('bedrock-identity');
const database = require('bedrock-mongodb');
const expect = global.chai.expect;
const helpers = require('./helpers');
const mockData = require('./mock.data');
const vrOneLedger = require('../../lib/ledger');
const uuid = require('uuid/v4');

describe('Veres One Ledger', () => {
  before(done => {
    // wait for the ledger to initialize
    setTimeout(done, 1000);
  });

  it('ledger agent should exist', done => {
    should.exist(vrOneLedger.agent);
    should.exist(vrOneLedger.agent.node);
    done();
  });

});
