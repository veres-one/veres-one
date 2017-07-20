/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const config = require('bedrock').config;
const constants = config.constants;
const helpers = require('./helpers');

const mock = {};
module.exports = mock;

const identities = mock.identities = {};
mock.ldDocuments = {};
let userName;
let keyId;

// identity with permission to add public keys
userName = 'regularUser';
identities[userName] = {};
identities[userName].identity = helpers.createIdentity({userName: userName});
identities[userName].identity.sysResourceRole.push({
  sysRole: 'veres-one.test',
  generateResource: 'id'
});
identities[userName].keys = helpers.createKeyPair({
  userName: userName,
  // userId: identities[userName].identity.id,
  publicKey: '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqv8gApfU3FhZx1gyKmBU\n' +
    'czZ1Ba3DQbqcGRJiwWz6wrr9E/K0PcpRws/+GPc1znG4cKLdxkdyA2zROUt/lbaM\n' +
    'TU+/kZzRh3ICZZOuo8kJpGqxPDIm7L1lIcBLOWu/UEV2VaWNOENwiQbh61VJlR+k\n' +
    'HK9LhQxYYZT554MYaXzcSRTC/RzHDTAocf+B1go8tawPEixgs93+HHXoLPGypmqn\n' +
    'lBKAjmGMwizbWFccDQqv0yZfAFpdVY2MNKlDSUNMnZyUgBZNpGOGPm9zi9aMFT2d\n' +
    'DrN9fpWMdu0QeZrJrDHzk6TKwtKrBB9xNMuHGYdPxy8Ix0uNmUt0mqt6H5Vhl4O0\n' +
    '0QIDAQAB\n' +
    '-----END PUBLIC KEY-----\n',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEpQIBAAKCAQEAqv8gApfU3FhZx1gyKmBUczZ1Ba3DQbqcGRJiwWz6wrr9E/K0\n' +
    'PcpRws/+GPc1znG4cKLdxkdyA2zROUt/lbaMTU+/kZzRh3ICZZOuo8kJpGqxPDIm\n' +
    '7L1lIcBLOWu/UEV2VaWNOENwiQbh61VJlR+kHK9LhQxYYZT554MYaXzcSRTC/RzH\n' +
    'DTAocf+B1go8tawPEixgs93+HHXoLPGypmqnlBKAjmGMwizbWFccDQqv0yZfAFpd\n' +
    'VY2MNKlDSUNMnZyUgBZNpGOGPm9zi9aMFT2dDrN9fpWMdu0QeZrJrDHzk6TKwtKr\n' +
    'BB9xNMuHGYdPxy8Ix0uNmUt0mqt6H5Vhl4O00QIDAQABAoIBAQCpA3yXM42AsY8j\n' +
    'mwgSnJ48NqJaF5L8P7+UhHi6KMZ+fSYydl0zCevge4bzFD3JrNuZ8VD1b57AxejT\n' +
    'Ec2so/9vVxjJi1AK6WR3FA608rumGJLQJd4Vd2ojfxabTeWOKOo642R/LSFpPzVE\n' +
    'T0toqxqiA53IhxhAc2jDLO+PLIvrao0Y8bWWq36tbxsAplrv8Gms6ZRwfKoX5P32\n' +
    'azBpJOqneNdSMRPHky6t2uiYyuPeG9pbuaClkD7Ss9lpH0V1DLQmAAlP9I0Aa06B\n' +
    'a9zPFPb3Ae8F0HO/tsf8gIvrlT38JvLe5VuCS7/LQNCZguyPZuZOXLDmdETfm1FD\n' +
    'q56rCV7VAoGBANmQ7EqDfxmUygTXlqaCQqNzY5pYKItM6RFHc9I+ADBWsLbuKtfP\n' +
    'XUMHQx6PvwCMBpjZkM7doGdzOHb0l3rW8zQONayqQxN9Pjd7K+dkSY6k0SScw46w\n' +
    '0AexDQSM/0ahVAHfXXi1GbKwlonM0nn/7JHz7n/fL9HwV8T3hAGClbPDAoGBAMk0\n' +
    'K5d+Ov55sKW0ZatZ0vTnfBCSrVEfG6FkcyK7uiSsMdWo2/De0VtJF7od2DM5UyP6\n' +
    'Y/DSVk4oPepbug5oGdu8t1Q3jbS61A7i/dssirQC4hEFAtoTGsVfaH8wu4AKyWd7\n' +
    '0rUmSrnyqNr4mfQBjdaXByvWO9rdEfZcZqaSQ4/bAoGAKy/CR7Q8eYZ4Z2eoBtta\n' +
    'gPl5rvyK58PXi8+EJRqbjPzYTSePp5EI8TIy15EvF9uzv4mIXhfOLFrJvYsluoOK\n' +
    'eS3M575QXEEDJZ40g9T7aO48eakIhH2CfdReQiX+0jVZ6Jk/A6PnOvokl6vpp7/u\n' +
    'ZLZoBEf4RRMRSQ7czDPwpWMCgYEAlNWZtWuz+hBMgpcqahF9AprF5ICL4qkvSDjF\n' +
    'Dpltfbk+9/z8DXbVyUANZCi1iFbMUJ3lFfyRySjtfBI0VHnfPvOfbZXWpi1ZtlVl\n' +
    'UZ7mT3ief9aEIIrnT79ezk9fM71G9NzcphHYTyrYi3pAcAZCRM3diSjlh+XmZqY9\n' +
    'bNRfU+cCgYEAoBYwp0PJ1QEp3lSmb+gJiTxfNwIrP+VLkWYzPREpSbghDYjE2DfC\n' +
    'M8pNbVWpnOfT7OlhN3jw8pxHWap6PxNyVT2W/1AHNGKTK/BfFVn3nVGhOgPgH1AO\n' +
    'sObYxm9gpkNkelXejA/trbLe4hg7RWNYzOztbfbZakdVjMNfXnyw+Q0=\n' +
    '-----END RSA PRIVATE KEY-----\n'
});

