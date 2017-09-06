/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const config = require('bedrock').config;
const constants = config.constants;
const helpers = require('./helpers');

const mock = {};
module.exports = mock;

mock.ddos = {}
mock.events = {};

mock.ddos.valid = {
  '@context': 'https://w3id.org/veres-one/v1',
  id: 'did:v1:215cb1dc-1f44-4695-a07f-97649cad9938',
  authorization: [{
    // this entity may update any field in this DDO using any authentication
    //mechanism understood by the ledger
    capability: 'UpdateDdo',
    entity: 'did:v1:215cb1dc-1f44-4695-a07f-97649cad9938'
  }, {
    // this entity may update the authenticationCredential field in this DDO
    // as long as they authenticate with RsaSignature2017
    entity: 'did:v1:b5f8c320-f7ca-4869-85e6-a1bcbf825b2a',
    capability: 'UpdateDdo',
    field: ['authenticationCredential'],
    permittedProofType: [{
      proofType: 'RsaSignature2017'
    }]
  }, {
    // anyone may update the authenticationCredential and authorization
    // fields as long as they provide a specific multi-signature proof
    capability: 'UpdateDdo',
    field: ['authenticationCredential', 'authorization'],
    permittedProofType: [{
      proofType: 'RsaSignature2017',
      minimumSignatures: 3,
      authenticationCredential: [{
        id: 'did:v1:304ebc3e-7997-4bf4-a915-dd87e8455941/keys/123',
        type: 'RsaCryptographicKey',
        owner: 'did:v1:304ebc3e-7997-4bf4-a915-dd87e8455941',
        publicKeyPem: '-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n'
      }, {
        id: 'did:v1:0f22346a-a360-4f3e-9b42-3366e348e941/keys/foo',
        type: 'RsaCryptographicKey',
        owner: 'did:v1:0f22346a-a360-4f3e-9b42-3366e348e941',
        publicKeyPem: '-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n'
      }, {
        id: 'did:v1:a8d00377-e9f1-44df-a1b9-55072e13262a/keys/abc',
        type: 'RsaCryptographicKey',
        owner: 'did:v1:a8d00377-e9f1-44df-a1b9-55072e13262a',
        publicKeyPem: '-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n'
      }]
    }]
  }, {
    // this entity may issue credentials where the 'issuer' field is this
    // DDO's DID as long as this specific RSA key is used
    capability: 'IssueCredential',
    entity: 'did:v1:215cb1dc-1f44-4695-a07f-97649cad9938',
    permittedProofType: [{
      proofType: 'RsaSignature2017',
      authenticationCredential: [{
        id: 'did:v1:215cb1dc-1f44-4695-a07f-97649cad9938/keys/1',
        type: 'RsaCryptographicKey',
        owner: 'did:v1:215cb1dc-1f44-4695-a07f-97649cad9938',
        publicKeyPem: '-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n'
      }]
    }]
  }],
  authenticationCredential: [{
    // this key can be used to authenticate as DID ...9938
    "id": "did:v1:215cb1dc-1f44-4695-a07f-97649cad9938/keys/1",
    "type": "RsaCryptographicKey",
    "owner": "did:v1:215cb1dc-1f44-4695-a07f-97649cad9938",
    "publicKeyPem": "-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n"
  }]
};

mock.events.create = {
  '@context': 'https://w3id.org/webledger/v1',
  type: 'WebLedgerEvent',
  operation: 'Create',
  input: []
};