/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const config = require('bedrock').config;

// temporary development passwords, replaced in testnet / production via prompts
config['veres-one'].adminPassphrase =
  'password';
config['veres-one'].peerPassphrase =
  'insecure_eyium0phookoh9geeshewomaekuoTeib';