// DID-based identity
const didIdentities = {};
mock.didIdentities = didIdentities;
userName = 'alpha',
didIdentities[userName] = {};
didIdentities[userName].identity = {
  id: 'did:7847487c-d224-4579-8e50-edfd8ab1a5bf'
};
didIdentities[userName].keys = helpers.createKeyPair({
  keyId: '1',
  userName: didIdentities[userName].identity.id,
  publicKey: '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA35Ojg+WdqkWvYyiZ4s+y\n' +
    'XIuJUIf+h461q4DR2oY+bF33HAeTX79Zvs55QVwq3A+KewmdAbl3F9g6jWRxVDB+\n' +
    'XxX1YxqHz9R7rDup2fVVQo+yDpxguL3r/7BUeezKfOZYCzBYM+i37adY42Hx7TM5\n' +
    'O9nbovSA7jKHvPbjul8yx3sjQvWd48/H+vCRszrwCoKShrf5YK3O+eKQKBcWre8R\n' +
    'kQoIisA5fOmOyy12ZvN+XqhDjHt3HwoOqV1Okq/gVqosKWR293ufSbZAcE4etK1Y\n' +
    'qQt2FvDsKQjOHMa+equ1IX9ZCoKKMTH5e/LmVnPZYZ563eEn29NBeUbV4fVrXpYa\n' +
    'vwIDAQAB\n' +
    '-----END PUBLIC KEY-----\n',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEogIBAAKCAQEA35Ojg+WdqkWvYyiZ4s+yXIuJUIf+h461q4DR2oY+bF33HAeT\n' +
    'X79Zvs55QVwq3A+KewmdAbl3F9g6jWRxVDB+XxX1YxqHz9R7rDup2fVVQo+yDpxg\n' +
    'uL3r/7BUeezKfOZYCzBYM+i37adY42Hx7TM5O9nbovSA7jKHvPbjul8yx3sjQvWd\n' +
    '48/H+vCRszrwCoKShrf5YK3O+eKQKBcWre8RkQoIisA5fOmOyy12ZvN+XqhDjHt3\n' +
    'HwoOqV1Okq/gVqosKWR293ufSbZAcE4etK1YqQt2FvDsKQjOHMa+equ1IX9ZCoKK\n' +
    'MTH5e/LmVnPZYZ563eEn29NBeUbV4fVrXpYavwIDAQABAoIBAAnliiZrgpgn74SP\n' +
    'Joiwsu9/ybtD2dN8ULRfxmpK6PZ5DlgySabCXKGimCF5h/gnw/SAT2/lGs12Z9kc\n' +
    'ahvU7bMd0LfrU7myaSsNlQ4t2vFQVQxqhamH1quBzat7/Nach6cvI6hgk8u0Ta37\n' +
    'Bu9+BfmNQjirZA2nNPT7ZMc6MZA84Pd5Y5QYjB0DcaG7Nyn9RgByQ8TF4pPIcGzS\n' +
    '0+Bqr9ZQf+wk3lGp7U1TT1W6OVrJPVICJSrMQMXUrZGjg99ah84SYcpZIUAZE2hz\n' +
    'awBN7SUnMw9ereJ5n1KvRIjInBRoeam8xOEf9GewAlLghxFARiHSax91jSrnDwyQ\n' +
    'IXsitTkCgYEA+LZeg13XrizjXy4mP9668H5nmKwARNRadZGUxaElplY3V8eUT2US\n' +
    'RSNPptkMCVymkNiv1dyIRP6BWbYugZV/xoSryzWvaMfEeXzESXMicrvmHV+KP1p1\n' +
    'Ew/yKwTobZkw0l6woZjhL465KQET0qbgcQZOl5vtrDspOuguqI0z/2sCgYEA5iC5\n' +
    'Es2dA1dP8TPokx7E5er+M8kX2C9TUJIpqAnTMRNvkeht+CpZzkQu8DOrAG9KUI0w\n' +
    '65FF6DFkyjX6kwHm9qpw2e7l7YIuLj2A4V7CGaGTz57656csxBzALAgmNvDUH5Tt\n' +
    'Hzpv5IUly40SMt8oVyL5STkK2wE00XTc6B9Jiv0CgYByQX1bxhGeH1r4z7+cmdqx\n' +
    'PrCiz2l0NUW1OwLoY2ZjaroT5ki4zIq/HkCqOo2wA1M1uYXVrnEfmPedWfc1apN/\n' +
    'hFVTjj8d2J/m261kvLK3mKBXIBvnjMu5zRqILsIED1sBWaS1KAFTErL3JlqP7D+x\n' +
    'TJ9wQJ7H/4mqWR2OKwgXLwKBgA5me85OaYXc/9ajHeme4klU5CVPbxuLEpaXHt4y\n' +
    'BzIp+jBSMBd4Zvg+UgWb5hZ34FmcDDSheZNnC9yPdiee1doXnko05dRv8f3YwWjY\n' +
    '6iJ6dupmE2NNlcKL3gajV+jWNx/mzNPIb1oIbu4G3N2sEzUorhrD5AcCU1DMFEq+\n' +
    'MnbtAoGAR0TB6+UHNUa3QXedhjFU9dOl0aAlbMxJXnOgpwCEPkXkSHqB5hhV+n1A\n' +
    'DgV9e3L1p1cbSGYd1GrUtMJfK5xLkgli24w32uZn8Z6w0z0gEut1PBmCjuHX7SiV\n' +
    '0Z1pogjGKg37mex9G24fNH1HNeYPvw0Qj4xHfPWJHIXnOnYGH60=\n' +
    '-----END RSA PRIVATE KEY-----\n'
});
userName = 'beta',
didIdentities[userName] = {};
didIdentities[userName].identity = {
  id: 'did:d0fa66af-c118-410d-bb5e-049003e16077'
};
userName = 'gamma',
didIdentities[userName] = {};
didIdentities[userName].identity = {
  id: 'did:29b27c7d-4aab-4c05-a99c-18344ab5bde3'
};
userName = 'delta',
didIdentities[userName] = {};
didIdentities[userName].identity = {
  id: 'did:41d08c5f-e994-498a-9607-a9de7168e9e9'
};
userName = 'epsilon',
didIdentities[userName] = {};
didIdentities[userName].identity = {
  id: 'did:814de1ca-f593-4124-b99e-9c4a4e5aadf3'
};

