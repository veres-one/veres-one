/*!
 * Veres One components module.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import * as bedrock from 'bedrock-angular';
import DashboardComponent from './dashboard-component.js';
import JoinComponent from './join-component.js';
import LoginComponent from './login-component.js';
import NavbarToolsComponent from './navbar-tools-component.js';

const module = angular.module('veres-one.main', [
  'bedrock.agreement',
  'bedrock.authn',
  'bedrock.authn-password',
  'bedrock.footer',
  'bedrock.header',
  'bedrock.jsonld',
  'bedrock.navbar',
  'bedrock.session',
  'ngError',
  'ngMaterial'
]);

bedrock.setRootModule(module);

module.component('v1Dashboard', DashboardComponent);
module.component('v1Join', JoinComponent);
module.component('v1Login', LoginComponent);
module.component('v1NavbarTools', NavbarToolsComponent);

/* @ngInject */
module.config(function($mdThemingProvider, $routeProvider) {
  $routeProvider
    .when('/', {
      title: 'Home',
      templateUrl: 'veres-one/index.html',
      session: 'optional',
      resolve: {
        redirect: function($location, $route, config) {
          if('identity' in $route.current.locals.session) {
            const i = $route.current.locals.session.identity;
            /* FIXME
            $location.url(
              config.data.idp.identityBasePath + '/' +
              encodeURIComponent(i.sysSlug) + '/credentials');
            */
            $location.url('/dashboard');
          }
        }
      }
    })
    .when('/join', {
      vars: {
        title: 'Join',
        navbar: {display: ['brand']}
      },
      template: '<v1-join v1-email="$resolve.vars.email"></v1-join>',
      resolve: {
        vars: function($route) {
          const email = $route.current.params.email ?
            decodeURIComponent($route.current.params.email) : '';
          return {email};
        }
      }
    })
    .when('/dashboard', {
      title: 'Dashboard',
      session: {require: 'identity'},
      template: '<v1-dashboard br-identity="$resolve.session.identity">' +
        '</v1-dashboard>'
    });

  // themes that can be used with cards (e.g. for info alerts)
  $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
  $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
  $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
});

/* @ngInject */
module.run(function(
  config, brAgreementService, brNavbarService) {

  // register the template for the navbar
  brNavbarService.registerTemplate('veres-one/navbar-tools-template.html');

  const overrides = config.data.angular.templates.overrides;
  // TODO: update bedrock-angular-agreement HTML to remove grid classes
  // (it should contain only the component parts)
  overrides['bedrock-angular-agreement/agreement-component.html'] =
    'veres-one/overrides/agreement-component.html';

  brNavbarService.displayOrder = [
    'brDashboard'
  ];

  brAgreementService.registerGroup('veres-one.join');
  brAgreementService.groups['veres-one.join'].displayOrder = ['veresTos'];
  brAgreementService.register(
    'veres-one.join', 'veresTos', {
      title: 'Terms of Service & Privacy Policy',
      templateUrl: 'veres-one/terms-of-service.html'
    });
});
