/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const helpers = require('./helpers');
const vrOneLedger = require('../../lib/ledger');

describe('Veres One Ledger', () => {
  // wait for the ledger to initialize
  before(() => helpers.vrOneLedgerReady);

  it('ledger agent should exist', done => {
    should.exist(vrOneLedger.agent);
    should.exist(vrOneLedger.agent.ledgerNode);
    done();
  });

  it('ledger agent should be for did:v1:ledger', async () => {
    let result;
    let error;
    try {
      result = await vrOneLedger.agent.ledgerNode.blocks.getGenesis();
    } catch(e) {
      error = e;
    }
    should.not.exist(error);
    should.exist(result);
    result.should.be.an('object');
    should.exist(result.genesisBlock);
    should.exist(result.genesisBlock.block);
    should.exist(result.genesisBlock.block.event);
    should.exist(result.genesisBlock.block.event[0]);
    should.exist(result.genesisBlock.block.event[0].ledgerConfiguration);
    should.exist(
      result.genesisBlock.block.event[0].ledgerConfiguration.ledger);
    const ledgerId =
      result.genesisBlock.block.event[0].ledgerConfiguration.ledger;
    ledgerId.startsWith('did:v1:').should.be.true;
  });

});
