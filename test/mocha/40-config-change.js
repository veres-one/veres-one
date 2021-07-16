/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config, util: {clone}} = require('bedrock');
const {documentLoader} = require('bedrock-jsonld-document-loader');
const https = require('https');
const jsigs = require('jsonld-signatures');
const mockData = require('./mock.data');
const {WebLedgerClient} = require('web-ledger-client');
const wlClient = new WebLedgerClient({
  hostname: config.server.host,
  httpsAgent: new https.Agent({rejectUnauthorized: false})
});
const {Ed25519Signature2020} =
  require('@digitalbazaar/ed25519-signature-2020');
const {AssertionProofPurpose} = jsigs.purposes;

const didv1 = require('did-veres-one').driver();

// FIXME: changing configs is not currently possible.
// a config queue (like an operation queue) might make it possible in the future
describe.skip('Ledger configuration changes.', () => {
  describe('validation errors', () => {
    it('rejects a configuration without a proof', async () => {
      const y = await wlClient.getStatus();
      const {latestConfigEvent: {ledgerConfiguration: {ledger}}} = y;
      const ledgerConfiguration = clone(mockData.configurations.alpha);
      // set the ledger property to the proper ledger ID
      ledgerConfiguration.ledger = ledger;
      let result;
      let error;
      try {
        result = await wlClient.sendConfig({ledgerConfiguration});
      } catch(e) {
        error = e;
      }
      should.exist(error);
      should.not.exist(result);
      const {details} = error;
      details.error.type.should.equal('ValidationError');
    });
    it('rejects a configuration based on sequence === 0', async () => {
      const mockDidDoc = await didv1.generate();
      const method = mockDidDoc.methodFor({purpose: 'capabilityInvocation'});
      const signingKey = mockDidDoc.keyPairs.get(method.id);
      const y = await wlClient.getStatus();
      const {latestConfigEvent: {ledgerConfiguration: {ledger}}} = y;
      const ledgerConfiguration = clone(mockData.configurations.alpha);
      // set the ledger property to the proper ledger ID
      ledgerConfiguration.ledger = ledger;
      ledgerConfiguration.creator = 'https://example.com/apeer';
      const signedConfiguration = await jsigs.sign(ledgerConfiguration, {
        documentLoader,
        suite: new Ed25519Signature2020({key: signingKey}),
        purpose: new AssertionProofPurpose()
      });
      let result;
      let error;
      try {
        result = await wlClient.sendConfig(
          {ledgerConfiguration: signedConfiguration});
      } catch(e) {
        error = e;
      }
      should.exist(error);
      should.not.exist(result);
      const {details} = error;
      details.error.type.should.equal('ValidationError');
      details.error.details.errors[0].message.should.equal('should be >= 1');
    });
  });

  // config changes are disabled in testnet v2 by restricting the value
  // of sequence in the config to zero. The Continuity validator does not
  // allow config *changes* with a sequence of zero. Genesis config is the only
  // config with a sequence of zero.
  describe('should not allow config change for testnet v2', () => {
    it('rejects a configuration based on sequence !== 0', async () => {
      const mockDidDoc = await didv1.generate();
      const method = mockDidDoc.methodFor({purpose: 'capabilityInvocation'});
      const signingKey = mockDidDoc.keyPairs.get(method.id);
      const y = await wlClient.getStatus();
      const {latestConfigEvent: {ledgerConfiguration: {ledger}}} = y;
      const ledgerConfiguration = clone(mockData.configurations.alpha);
      // set the ledger property to the proper ledger ID
      ledgerConfiguration.ledger = ledger;
      ledgerConfiguration.creator = 'https://example.com/apeer';
      ledgerConfiguration.sequence = 1;
      const signedConfiguration = await jsigs.sign(ledgerConfiguration, {
        documentLoader,
        suite: new Ed25519Signature2020({key: signingKey}),
        purpose: new AssertionProofPurpose()
      });
      let result;
      let error;
      try {
        result = await wlClient.sendConfig(
          {ledgerConfiguration: signedConfiguration});
      } catch(e) {
        error = e;
      }
      should.exist(error);
      should.not.exist(result);
      const {details} = error;
      details.error.type.should.equal('ValidationError');
      const [report] = details.error.details.validatorReports;
      const [e] = report.error.details.errors;
      e.message.should.equal('should be equal to one of the allowed values');
    });
  });
});
