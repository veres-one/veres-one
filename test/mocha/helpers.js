/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const _ = require('lodash');
const async = require('async');
const bedrock = require('bedrock');
const brIdentity = require('bedrock-identity');
const brKey = require('bedrock-key');
const config = bedrock.config;
const database = require('bedrock-mongodb');
const jsigs = require('jsonld-signatures');
const scheduler = require('bedrock-jobs');
const uuid = require('uuid/v4');
const url = require('url');

const api = {};
module.exports = api;

api.vrOneLedgerReady = new Promise(resolve => {
  bedrock.events.on('veres-one.ready', () => resolve());
});

api.IDENTITY_BASE_PATH = config.server.baseUri +
  config['identity-http'].basePath + '/';

api.createCrytographicIdentity = function(sourceIdentity, callback) {
  const publicKey = {
    '@context': 'https://w3id.org/identity/v1',
    id: sourceIdentity.keys.publicKey.id,
    type: 'CryptographicKey',
    owner: sourceIdentity.identity.id,
    publicKeyPem: sourceIdentity.keys.publicKey.publicKeyPem
  };
  const credential = {
    '@context': 'https://w3id.org/identity/v1',
    id: 'urn:ephemeral:' + uuid(),
    type: ['Credential', 'CryptographicKeyCredential'],
    claim: {
      id: sourceIdentity.identity.id,
      publicKey: publicKey
    }
  };
  jsigs.sign(
    credential, {
      privateKeyPem:
        sourceIdentity.keys.privateKey.privateKeyPem,
      creator: sourceIdentity.keys.publicKey.id,
      // domain: url.parse(config.server.baseUri).host,
      algorithm: 'RsaSignature2018'
    }, (err, signedCredential) => {
      if(err) {
        callback(err);
      }
      const targetIdentity = {
        '@context': 'https://w3id.org/identity/v1',
        id: sourceIdentity.identity.id,
        type: 'Identity',
        credential: [{'@graph': signedCredential}]
      };
      jsigs.sign(
        targetIdentity, {
          privateKeyPem:
            sourceIdentity.keys.privateKey.privateKeyPem,
          creator: sourceIdentity.keys.publicKey.id,
          domain: url.parse(config.server.baseUri).host,
          algorithm: 'RsaSignature2018'
        }, (err, signedIdentity) => {
          if(err) {
            callback(err);
          }
          callback(null, signedIdentity);
        });
    });
};

api.createHttpSignatureRequest = function(options) {
  const newRequest = {
    url: options.url,
    httpSignature: {
      key: options.identity.keys.privateKey.privateKeyPem,
      keyId: options.identity.keys.publicKey.id,
      headers: ['date', 'host', 'request-line']
    }
  };
  if(options.body) {
    newRequest.body = options.body;
  }
  return newRequest;
};

api.createIdentity = function(options) {
  const userName = options.userName || uuid();
  const newIdentity = {
    id: config.server.baseUri + config['identity-http'].basePath +
      '/' + userName,
    type: 'Identity',
    sysSlug: userName,
    label: userName,
    email: userName + '@bedrock.dev',
    sysPassword: 'password',
    sysPublic: ['label', 'url', 'description'],
    sysResourceRole: [],
    url: config.server.baseUri,
    description: userName,
    sysStatus: 'active'
  };
  if(options.credentialSigningKey) {
    _.defaults(newIdentity, {
      sysPreferences: {
        credentialSigningKey: config.server.baseUri +
          config.key.basePath + '/' + options.credentialSigningKey
      }
    });
  }
  return newIdentity;
};

api.createJob = function() {
  const newJob = {};
  newJob.worker = {};
  newJob.worker.id = scheduler.createWorkerId();
  return newJob;
};

api.createKeyPair = function(options) {
  const {userName, publicKey, privateKey} = options;
  const keyId = options.keyId || uuid();
  let fullKeyId;
  let ownerId;
  if(userName.startsWith('did:')) {
    fullKeyId = userName + '/keys/' + keyId;
    ownerId = userName;
  } else {
    fullKeyId = config.server.baseUri + config.key.basePath + '/' + keyId;
    ownerId = config.server.baseUri + config['identity-http'].basePath + '/'
      + userName;
  }
  const newKeyPair = {
    publicKey: {
      '@context': 'https://w3id.org/identity/v1',
      id: fullKeyId,
      type: 'CryptographicKey',
      owner: ownerId,
      label: 'Signing Key 1',
      publicKeyPem: publicKey,
      sysStatus: 'active'
    },
    privateKey: {
      type: 'CryptographicKey',
      owner: ownerId,
      label: 'Signing Key 1',
      publicKey: fullKeyId,
      privateKeyPem: privateKey
    }
  };
  if(options.isSigningKey) {
    newKeyPair.isSigningKey = true;
  }
  return newKeyPair;
};

api.removeCollection = function(collection, callback) {
  const collectionNames = [collection];
  database.openCollections(collectionNames, () => {
    async.each(collectionNames, function(collectionName, callback) {
      database.collections[collectionName].remove({}, callback);
    }, function(err) {
      callback(err);
    });
  });
};

api.removeCollections = function(callback) {
  const collectionNames = [
    'eventLog',
    'identity',
    'publicKey'
  ];
  database.openCollections(collectionNames, () => {
    async.each(collectionNames, (collectionName, callback) => {
      database.collections[collectionName].remove({}, callback);
    }, function(err) {
      callback(err);
    });
  });
};

api.prepareDatabase = function(mockData, callback) {
  async.series([
    callback => {
      api.removeCollections(callback);
    },
    callback => {
      insertTestData(mockData, callback);
    }
  ], callback);
};

// Insert identities and public keys used for testing into database
function insertTestData(mockData, callback) {
  async.forEachOf(mockData.identities, (identity, key, callback) =>
    async.parallel([
      callback => brIdentity.insert(null, identity.identity, callback),
      callback => {
        if(identity.keys) {
          return async.each([].concat(identity.keys), (k, callback) => {
            if(k.isSigningKey) {
              return brKey.addPublicKey(
                null, k.publicKey, k.privateKey, callback);
            }
            brKey.addPublicKey(null, k.publicKey, callback);
          }, callback);
        }
        callback();
      }
    ], callback),
  err => {
    if(err) {
      if(!database.isDuplicateError(err)) {
        // duplicate error means test data is already loaded
        return callback(err);
      }
    }
    callback();
  }, callback);
}
