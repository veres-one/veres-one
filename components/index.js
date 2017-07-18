/*!
 * Veres One components module.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import * as bedrock from 'bedrock-angular';

var module = angular.module('veres-one.main', [
  'bedrock.header', 'bedrock.footer', 'ngError', 'ngMaterial'
]);

bedrock.setRootModule(module);

/* @ngInject */
module.config(function($mdThemingProvider, $routeProvider) {
  $routeProvider
    .when('/', {
      title: 'Home',
      templateUrl: 'veres-one/index.html'
    });

  // themes that can be used with cards (e.g. for info alerts)
  $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
  $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
  $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
});
