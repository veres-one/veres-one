/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* globals should */
'use strict';

const async = require('async');
const bedrock = require('bedrock');
const config = bedrock.config;
const equihashSigs = require('equihash-signature');
const helpers = require('./helpers');
const jsigs = require('jsonld-signatures');
const mockData = require('./mock.data');
let request = require('request');
request = request.defaults({json: true, strictSSL: false});
const url = require('url');
const uuid = require('uuid/v4');
const querystring = require('querystring');

const urlObj = {
  protocol: 'https',
  host: config.server.host,
  pathname: config['ledger-agent'].routes.agents
};

// use local JSON-LD processor for signatures
jsigs.use('jsonld', bedrock.jsonld);

describe('Integration - 1 Node - Unilateral - Equihash', () => {
  const regularActor = mockData.identities.regularUser;
  let ledgerAgent;

  before(done => helpers.prepareDatabase(mockData, done));
  before(done => {
    async.auto({
      sign: callback => {
        jsigs.sign(mockData.events.equihashConfig, {
          algorithm: 'LinkedDataSignature2015',
          privateKeyPem: regularActor.keys.privateKey.privateKeyPem,
          creator: regularActor.keys.publicKey.id
        }, callback);
      },
      add: ['sign', (results, callback) => {
        request.post(helpers.createHttpSignatureRequest({
          url: url.format(urlObj),
          body: results.sign,
          identity: regularActor
        }), (err, res) => {
          should.not.exist(err);
          res.statusCode.should.equal(201);
          callback(null, res.headers.location);
        });
      }],
      get: ['add', (results, callback) => {
        request.get(helpers.createHttpSignatureRequest({
          url: results.add,
          identity: regularActor
        }), (err, res) => {
          should.not.exist(err);
          res.statusCode.should.equal(200);
          ledgerAgent = res.body;
          callback();
        });
      }]
    }, err => done(err));
  });
  beforeEach(done => {
    helpers.removeCollection('ledger_testLedger', done);
  });
  it('should add 10 events and blocks', done => {
    const testConfig =
      mockData.events.equihashConfig.input[0].eventValidator[1];
    async.times(10, (n, callback) => {
      const concertEvent = bedrock.util.clone(mockData.events.concert);
      concertEvent.input[0].id = 'https://example.com/events/' + uuid(),

      async.auto({
        sign: callback => equihashSigs.sign({
          n: testConfig.equihashParameterN,
          k: testConfig.equihashParameterK,
          doc: concertEvent
        }, callback),
        add: ['sign', (results, callback) => {
          request.post(helpers.createHttpSignatureRequest({
            url: ledgerAgent.service.ledgerEventService,
            body: results.sign,
            identity: regularActor
          }), (err, res) => {
            should.not.exist(err);
            res.statusCode.should.equal(201);
            callback(null, res.headers.location);
          });
        }]}, err => callback(err));
    }, err => done(err));
  });
  it('should crawl to genesis block from latest block', done => {
    const maxAttempts = 20;
    let attempts = 0;
    let currentBlock;

    async.auto({
      getLatestBlock: callback => {
        request.get(helpers.createHttpSignatureRequest({
          url: ledgerAgent.service.ledgerBlockService,
          identity: regularActor
        }), (err, res) => {
          should.not.exist(err);
          res.statusCode.should.equal(200);
          currentBlock = res.body.latest.block.id;
          callback(null, res.body);
        });
      },
      crawlToGenesis: ['getLatestBlock', (results, callback) => {
        let done = false;
        async.until(() => done, callback => {
          const blockUrl = ledgerAgent.service.ledgerBlockService + '?' +
            querystring.stringify({id: currentBlock});

          request.get(helpers.createHttpSignatureRequest({
            url: blockUrl,
            identity: regularActor
          }), (err, res) => {
            should.not.exist(err);
            res.statusCode.should.equal(200);
            if(!res.body.block.previousBlock || attempts > maxAttempts) {
              done = true;
              return callback(null, res.body);
            }
            currentBlock = res.body.block.previousBlock;
            attempts++;
            callback(null, currentBlock);
          });
        }, (err, finalBlock) => {
          if(err) {
            return callback(err);
          }
          should.exist(finalBlock);
          should.exist(finalBlock.block);
          should.not.exist(finalBlock.block.previousBlock);
          should.not.exist(finalBlock.block.previousBlockHash);
          callback();
        });
      }]
    }, err => done(err));
  });
});
