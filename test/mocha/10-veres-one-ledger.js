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

const vrOneLedgerReady = new Promise(resolve => {
  bedrock.events.on('veres-one.ready', resolve);
});

describe('Veres One Ledger', () => {
  // wait for the ledger to initialize
  before(() => vrOneLedgerReady);

  it('ledger agent should exist', done => {
    should.exist(vrOneLedger.agent);
    should.exist(vrOneLedger.agent.node);
    done();
  });

  it('ledger agent should be for did:v1:ledger', done => {
    const options = {};
    vrOneLedger.agent.node.blocks.getGenesis(options, (err, result) => {
      should.exist(result.genesisBlock);
      should.exist(result.genesisBlock.block);
      should.exist(result.genesisBlock.block.event);
      should.exist(result.genesisBlock.block.event[0]);
      should.exist(result.genesisBlock.block.event[0].ledgerConfiguration);
      should.exist(
        result.genesisBlock.block.event[0].ledgerConfiguration.ledger);

      const ledgerId =
        result.genesisBlock.block.event[0].ledgerConfiguration.ledger;
      ledgerId.should.equal(config['veres-one'].did);

      done(err);
    });
  });

});
