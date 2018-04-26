/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */

export default {
  bindings: {
    method: '<brMethod'
  },
  controller: Ctrl,
  templateUrl: 'veres-one/login-component.html'
};

/* @ngInject */
function Ctrl($location, $scope, brAuthnService, brSessionService, config) {
  var self = this;
  self.authentication = {
    displayOrder: [],
    methods: {}
  };

  self.$onInit = function() {
    self.authentication.displayOrder.push(self.method);
    self.authentication.methods[self.method] =
      brAuthnService.methods[self.method];
  };

  self.onLogin = function(identity) {
    // NOTE: the identity object returned here may vary according to
    // authentication method
    brSessionService.get()
      .then(function(session) {
        // FIXME
        /*
        $location.url(
          config.data.idp.identityBasePath + '/' +
          encodeURIComponent(session.identity.sysSlug) + '/credentials');
        */
        $location.url('/dashboard');
        $scope.$apply();
      });
  };
}
