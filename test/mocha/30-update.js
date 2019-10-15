/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {util: {delay}} = require('bedrock');
const didVeresOne = require('did-veres-one');
const httpsAgent = new require('https').Agent({rejectUnauthorized: false});

describe('DID update', () => {
  it('a DID owner should be able to update its own DID document', async () => {
    const hostname = 'genesis.veres.one.localhost:23443';
    const v1 = didVeresOne.driver({
      hostname,
      httpsAgent,
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
      console.log(e);
      error = e;
    }
    should.not.exist(error);
    let found = false;
    let didRecord;
    while(!found) {
      try {
        // the client.get API is used to get meta data
        didRecord = await v1.client.get({did});
        found = true;
      } catch(e) {
        if(e.name !== 'NotFoundError') {
          throw e;
        }
        console.log('Waiting for consensus...');
        await delay(500);
        continue;
      }
    }
    didRecord.record.id.should.equal(did);
    didRecord.meta.sequence.should.equal(0);
    // create a patch
    didDocument.observe();
    const mockService = {
      id: 'urn:foo',
      type: 'urn:AgentService',
      endpoint: 'https://agent.example.com/'
    };
    didDocument.addService(mockService);
    let updateResult;
    try {
      updateResult = await v1.update({didDocument});
    } catch(e) {
      console.log(e);
      error = e;
    }
    should.not.exist(error);
    updateResult.meta.sequence.should.equal(1);
    const updatedDid = await waitForUpdate({did, sequence: 1, v1});
    const {meta: {sequence}, record} = updatedDid;
    sequence.should.equal(1);
    should.exist(record.service);
    record.service.should.be.an('array');
    record.service.should.have.length(1);
    record.service[0].should.eql({
      id: mockService.id,
      serviceEndpoint: mockService.endpoint,
      type: mockService.type,
    });
  });
});

async function waitForUpdate({did, sequence, v1}) {
  let found = false;
  let didRecord;
  while(!found) {
    // the client.get API is used to get meta data
    didRecord = await v1.client.get({did});
    const {meta: {sequence: s}} = didRecord;
    if(s === sequence) {
      found = true;
      continue;
    }
    await delay(500);
  }
  return didRecord;
}
