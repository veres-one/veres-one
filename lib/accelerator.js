/*!
 * Veres One Accelerator API.
 *
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const _ = require('lodash');
const async = require('async');
const bedrock = require('bedrock');
const config = bedrock.config;
const didv1 = require('did-veres-one');
const fs = require('fs');
const forge = require('node-forge');
const logger = require('./logger');

require('bedrock-express');

// module API
const api = {};
module.exports = api;

bedrock.events.on('bedrock-express.ready', (app, callback) =>
  _setupAccelerator(callback));

// try to read and process, or generate save and process
function _readOrCreateJson({path, create, loaded, stored}, callback) {
  // try to read
  fs.readFile(path, 'utf8', (err, data) => {
    if(err) {
      if(err.code === 'ENOENT') {
        // does not exist, create and write
        // create data
        return create((err, data) => {
          if(err) {
            return callback(err);
          }
          // try to write
          const str = JSON.stringify(data, null, 2);
          fs.writeFile(path, str, {
            encoding: 'utf8',
            //mode: 0o600
            flag: 'wx'
          }, err => {
            if(err) {
              // now exists, try again
              if(err.code === 'EEXIST') {
                return _readOrCreate({path, create, loaded, stored})
              }
            }
            return stored(data, (err) => {
              if(err) {
                return callback(err);
              }
              callback(null, data);
            });
          });
        });
      }
      return callback(err);
    }
    const parsed = JSON.parse(data);
    loaded(parsed, (err) => {
      if(err) {
        return callback(err);
      }
      callback(null, parsed);
    });
  });
}

// setup accelerator
function _setupAccelerator(callback) {
  if(!config['veres-one'].acceleratorEnabled) {
    return callback();
  }
  logger.info('Accelerator enabled');

  const path = config['veres-one'].acceleratorConfigFile;

  _readOrCreateJson({
    path,
    create: callback => {
      // generate the Accelerator DID Document
      logger.info('Generating accelerator DID');
      didv1.generate({
        passphrase: config['veres-one'].acceleratorPassphrase
      }, (err, doc) => {
        if(err) {
          return callback(err);
        }
        callback(null, doc.privateDidDocument);
      });
    },
    loaded: (doc, callback) => {
      logger.info('Loaded accelerator DID', {did: doc.id, path});
      callback();
    },
    stored: (doc, callback) => {
      logger.info('Stored accelerator DID', {did: doc.id, path});
      callback();
    }
  }, (err, doc) => {
    if(err) {
      logger.error(
        'Error while initializing Veres One accelerator', {error: err});
      return callback(err);
    }
    logger.info('Accelerator ready', {did: doc.id});
    const acceleratorPrivateKey = forge.pki.decryptRsaPrivateKey(
      doc.authentication[0].publicKey[0].privateKey.privateKeyPem,
      config['veres-one'].acceleratorPassphrase, {algorithm: 'aes256'});
    config['veres-one'].acceleratorPublicKeyId =
      doc.authentication[0].publicKey[0].id;
    config['veres-one'].acceleratorPrivateKeyPem =
      forge.pki.privateKeyToPem(acceleratorPrivateKey);
    callback();
  });
}

api.enabled = (callback) => {
  return config['veres-one'].acceleratorEnabled;
}

api.proofs = (operation, callback) => {
  const publicKeyId = config['veres-one'].acceleratorPublicKeyId;
  const privateKeyPem = config['veres-one'].acceleratorPrivateKeyPem;

  didv1.attachInvocationProof({
    operation,
    // FIXME the ID of the capability that is being invoked (e.g. the ID of the record in the operation for self-invoked capabilities).
    capability: config['veres-one'].acceleratorCapability,
    capabilityAction: 'AuthorizeRequest',
    creator: publicKeyId,
    privateKeyPem: privateKeyPem
  }, (err, op) => {
    if(err) {
      return callback(err);
    }
    callback(null, op);
  });
};