mock.didDocuments = {
  // DDO for mock identity
  'did:7847487c-d224-4579-8e50-edfd8ab1a5bf': {
    "@context": "https://w3id.org/identity/v1",
    "id": "did:7847487c-d224-4579-8e50-edfd8ab1a5bf",
    "idp": "did:1deb8074-8f4c-4a92-bc0f-de45e4b5bf58",
    "accessControl": {
      "writePermission": [
        {
          "id": "did:7847487c-d224-4579-8e50-edfd8ab1a5bf/keys/1",
          "type": "CryptographicKey"
        },
        {
          "id": "did:1deb8074-8f4c-4a92-bc0f-de45e4b5bf58",
          "type": "Identity"
        }
      ]
    },
    "publicKey": [
      {
        "id": "did:7847487c-d224-4579-8e50-edfd8ab1a5bf/keys/1",
        "type": "CryptographicKey",
        "owner": "did:7847487c-d224-4579-8e50-edfd8ab1a5bf",
        "publicKeyPem": "-----BEGIN PUBLIC KEY-----\n" +
          "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA35Ojg+WdqkWvYyiZ4s+y\n" +
          "XIuJUIf+h461q4DR2oY+bF33HAeTX79Zvs55QVwq3A+KewmdAbl3F9g6jWRxVDB+\n" +
          "XxX1YxqHz9R7rDup2fVVQo+yDpxguL3r/7BUeezKfOZYCzBYM+i37adY42Hx7TM5\n" +
          "O9nbovSA7jKHvPbjul8yx3sjQvWd48/H+vCRszrwCoKShrf5YK3O+eKQKBcWre8R\n" +
          "kQoIisA5fOmOyy12ZvN+XqhDjHt3HwoOqV1Okq/gVqosKWR293ufSbZAcE4etK1Y\n" +
          "qQt2FvDsKQjOHMa+equ1IX9ZCoKKMTH5e/LmVnPZYZ563eEn29NBeUbV4fVrXpYa\n" +
          "vwIDAQAB\n" +
          "-----END PUBLIC KEY-----\n"
      }
    ],
    "signature": {
      "type": "LinkedDataSignature2015",
      "created": "2016-03-25T14:27:42Z",
      "creator": "did:1deb8074-8f4c-4a92-bc0f-de45e4b5bf58/keys/1",
      "signatureValue": "AA5YSshFnzlKxFgj4FhZAS7vPAOG5IyPBEkVjdfsCpoKRAjlN/Qy2+noM+i7nQIBOSQ2FFmFHAce3GCTLnBMgMnkTRKgT6ABHX3WKv9k59FAkXrrKHR/B/T73XTkT5Xe2Jkigp/RMmQvhb7BaGDPI8CY8QIjkM2RFIPsdoxIWSKtljk/nPcfg20Fis/6K6JVmWvRGUmt4KvGEjiVtNreGb6bppkrt8fLh8HXWuhAozTw6kTv27n/Z2DfeiP9zp556gQJ9zGmD4YaJHcWkOWW0lXAZ6iKKc6LWVKcUEubVG3sjK2yag/Ft5qt8DYbelCkV0oM7sNyqUIBym0+Zd0+uw=="
    },
    "url": "https://example.com"
  },
  'did:d0fa66af-c118-410d-bb5e-049003e16077': {
    "@context": "https://w3id.org/identity/v1",
    "id": "did:d0fa66af-c118-410d-bb5e-049003e16077",
    "idp": "did:1deb8074-8f4c-4a92-bc0f-de45e4b5bf58",
    "accessControl": {
      "writePermission": [
        {
          "id": "did:d0fa66af-c118-410d-bb5e-049003e16077/keys/1",
          "type": "CryptographicKey"
        },
        {
          "id": "did:1deb8074-8f4c-4a92-bc0f-de45e4b5bf58",
          "type": "Identity"
        }
      ]
    },
    "publicKey": [
      {
        "id": "did:d0fa66af-c118-410d-bb5e-049003e16077/keys/1",
        "type": "CryptographicKey",
        "owner": "did:d0fa66af-c118-410d-bb5e-049003e16077",
        "publicKeyPem": "-----BEGIN PUBLIC KEY-----\n" +
          "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA35Ojg+WdqkWvYyiZ4s+y\n" +
          "XIuJUIf+h461q4DR2oY+bF33HAeTX79Zvs55QVwq3A+KewmdAbl3F9g6jWRxVDB+\n" +
          "XxX1YxqHz9R7rDup2fVVQo+yDpxguL3r/7BUeezKfOZYCzBYM+i37adY42Hx7TM5\n" +
          "O9nbovSA7jKHvPbjul8yx3sjQvWd48/H+vCRszrwCoKShrf5YK3O+eKQKBcWre8R\n" +
          "kQoIisA5fOmOyy12ZvN+XqhDjHt3HwoOqV1Okq/gVqosKWR293ufSbZAcE4etK1Y\n" +
          "qQt2FvDsKQjOHMa+equ1IX9ZCoKKMTH5e/LmVnPZYZ563eEn29NBeUbV4fVrXpYa\n" +
          "vwIDAQAB\n" +
          "-----END PUBLIC KEY-----\n"
      }
    ],
    "signature": {
      "type": "LinkedDataSignature2015",
      "created": "2016-03-25T14:27:42Z",
      "creator": "did:1deb8074-8f4c-4a92-bc0f-de45e4b5bf58/keys/1",
      "signatureValue": "AA5YSshFnzlKxFgj4FhZAS7vPAOG5IyPBEkVjdfsCpoKRAjlN/Qy2+noM+i7nQIBOSQ2FFmFHAce3GCTLnBMgMnkTRKgT6ABHX3WKv9k59FAkXrrKHR/B/T73XTkT5Xe2Jkigp/RMmQvhb7BaGDPI8CY8QIjkM2RFIPsdoxIWSKtljk/nPcfg20Fis/6K6JVmWvRGUmt4KvGEjiVtNreGb6bppkrt8fLh8HXWuhAozTw6kTv27n/Z2DfeiP9zp556gQJ9zGmD4YaJHcWkOWW0lXAZ6iKKc6LWVKcUEubVG3sjK2yag/Ft5qt8DYbelCkV0oM7sNyqUIBym0+Zd0+uw=="
    },
    "url": "https://example.com"
  },
  'did:814de1ca-f593-4124-b99e-9c4a4e5aadf3': {
    "@context": "https://w3id.org/identity/v1",
    "id": "did:814de1ca-f593-4124-b99e-9c4a4e5aadf3",
    "idp": "did:5dda1ebc-c144-4789-af15-8a13a7d30599",
    "accessControl": {
      "writePermission": [
        {
          "id": "did:814de1ca-f593-4124-b99e-9c4a4e5aadf3/keys/1",
          "type": "CryptographicKey"
        },
        {
          "id": "did:5dda1ebc-c144-4789-af15-8a13a7d30599",
          "type": "Identity"
        }
      ]
    },
    "publicKey": [
      {
        "id": "did:814de1ca-f593-4124-b99e-9c4a4e5aadf3/keys/1",
        "type": "CryptographicKey",
        "owner": "did:814de1ca-f593-4124-b99e-9c4a4e5aadf3",
        "publicKeyPem": "-----BEGIN PUBLIC KEY-----\n" +
          "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA35Ojg+WdqkWvYyiZ4s+y\n" +
          "XIuJUIf+h461q4DR2oY+bF33HAeTX79Zvs55QVwq3A+KewmdAbl3F9g6jWRxVDB+\n" +
          "XxX1YxqHz9R7rDup2fVVQo+yDpxguL3r/7BUeezKfOZYCzBYM+i37adY42Hx7TM5\n" +
          "O9nbovSA7jKHvPbjul8yx3sjQvWd48/H+vCRszrwCoKShrf5YK3O+eKQKBcWre8R\n" +
          "kQoIisA5fOmOyy12ZvN+XqhDjHt3HwoOqV1Okq/gVqosKWR293ufSbZAcE4etK1Y\n" +
          "qQt2FvDsKQjOHMa+equ1IX9ZCoKKMTH5e/LmVnPZYZ563eEn29NBeUbV4fVrXpYa\n" +
          "vwIDAQAB\n" +
          "-----END PUBLIC KEY-----\n"
      }
    ],
    "signature": {
      "type": "LinkedDataSignature2015",
      "created": "2016-03-25T14:27:42Z",
      "creator": "did:5dda1ebc-c144-4789-af15-8a13a7d30599/keys/1",
      "signatureValue": "AA5YSshFnzlKxFgj4FhZAS7vPAOG5IyPBEkVjdfsCpoKRAjlN/Qy2+noM+i7nQIBOSQ2FFmFHAce3GCTLnBMgMnkTRKgT6ABHX3WKv9k59FAkXrrKHR/B/T73XTkT5Xe2Jkigp/RMmQvhb7BaGDPI8CY8QIjkM2RFIPsdoxIWSKtljk/nPcfg20Fis/6K6JVmWvRGUmt4KvGEjiVtNreGb6bppkrt8fLh8HXWuhAozTw6kTv27n/Z2DfeiP9zp556gQJ9zGmD4YaJHcWkOWW0lXAZ6iKKc6LWVKcUEubVG3sjK2yag/Ft5qt8DYbelCkV0oM7sNyqUIBym0+Zd0+uw=="
    },
    "url": "https://example.com"
  },
  'did:29b27c7d-4aab-4c05-a99c-18344ab5bde3': {
    "@context": "https://w3id.org/identity/v1",
    "id": "did:29b27c7d-4aab-4c05-a99c-18344ab5bde3",
    "idp": "did:5dda1ebc-c144-4789-af15-8a13a7d30599",
    "accessControl": {
      "writePermission": [
        {
          "id": "did:29b27c7d-4aab-4c05-a99c-18344ab5bde3/keys/1",
          "type": "CryptographicKey"
        },
        {
          "id": "did:5dda1ebc-c144-4789-af15-8a13a7d30599",
          "type": "Identity"
        }
      ]
    },
    "publicKey": [
      {
        "id": "did:29b27c7d-4aab-4c05-a99c-18344ab5bde3/keys/1",
        "type": "CryptographicKey",
        "owner": "did:29b27c7d-4aab-4c05-a99c-18344ab5bde3",
        "publicKeyPem": "-----BEGIN PUBLIC KEY-----\n" +
          "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA35Ojg+WdqkWvYyiZ4s+y\n" +
          "XIuJUIf+h461q4DR2oY+bF33HAeTX79Zvs55QVwq3A+KewmdAbl3F9g6jWRxVDB+\n" +
          "XxX1YxqHz9R7rDup2fVVQo+yDpxguL3r/7BUeezKfOZYCzBYM+i37adY42Hx7TM5\n" +
          "O9nbovSA7jKHvPbjul8yx3sjQvWd48/H+vCRszrwCoKShrf5YK3O+eKQKBcWre8R\n" +
          "kQoIisA5fOmOyy12ZvN+XqhDjHt3HwoOqV1Okq/gVqosKWR293ufSbZAcE4etK1Y\n" +
          "qQt2FvDsKQjOHMa+equ1IX9ZCoKKMTH5e/LmVnPZYZ563eEn29NBeUbV4fVrXpYa\n" +
          "vwIDAQAB\n" +
          "-----END PUBLIC KEY-----\n"
      }
    ],
    "signature": {
      "type": "LinkedDataSignature2015",
      "created": "2016-03-25T14:27:42Z",
      "creator": "did:5dda1ebc-c144-4789-af15-8a13a7d30599/keys/1",
      "signatureValue": "AA5YSshFnzlKxFgj4FhZAS7vPAOG5IyPBEkVjdfsCpoKRAjlN/Qy2+noM+i7nQIBOSQ2FFmFHAce3GCTLnBMgMnkTRKgT6ABHX3WKv9k59FAkXrrKHR/B/T73XTkT5Xe2Jkigp/RMmQvhb7BaGDPI8CY8QIjkM2RFIPsdoxIWSKtljk/nPcfg20Fis/6K6JVmWvRGUmt4KvGEjiVtNreGb6bppkrt8fLh8HXWuhAozTw6kTv27n/Z2DfeiP9zp556gQJ9zGmD4YaJHcWkOWW0lXAZ6iKKc6LWVKcUEubVG3sjK2yag/Ft5qt8DYbelCkV0oM7sNyqUIBym0+Zd0+uw=="
    },
    "url": "https://example.com"
  },
  'did:41d08c5f-e994-498a-9607-a9de7168e9e9': {
    "@context": "https://w3id.org/identity/v1",
    "id": "did:41d08c5f-e994-498a-9607-a9de7168e9e9",
    "idp": "did:5dda1ebc-c144-4789-af15-8a13a7d30599",
    "accessControl": {
      "writePermission": [
        {
          "id": "did:41d08c5f-e994-498a-9607-a9de7168e9e9/keys/1",
          "type": "CryptographicKey"
        },
        {
          "id": "did:5dda1ebc-c144-4789-af15-8a13a7d30599",
          "type": "Identity"
        }
      ]
    },
    "publicKey": [
      {
        "id": "did:41d08c5f-e994-498a-9607-a9de7168e9e9/keys/1",
        "type": "CryptographicKey",
        "owner": "did:41d08c5f-e994-498a-9607-a9de7168e9e9",
        "publicKeyPem": "-----BEGIN PUBLIC KEY-----\n" +
          "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA35Ojg+WdqkWvYyiZ4s+y\n" +
          "XIuJUIf+h461q4DR2oY+bF33HAeTX79Zvs55QVwq3A+KewmdAbl3F9g6jWRxVDB+\n" +
          "XxX1YxqHz9R7rDup2fVVQo+yDpxguL3r/7BUeezKfOZYCzBYM+i37adY42Hx7TM5\n" +
          "O9nbovSA7jKHvPbjul8yx3sjQvWd48/H+vCRszrwCoKShrf5YK3O+eKQKBcWre8R\n" +
          "kQoIisA5fOmOyy12ZvN+XqhDjHt3HwoOqV1Okq/gVqosKWR293ufSbZAcE4etK1Y\n" +
          "qQt2FvDsKQjOHMa+equ1IX9ZCoKKMTH5e/LmVnPZYZ563eEn29NBeUbV4fVrXpYa\n" +
          "vwIDAQAB\n" +
          "-----END PUBLIC KEY-----\n"
      }
    ],
    "signature": {
      "type": "LinkedDataSignature2015",
      "created": "2016-03-25T14:27:42Z",
      "creator": "did:5dda1ebc-c144-4789-af15-8a13a7d30599/keys/1",
      "signatureValue": "AA5YSshFnzlKxFgj4FhZAS7vPAOG5IyPBEkVjdfsCpoKRAjlN/Qy2+noM+i7nQIBOSQ2FFmFHAce3GCTLnBMgMnkTRKgT6ABHX3WKv9k59FAkXrrKHR/B/T73XTkT5Xe2Jkigp/RMmQvhb7BaGDPI8CY8QIjkM2RFIPsdoxIWSKtljk/nPcfg20Fis/6K6JVmWvRGUmt4KvGEjiVtNreGb6bppkrt8fLh8HXWuhAozTw6kTv27n/Z2DfeiP9zp556gQJ9zGmD4YaJHcWkOWW0lXAZ6iKKc6LWVKcUEubVG3sjK2yag/Ft5qt8DYbelCkV0oM7sNyqUIBym0+Zd0+uw=="
    },
    "url": "https://example.com"
  },
  // DDO for mock IdP
  'did:1deb8074-8f4c-4a92-bc0f-de45e4b5bf58': {
    "@context": "https://w3id.org/identity/v1",
    "id": "did:1deb8074-8f4c-4a92-bc0f-de45e4b5bf58",
    "idp": "did:1deb8074-8f4c-4a92-bc0f-de45e4b5bf58",
    "accessControl": {
      "writePermission": [
        {
          "id": "did:1deb8074-8f4c-4a92-bc0f-de45e4b5bf58/keys/1",
          "type": "CryptographicKey"
        }
      ]
    },
    "publicKey": [
      {
        "id": "did:1deb8074-8f4c-4a92-bc0f-de45e4b5bf58/keys/1",
        "type": "CryptographicKey",
        "owner": "did:1deb8074-8f4c-4a92-bc0f-de45e4b5bf58",
        "publicKeyPem": "-----BEGIN PUBLIC KEY-----\n" +
          "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4UdtEFXEWonMj04Rca37\n" +
          "IvGFJIgPakvjK9VNrLog1YkBMQo+kqo1WWJndFoB1mEROtID+LLYCfshHwvR/n5R\n" +
          "StNqPV2/DMMnZb0s3kJ88wyjnDOdCA6eYO7ugjZKBvFfjxbDDFARaBJN7pBECDMw\n" +
          "cvXLsZAs+/bTOOR+/ebXHfuY9uqx0XyyEmLq+mTEJm6MaZKCNmoj0l6IatmGeePm\n" +
          "ZXqd+dAXJew7RNI8wyEiD8VI186a3asOMnV/IvU8PAZImaLPqt/jN9HI7SflrPEI\n" +
          "LWQCUN0Td0qRV09JRMo60CR/c1b3Mwae9A7WQpWRbaEMCbsGtoCLz03dEVIkSgh+\n" +
          "TQIDAQAB\n" +
          "-----END PUBLIC KEY-----\n"
      }
    ],
    "signature": {
      "type": "LinkedDataSignature2015",
      "created": "2016-03-25T14:27:42Z",
      "creator": "did:1deb8074-8f4c-4a92-bc0f-de45e4b5bf58/keys/1",
      "signatureValue": "AA5YSshFnzlKxFgj4FhZAS7vPAOG5IyPBEkVjdfsCpoKRAjlN/Qy2+noM+i7nQIBOSQ2FFmFHAce3GCTLnBMgMnkTRKgT6ABHX3WKv9k59FAkXrrKHR/B/T73XTkT5Xe2Jkigp/RMmQvhb7BaGDPI8CY8QIjkM2RFIPsdoxIWSKtljk/nPcfg20Fis/6K6JVmWvRGUmt4KvGEjiVtNreGb6bppkrt8fLh8HXWuhAozTw6kTv27n/Z2DfeiP9zp556gQJ9zGmD4YaJHcWkOWW0lXAZ6iKKc6LWVKcUEubVG3sjK2yag/Ft5qt8DYbelCkV0oM7sNyqUIBym0+Zd0+uw=="
    },
    "url": "https://idp-alpha.example.com"
  },
  'did:5dda1ebc-c144-4789-af15-8a13a7d30599': {
    "@context": "https://w3id.org/identity/v1",
    "id": "did:5dda1ebc-c144-4789-af15-8a13a7d30599",
    "idp": "did:5dda1ebc-c144-4789-af15-8a13a7d30599",
    "accessControl": {
      "writePermission": [
        {
          "id": "did:5dda1ebc-c144-4789-af15-8a13a7d30599/keys/1",
          "type": "CryptographicKey"
        }
      ]
    },
    "publicKey": [
      {
        "id": "did:5dda1ebc-c144-4789-af15-8a13a7d30599/keys/1",
        "type": "CryptographicKey",
        "owner": "did:5dda1ebc-c144-4789-af15-8a13a7d30599",
        "publicKeyPem": "-----BEGIN PUBLIC KEY-----\n" +
          "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4UdtEFXEWonMj04Rca37\n" +
          "IvGFJIgPakvjK9VNrLog1YkBMQo+kqo1WWJndFoB1mEROtID+LLYCfshHwvR/n5R\n" +
          "StNqPV2/DMMnZb0s3kJ88wyjnDOdCA6eYO7ugjZKBvFfjxbDDFARaBJN7pBECDMw\n" +
          "cvXLsZAs+/bTOOR+/ebXHfuY9uqx0XyyEmLq+mTEJm6MaZKCNmoj0l6IatmGeePm\n" +
          "ZXqd+dAXJew7RNI8wyEiD8VI186a3asOMnV/IvU8PAZImaLPqt/jN9HI7SflrPEI\n" +
          "LWQCUN0Td0qRV09JRMo60CR/c1b3Mwae9A7WQpWRbaEMCbsGtoCLz03dEVIkSgh+\n" +
          "TQIDAQAB\n" +
          "-----END PUBLIC KEY-----\n"
      }
    ],
    "signature": {
      "type": "LinkedDataSignature2015",
      "created": "2016-03-25T14:27:42Z",
      "creator": "did:5dda1ebc-c144-4789-af15-8a13a7d30599/keys/1",
      "signatureValue": "AA5YSshFnzlKxFgj4FhZAS7vPAOG5IyPBEkVjdfsCpoKRAjlN/Qy2+noM+i7nQIBOSQ2FFmFHAce3GCTLnBMgMnkTRKgT6ABHX3WKv9k59FAkXrrKHR/B/T73XTkT5Xe2Jkigp/RMmQvhb7BaGDPI8CY8QIjkM2RFIPsdoxIWSKtljk/nPcfg20Fis/6K6JVmWvRGUmt4KvGEjiVtNreGb6bppkrt8fLh8HXWuhAozTw6kTv27n/Z2DfeiP9zp556gQJ9zGmD4YaJHcWkOWW0lXAZ6iKKc6LWVKcUEubVG3sjK2yag/Ft5qt8DYbelCkV0oM7sNyqUIBym0+Zd0+uw=="
    },
    "url": "https://idp-beta.example.com"
  }
};

