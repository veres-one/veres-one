/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const didVeresOne = require('did-veres-one');
const helpers = require('./helpers');

describe('DID update', () => {
  it('a DID owner should be able to update its own DID document', async () => {
    const hostname = 'genesis.veres.one.localhost:23443';
    const v1 = didVeresOne.veres({
      hostname,
      mode: 'dev'
    });
    let error;
    let did;
    try {
      // Generate a new DID Document, store the private keys locally
      const didDocument = await v1.generate({});
      console.log('Generated:', JSON.stringify(didDocument, null, 2));
      // Now register the newly generated DID Document
      // Use Equihash Proof of Work by default (see below)
      const result = await v1.register({didDocument});
      ({id: did} = result);
      // Log the results
      // Log the result of registering the didDoc to the VeresOne Test ledger
      console.log('Registered!', JSON.stringify(result, null, 2));
    } catch(e) {
      error = e;
    }
    should.not.exist(error);
    let found = false;
    let didRecord;
    while(!found) {
      try {
        didRecord = await helpers.getDid({did, hostname});
        found = true;
      } catch(e) {
        if(e.response.status !== 404) {
          throw e;
        }
        console.log('Waiting for consensus...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
    }
    didRecord.record.id.should.equal(did);
    didRecord.meta.sequence.should.equal(0);
  });
});
