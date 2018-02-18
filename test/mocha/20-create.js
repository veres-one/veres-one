/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const _ = require('lodash');
const async = require('async');
const bedrock = require('bedrock');
const config = bedrock.config;
const equihashSigs = require('equihash-signature');
const fs = require('fs');
const helpers = require('./helpers');
const jsigs = require('jsonld-signatures');
const mockData = require('./mock.data');
let request = require('request');
request = request.defaults({json: true, strictSSL: false});
const url = require('url');
const uuid = require('uuid/v4');
const vrLedger = require('../../lib/ledger');

const urlObj = {
  protocol: 'https',
  host: config.server.host,
  pathname: '/dids'
};

// use local JSON-LD processor for signatures
jsigs.use('jsonld', bedrock.jsonld);
equihashSigs.install(jsigs);

describe('DID creation', () => {
  it('a DID owner should be able to create its own DID document', done => {
    // create all supporting DIDs
    const didDocument = mockData.didDocuments.alpha.publicDidDocument;
    const unsignedOp = mockData.operations.create;
    unsignedOp.record = didDocument;

    async.auto({
      sign: callback => jsigs.sign(unsignedOp, {
        algorithm: 'RsaSignature2018',
        privateKeyPem: mockData.didDocuments.alpha.privateDidDocument
          .invokeCapability[0].publicKey.privateKeyPem,
        creator: didDocument.invokeCapability[0].publicKey.id,
        proof: {
          '@context': config.constants.WEB_LEDGER_CONTEXT_V1_URL,
          // FIXME: ensure `invokeCapability` is in web ledger context
          //   or switch to veres-one context here
          proofPurpose: 'invokeCapability'
        }
      }, callback),
      proof: ['sign', (results, callback) => jsigs.sign(
        results.sign, {
          algorithm: 'EquihashProof2018',
          parameters: {
            n: config['veres-one-validator'].equihash.equihashParameterN,
            k: config['veres-one-validator'].equihash.equihashParameterK
          }
        }, callback)],
      register: ['proof', (results, callback) => {
        const registerUrl = bedrock.util.clone(urlObj);
        registerUrl.pathname =
          config['veres-one'].routes.dids + '/' + didDocument.id;
        request.post({
          url: url.format(registerUrl),
          body: results.proof
        }, (err, res) => {
          assertNoError(err);
          res.statusCode.should.equal(204);
          callback();
        });
      }]
    }, err => {
      assertNoError(err);
      done(err);
    });
  });

  it.skip('a DID owner should be able to update its own DID document', done => {
    // create all supporting DIDs
    const didDocument = mockData.didDocuments.alpha.publicDidDocument;
    const unsignedOp = mockData.operations.update;
    // FIXME: use patch not DidDocument
    unsignedOp.record = didDocument;

    // TODO: add a key to the didDocument

    async.auto({
      sign: callback => jsigs.sign(unsignedOp, {
        algorithm: 'RsaSignature2018',
        privateKeyPem: mockData.didDocuments.alpha.privateDidDocument
          .invokeCapability[0].publicKey.privateKeyPem,
        creator: didDocument.invokeCapability[0].publicKey.id
      }, callback),
      proof: ['sign', (results, callback) => jsigs.sign(
        results.sign, {
          algorithm: 'EquihashProof2018',
          parameters: {
            n: config['veres-one-validator'].equihash.equihashParameterN,
            k: config['veres-one-validator'].equihash.equihashParameterK
          }
        }, callback)],
      register: ['proof', (results, callback) => {
        const registerUrl = bedrock.util.clone(urlObj);
        registerUrl.pathname =
          config['veres-one'].routes.dids + '/' + didDocument.id;
        request.post({
          url: url.format(registerUrl),
          body: results.proof
        }, (err, res) => {
          assertNoError(err);
          res.statusCode.should.equal(204);
          callback();
        });
      }]
    }, err => {
      assertNoError(err);
      done(err);
    });
  });

  it.skip('should be allowed by Accelerator', done => {
    const validDidDescription =
      bedrock.util.clone(mockData.didDocuments.alpha);
    const registerEvent = bedrock.util.clone(mockData.events.create);
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
        const registerUrl = bedrock.util.clone(urlObj);
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
    const validDidDescription =
      bedrock.util.clone(mockData.didDocuments.epsilon);
    const registerEvent = bedrock.util.clone(mockData.events.create);
    registerEvent.input = [validDidDescription];

    async.auto({
      sign: callback => jsigs.sign(registerEvent, {
        algorithm: 'RsaSignature2018',
        privateKeyPem: mockData.keys.epsilon.privateKeyPem,
        creator: validDidDescription.authenticationCredential[0].id
      }, callback),
      pow: callback => equihashSigs.sign({
        n: mockData.equihashParameterN,
        k: mockData.equihashParameterK,
        doc: registerEvent
      }, callback),
      register: ['pow', (results, callback) => {
        const registerUrl = bedrock.util.clone(urlObj);
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
