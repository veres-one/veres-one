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
    let didDocument;
    try {
      // Generate a new DID Document, store the private keys locally
      didDocument = await v1.generate({});
      console.log('Generated:', JSON.stringify(didDocument, null, 2));
      // Now register the newly generated DID Document
      // Use Equihash Proof of Work by default (see below)
      const result = await v1.register({didDocument});
      ({id: did} = result);
      // Log the results
      // Log the result of registering the didDoc to the VeresOne Test ledger
      console.log('Registered!', JSON.stringify(result, null, 2));
    } catch(e) {
      _logError(e);
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
    // create a patch
    didDocument.observe();
    const mockService = {
      id: 'urn:foo',
      type: 'AgentService',
      serviceEndpoint: 'https://agent.example.com/'
    };
    didDocument.addService(mockService);
    let updateResult;
    try {
      updateResult = await v1.update({didDocument});
    } catch(e) {
      _logError(e);
      error = e;
    }
    // FIXME v1.update should not be surfacing axios response
    updateResult.status.should.equal(204);
    should.not.exist(error);
    const updatedDid = await waitForUpdate({did, hostname, sequence: 1});
    const {meta: {sequence}, record} = updatedDid;
    sequence.should.equal(1);
    should.exist(record.service);
    record.service.should.be.an('array');
    record.service.should.have.length(1);
    record.service[0].should.eql(mockService);
  });
});

async function waitForUpdate({did, hostname, sequence}) {
  let found = false;
  let didRecord;
  while(!found) {
    try {
      didRecord = await helpers.getDid({did, hostname});
      const {meta: {sequence: s}} = didRecord;
      if(s === sequence) {
        found = true;
      }
    } catch(e) {
      if(e.response.status !== 404) {
        throw e;
      }
      console.log('Waiting for consensus...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      continue;
    }
  }
  return didRecord;
}

function _logError(e) {
  // it's an axios error with a response
  if(e.response && e.response.data) {
    console.log('HTTP ERROR', JSON.stringify(e.response.data, null, 2));
  } else {
    console.log('ERROR', e);
  }
}
