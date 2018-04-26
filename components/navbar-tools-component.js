/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */

export default {
  controller: Ctrl,
  templateUrl: 'veres-one/navbar-tools-component.html'
};

/* @ngInject */
function Ctrl(
  $location, $scope, brAlertService, brAuthnService, brNavbarService,
  brPasswordService, brRefreshService, brSessionService, config) {
  var self = this;
  self.display = {
    hovercard: false
  };
  self.loggedIn = false;
  self.session = null;
  self.identity = null;
  self.identityBaseUrl = null;
  self.authentication = {
    displayOrder: brAuthnService.displayOrder,
    methods: brAuthnService.methods
  };

  self.showModal = {
    resetPassword: false
  };

  $scope.$watch(function() {
    return brSessionService.session;
  }, function(newValue) {
    if(newValue) {
      init();
    }
  }, true);

  self.collapseNavbar = function() {
    brNavbarService.collapse();
  };

  self.broadcast = function(e) {
    $scope.$broadcast(e);
  };

  self.join = function() {
    $location.url('/join');
  };

  self.login = function(method) {
    $location.url('/signin/' + method);
  };

  self.onLogin = function(identity) {
    // NOTE: the identity object returned here may vary according to
    // authentication method
    brSessionService.get()
      .then(function(session) {
        $location.url(
          // FIXME
          //config.data.idp.identityBasePath + '/' +
          //encodeURIComponent(session.identity.sysSlug) + '/dashboard');
          config.data['identity-http'].baseUri + '/' +
          self.session.identity.sysSlug);
        $scope.$apply();
      });
  };

  /*
  self.onNotRegistered = function() {
    $location.url('/send-token');
  };
  */

  self.onRefresh = function() {
    brRefreshService.refresh();
  };

  self.logout = function() {
    var err_ = null;
    brSessionService.logout().catch(function(err) {
      err_ = err;
    }).then(function() {
      if(err_) {
        brAlertService.add('error', err_, {scope: $scope});
        $scope.$apply();
        return;
      }
      $location.url('/');
      $scope.$apply();
    });
  };

  self.sendPasscode = function(options) {
    brPasswordService.sendPasscode({sysIdentifier: options.sysIdentifier});
  };

  function init() {
    if(!brSessionService.session.identity) {
      self.loggedIn = false;
      return;
    }
    self.loggedIn = true;
    self.session = brSessionService.session;
    self.identityBaseUrl =
      config.data['identity-http'].baseUri + '/' +
      self.session.identity.sysSlug;
    self.identity = self.session.identity;
  }
}
