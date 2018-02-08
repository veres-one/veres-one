/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
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

describe('DID creation', () => {
  it('a DID owner should be able to create its own DID document', done => {
    // create all supporting DIDs
    const didDescription = mockData.didDescriptions.alpha;
    const unsignedOp = mockData.operations.create;
    unsignedOp.record = mockData.didDescriptions.alpha;

    async.auto({
      sign: callback => jsigs.sign(unsignedOp, {
        algorithm: 'LinkedDataSignature2015',
        privateKeyPem: mockData.keys.alpha.invokeCapabilityPrivateKeyPem,
        creator: didDescription.invokeCapability[0].publicKey.id
      }, callback),
      proof: callback => equihashSigs.sign({
        doc: unsignedOp,
        n: config['veres-one-validator'].equihash.equihashParameterN,
        k: config['veres-one-validator'].equihash.equihashParameterK
      }, callback),
      register: ['sign', 'proof', (results, callback) => {
        const registerUrl = bedrock.util.clone(urlObj);
        const signedOp = bedrock.util.clone(unsignedOp);
        signedOp.proof = [
          results.sign.signature,
          results.proof.signature
        ];
        registerUrl.pathname =
          config['veres-one'].routes.dids + '/' + didDescription.id;
        request.post({
          url: url.format(registerUrl),
          body: signedOp
        }, (err, res) => {
          assertNoError(err);
          res.statusCode.should.equal(202);
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
    const didDescription = _.cloneDeep(mockData.didDescriptions.alpha);
    const registerEvent = bedrock.util.clone(mockData.events.create);
    registerEvent.input = [didDescription];

    // add a key to the didDescription

    async.auto({
      sign: callback => jsigs.sign(registerEvent, {
        algorithm: 'LinkedDataSignature2015',
        privateKeyPem: mockData.keys.alpha.privateKeyPem,
        creator: didDescription.authenticationCredential[0].id
      }, callback),
      proof: callback => equihashSigs.sign({
        doc: registerEvent,
        n: config['veres-one-validator'].equihash.equihashParameterN,
        k: config['veres-one-validator'].equihash.equihashParameterK
      }, callback),
      register: ['sign', 'proof', (results, callback) => {
        const registerUrl = bedrock.util.clone(urlObj);
        const signedDoc = bedrock.util.clone(registerEvent);
        signedDoc.proof = [
          results.sign.signature,
          results.proof.signature
        ];
        registerUrl.pathname =
          config['veres-one'].routes.dids + '/' + didDescription.id;
        request.post({
          url: url.format(registerUrl),
          body: signedDoc
        }, (err, res) => {
          assertNoError(err);
          res.statusCode.should.equal(202);
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
      bedrock.util.clone(mockData.didDescriptions.alpha);
    const registerEvent = bedrock.util.clone(mockData.events.create);
    registerEvent.input = [validDidDescription];

    async.auto({
      getPrivateKey: callback =>
        fs.readFile(config['veres-one'].privateKey, 'utf8', callback),
      sign: ['getPrivateKey', (results, callback) => jsigs.sign(registerEvent, {
        algorithm: 'LinkedDataSignature2015',
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
      bedrock.util.clone(mockData.didDescriptions.epsilon);
    const registerEvent = bedrock.util.clone(mockData.events.create);
    registerEvent.input = [validDidDescription];

    async.auto({
      sign: callback => jsigs.sign(registerEvent, {
        algorithm: 'LinkedDataSignature2015',
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
