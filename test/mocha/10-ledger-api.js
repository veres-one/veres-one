/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global should */
'use strict';

const async = require('async');
const bedrock = require('bedrock');
const brIdentity = require('bedrock-identity');
const database = require('bedrock-mongodb');
const expect = global.chai.expect;
const helpers = require('./helpers');
const mockData = require('./mock.data');
const vrLedger = require('../../lib');
const uuid = require('uuid/v4');

describe('ledger API', () => {
  it('does something', done => {
    const x = 4;
    x.should.equal(4);
    done();
  });
// TODO:

});
