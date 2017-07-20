/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

process.env['NODE_PATH'] = '../node_modules';
const bedrock = require('bedrock');
const brDidClient = require('bedrock-did-client');
// NOTE: it is critical that bedrock-protractor be required first so that
// it can register a bedrock.cli event listener
require('bedrock-protractor');
//require('bedrock-permission'); // FIXME
require('bedrock-ledger');
require('bedrock-ledger-agent');
require('bedrock-ledger-consensus-uni');
require('bedrock-ledger-context');
require('bedrock-ledger-guard-equihash');
require('bedrock-ledger-guard-signature');
require('bedrock-ledger-storage-mongodb');
require('../lib');

require('../configs/dev');

bedrock.events.on('bedrock.init', () => {
  const jsonld = bedrock.jsonld;
  const mockData = require('./mocha/mock.data');

  const oldLoader = jsonld.documentLoader;

  jsonld.documentLoader = function(url, callback) {
    if(Object.keys(mockData.ldDocuments).includes(url)) {
      return callback(null, {
        contextUrl: null,
        document: mockData.ldDocuments[url],
        documentUrl: url
      });
    }
    oldLoader(url, callback);
  };
  // override jsonld.documentLoader in brDidClient so this document loader
  // can be used for did: and https: URLs
  brDidClient.jsonld.documentLoader = jsonld.documentLoader;
});

require('bedrock-test');
bedrock.start();
