/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const async = require('async');
const {config, util: {clone, delay}} = require('bedrock');
const didVeresOne = require('did-veres-one');
const fs = require('fs');
const httpsAgent = new require('https').Agent({rejectUnauthorized: false});
const jsigs = require('jsonld-signatures');
const mockData = require('./mock.data');
let request = require('request');
request = request.defaults({json: true, strictSSL: false});
const url = require('url');
const vrLedger = require('../../lib/ledger');

const urlObj = {
  protocol: 'https',
  host: config.server.host,
  pathname: '/dids'
};

describe('DID creation', () => {
  it('a DID owner should be able to create its own DID document', async () => {
    const hostname = 'genesis.veres.one.localhost:23443';
    const v1 = didVeresOne.driver({
      hostname,
      httpsAgent,
      mode: 'dev'
    });
    let error;
    let did;
    try {
      // Generate a new DID Document, store the private keys locally
      const newDoc = await v1.generate();
      console.log('Generated:', JSON.stringify(newDoc, null, 2));
      // Now register the newly generated DID Document
      // Use Equihash Proof of Work by default (see below)
      const result = await v1.register({
        didDocument: newDoc.didDocument,
        keyPairs: newDoc.keyPairs
      });
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
        didRecord = await v1.get({did});
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
    should.exist(didRecord, 'Expected didRecord to exist');
    didRecord.id.should.equal(did);
  });

  it.skip('should be allowed by Accelerator', done => {
    const validDidDescription = clone(mockData.didDocuments.alpha);
    const registerEvent = clone(mockData.events.create);
    registerEvent.input = [validDidDescription];

    async.auto({
      getPrivateKey: callback =>
        fs.readFile(config['veres-one'].privateKey, 'utf8', callback),
      sign: ['getPrivateKey', (results, callback) => jsigs.sign(registerEvent, {
        algorithm: 'RsaSignature2018',
        privateKeyPem: results.getPrivateKey,
        creator: config['veres-one'].ddoPublicKey.id
      }, callback)],
      register: ['sign', (results, callback) => {
        const registerUrl = clone(urlObj);
        registerUrl.pathname =
          config['veres-one'].routes.dids + '/' + validDidDescription.id;
        request.post({
          url: url.format(registerUrl),
          body: results.sign
        }, (err, res) => {
          assertNoError(err);
          res.statusCode.should.equal(202);
          callback();
        });
      }],
      getDidDescription: ['register', (results, callback) => {
        vrLedger.agent.node.stateMachine.get(
          validDidDescription.id, (err, result) => {
            should.not.exist(err);
            should.exist(result.object);
            result.object.id.should.equal(validDidDescription.id);
            callback();
          });
      }]
    }, err => done(err));
  });
  it.skip('should be allowed with signature and Proof of Work', done => {
    const validDidDescription = clone(mockData.didDocuments.epsilon);
    const registerEvent = clone(mockData.events.create);
    registerEvent.input = [validDidDescription];

    async.auto({
      sign: callback => jsigs.sign(registerEvent, {
        algorithm: 'RsaSignature2018',
        privateKeyPem: mockData.keys.epsilon.privateKeyPem,
        creator: validDidDescription.authenticationCredential[0].id
      }, callback),
      register: ['sign', (results, callback) => {
        const registerUrl = clone(urlObj);
        registerUrl.pathname =
          config['veres-one'].routes.dids + '/' + validDidDescription.id;
        request.post({
          url: url.format(registerUrl),
          body: results.sign
        }, (err, res) => {
          should.not.exist(err);
          res.statusCode.should.equal(202);
          callback();
        });
      }],
      getDidDescription: ['register', (results, callback) => {
        vrLedger.agent.node.stateMachine.get(
          validDidDescription.id, (err, result) => {
            should.not.exist(err);
            should.exist(result.object);
            result.object.id.should.equal(validDidDescription.id);
            callback();
          });
      }]
    }, err => done(err));
  });
  it.skip('should be prevented for existing DID', done => {
    done();
  });
  it.skip('should be prevented without sig and PoW', done => {
    done();
  });
  it.skip('should be prevented with sig, without PoW', done => {
    done();
  });
  it.skip('should be prevented with sig, invalid PoW', done => {
    done();
  });
  it.skip('should be prevented with sig, insufficient PoW', done => {
    done();
  });
  it.skip('should be prevented with PoW, without sig', done => {
    done();
  });
  it.skip('should be prevented with PoW, invalid sig', done => {
    done();
  });
});
