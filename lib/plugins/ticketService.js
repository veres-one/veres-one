/*!
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const {asyncHandler, express} = require('bedrock-express');
const jsonld = require('jsonld');
const {util: {clone, w3cDate}} = bedrock;

const router = express.Router();

module.exports = {
  type: 'ledgerAgentPlugin',
  api: {
    router,
    serviceType: 'urn:veresone:ticket-service'
  }
};

const mockProof = {
  type: 'Ed25519Signature2020',
  created: '2019-01-08T15:36:58Z',
  verificationMethod: 'did:v1:test:nym:z279yHL6HsxRzCPU78DAWgZVieb8xPK1mJKJBb' +
    'P8T2CezuFY#z279yHL6HsxRzCPU78DAWgZVieb8xPK1mJKJBbP8T2CezuFY',
  capability: 'did:v1:uuid:c37e914a-1e2a-4d59-9668-ee93458fd19a',
  capabilityAction: 'write',
  invocationTarget: 'did:v1:nym:ledger',
  proofValue: 'MOCKPROOF',
  proofPurpose: 'capabilityInvocation'
};

// must delay defining router endpoints until validation schemas are loaded
// in `bedrock.init` handler in `bedrock-validation`
bedrock.events.on('bedrock.init', () => {
  // FIXME: add validation and authentication
  router.post(
    '/', /* validate(),*/
    asyncHandler(async (req, res) => {
      // const {ledgerNode} = req.ledgerAgent;
      const {operation} = req.body;
      const proof = clone(mockProof);
      proof.created = w3cDate(new Date());
      jsonld.addValue(operation, 'proof', proof);
      res.json({operation});
    }));
});