/*
const bedrock = require('bedrock');
const jsonld = bedrock.jsonld;
const oldLoader = jsonld.documentLoader;
jsonld.documentLoader = function(url, callback) {
  if(Object.keys(mock.ldDocuments).includes(url)) {
    return callback(null, {
      contextUrl: null,
      document: mock.ldDocuments[url],
      documentUrl: url
    });
  }
  const regex = new RegExp(
    config['did-client']['authorization-io'].didBaseUrl + '/(.*?)$');
  const didMatch = url.match(regex);
  if(didMatch && didMatch.length === 2 && didMatch[1] in mock.didDocuments) {
    return callback(null, {
      contextUrl: null,
      document: mock.didDocuments[didMatch[1]],
      documentUrl: url
    });
  }
  oldLoader(url, callback);
};
*/

const events = mock.events = {};

events.equihashConfig = {
  '@context': 'https://w3id.org/webledger/v1',
  type: 'WebLedgerConfigurationEvent',
  operation: 'Config',
  input: [{
    type: 'WebLedgerConfiguration',
    ledger: 'did:v1:eb8c22dc-bde6-4315-92e2-59bd3f3c7d59',
    consensusMethod: 'UnilateralConsensus2017',
    eventValidator: [{
      type: 'SignatureValidator2017',
      eventFilter: [{
        type: 'EventTypeFilter',
        eventType: ['WebLedgerConfigurationEvent']
      }],
      approvedSigner: [
        identities.regularUser.identity.id
      ],
      minimumSignaturesRequired: 1
    }, {
      type: 'EquihashValidator2017',
      eventFilter: [{
        type: 'EventTypeFilter',
        eventType: ['WebLedgerEvent']
      }],
      equihashParameterN: 64,
      equihashParameterK: 3
    }],
    requireEventValidation: true
  }]
};

events.concert = {
  '@context': 'https://w3id.org/webledger/v1',
  type: 'WebLedgerEvent',
  operation: 'Create',
  input: [{
    '@context': 'https://w3id.org/test/v1',
    id: 'https://example.com/events/123456',
    type: 'Concert',
    name: 'Big Band Concert in New York City',
    startDate: '2017-07-14T21:30',
    location: 'https://example.org/the-venue',
    offers: {
      type: 'Offer',
      price: '13.00',
      priceCurrency: 'USD',
      url: 'https://www.ticketfly.com/purchase/309433'
    }
  }]
};
