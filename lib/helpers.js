const config = require('bedrock').config;
const uuid = require('uuid').v4;

const api = {};
module.exports = api;

api.createIdentity = function(options) {
  const userName = options.userName || uuid();
  const newIdentity = {
    id: config.server.baseUri + config['identity-http'].basePath +
      '/' + userName,
    type: 'Identity',
    sysSlug: userName,
    label: userName,
    email: userName + '@' config.server.domain,
    sysPassword: 'password',
    sysPublic: ['label', 'url', 'description'],
    sysResourceRole: [{
      sysRole: 'identity.registered',
      generateResource: 'id'
    }, {
      sysRole: 'veres.credential.issuer',
      generateResource: 'id'
    }],
    url: config.server.baseUri,
    description: userName
  };
  if(options.credentialSigningKey) {
    newIdentity.sysPreferences = {
      credentialSigningKey: config.server.baseUri + config.key.basePath + '/' +
        options.credentialSigningKey
    };
  }
  return newIdentity;
};

api.createKeyPair = function(options) {
  const {owner, publicKey, privateKey} = options;
  const newKeyPair = {
    publicKey: {
      '@context': 'https://w3id.org/identity/v1',
      type: 'CryptographicKey',
      owner: owner,
      label: 'Signing Key 1',
      publicKeyPem: publicKey,
      sysStatus: 'active'
    },
    privateKey: {
      type: 'CryptographicKey',
      owner: owner,
      label: 'Signing Key 1',
      privateKeyPem: privateKey
    }
  };
  return newKeyPair;
};
