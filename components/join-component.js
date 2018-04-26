/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
/* globals navigator, CredentialManager */
'use strict';

import forge from 'node-forge';
import jsonld from 'jsonld';
import uuid from 'uuid/v4';
import Didio from 'did-io';
import Jsigs from 'jsonld-signatures';
import Chance from 'chance';

// FIXME: this is a temporary patch because did-io is expecting v4 function
uuid.v4 = () => uuid();

export default {
  bindings: {
    email: '<v1Email'
  },
  controller: Ctrl,
  templateUrl: 'veres-one/join-component.html'
};

/* @ngInject */
function Ctrl(
  $http, $location, $q, $scope, $window, $routeParams,
  brAgreementService, brAlertService, /*brDidJwtService, brLdnService,*/
  brRefreshService, brSessionService, config) {
  const self = this;
  self.data = config.data;
  self.display = {
    confirmation: false
  };
  self.loading = false;
  // FIXME: determine how to address password

  self.identity = {
    '@context': config.data.contextUrls.identity,
    id: '',
    type: 'Identity',
    label: '',
    email: '',
    sysPassword: random32(),
    sysPublic: [],
    sysSlug: ''
  };
  self.agreementAccepted = false;
  self.showEmailConfirmation = false;
  // Setting ?referral=true will trigger a prompt to for the user
  // to go back to the page that linked here once they are done.
  var shouldRedirect = ($routeParams.referral === 'true');
  var shouldRedirectAuto = ($routeParams.auto === 'true');

  self.$onInit = function() {
    self.identity.email = self.email;
    if(!self.identity.email) {
      self.showEmailConfirmation = true;
    }
  };

  self.onContinue = function() {
    var parser = document.createElement('a');
    parser.href = document.referrer;
    /* FIXME
    brDidJwtService.getToken({aud: parser.origin}).then(function(token) {
      $window.location = document.referrer + '?token=' + token;
    });
    */
  };

  self.submit = function() {
    self.loading = true;
    $http.post('/join', self.identity).then(function() {
      return brAgreementService
        .accept(brAgreementService.getAgreements('bedrock-idp.join'))
        .catch(function() {
          // ignore error, agreements can be accepted later
        });
    }).then(function() {
      return brSessionService.get();
    }).then(function(session) {
      brRefreshService.refresh();

      if(shouldRedirect && shouldRedirectAuto) {
        // do early automatic redirection (required for IE11 because
        // $location.url() below will reset document.referrer)
        $window.location = document.referrer + '&wallet=true';
        return;
      }

      $location.url(config.data.idp.identityBasePath + '/' +
        session.identity.sysSlug + '/dashboard');
    }).catch(function(err) {
      brAlertService.add('error', err)
        .then(function() {
          $scope.$apply();
          self.loading = false;
        });
    });
  };

  function setSlug() {
    var sysSlug = random32();
    return $http.post('/identifier/identity', {sysSlug: sysSlug})
      .then(function() {
        self.identity.label = sysSlug;
        self.identity.sysSlug = sysSlug;
      }).catch(function() {
        // failed uniqueness check, try again
        return setSlug();
      });
  }

  function random32() {
    var chance = new Chance();
    var firstCharPool = "abcdefghijklmnopqrstuvwxyz";
    var pool = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return chance.character({pool: firstCharPool}) +
      chance.string({length: 31, pool: pool});
  }
}
// TODO: move to did-io (update did-io implementation to support client side)
async function _registerDid(
  {$http, didUrl, pkStore, repository, name, progress}) {
  // initialize libs using helper libraries
  const jsigs = Jsigs();
  jsigs.use('forge', forge);
  jsigs.use('jsonld', jsonld);
  const didio = Didio();
  didio.use('forge', forge);
  didio.use('jsonld', jsonld);
  didio.use('uuid', uuid);

  const profile = await pkStore.create({repository, label: name});

  // create signed DDO
  const did = profile.id;
  const ddo = {
    '@context': 'https://w3id.org/identity/v1',
    id: did,
    idp: repository,
    accessControl: {
      writePermission: [{
        id: profile.publicKey.id,
        type: profile.publicKey.type
      }, {
        id: repository,
        type: 'Identity'
      }]
    },
    publicKey: [{
      id: profile.publicKey.id,
      type: profile.publicKey.type,
      owner: did,
      publicKeyPem: profile.publicKey.publicKeyPem
    }]
  };
  const signed = await pkStore.sign({
    doc: ddo,
    publicKeyId: profile.publicKey.id,
    privateKeyPem: profile.publicKey.privateKeyPem
  });

  // use proof of patience to register
  const proof = await _establishProofOfPatience(
    {$http, didUrl, ddo: signed, progress});
  const response = await $http.post(didUrl, signed, {
    headers: {
      authorization: proof
    }
  });

  if(response.status !== 201) {
    throw response;
  }

  await pkStore.set(profile);

  return {
    profile: profile,
    ddo: ddo
  };
}

/**
 * Establishes a proof of patience for writing a DDO.
 *
 * @param options the options to use:
 *          $http AngularJS $http service.
 *          didUrl URL for creating DIDs.
 *          ddo the DDO.
 *          progress({secondsLeft}) optional progress callback to call with the
 *            number of seconds remaining.
 *
 * @return a Promise that resolves to the proof to use to authorize.
 */
async function _establishProofOfPatience({$http, didUrl, ddo, progress}) {
  try {
    const response = await $http.post(didUrl, ddo, {
      transformResponse: (data, headers, status) => ({
        status: status,
        headers: {
          'retry-after': parseInt(headers('retry-after'), 10),
          'www-authenticate': headers('www-authenticate')
        },
        data: data
      })
    });
    // expecting a 401 HTTP error code, so a success of any kind is bad
    throw response;
  } catch(e) {
    // expect 401 unauthorized and a proof-of-patience challenge
    if(e.status !== 401) {
      throw e;
    }

    // wait for as long as the proof of patience requires
    const secondsLeft = e.headers['retry-after'];
    const proof = e.headers['www-authenticate'];
    if(progress) {
      progress({secondsLeft});
    }
    const waitTime = secondsLeft * 1000;
    return new Promise(resolve => {
      setTimeout(() => resolve(proof), waitTime);
    });
  }
}
