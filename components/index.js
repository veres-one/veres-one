/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
/* global window */
'use strict';

import * as brVue from 'bedrock-vue';
import Vue from 'vue';
//import VueRouter from 'vue-router';

// install all plugins
Vue.use(brVue);

brVue.setRootVue(async () => {
  window.location = 'https://veres.one';
  return null;

/*
  // FIXME: determine if this IE11 support code must be loaded serially
  const brQuasar = await import('bedrock-quasar');
  await brQuasar.supportIE11();

  // load dynamic imports in parallel
  const [
    Quasar,
    {default: iconSet}
  ] = await Promise.all([
    import('quasar-framework'),
    import('quasar-framework/icons/fontawesome')
  ]);

  // replace default `br-root` with a custom one
  Vue.component('br-root', () => import('./BrRoot.vue'));

  const router = new VueRouter({
    mode: 'history',
    routes: [{
      path: '/',
      component: () => import('./Home.vue'),
      meta: {
        title: 'Veres One'
      }
    }]
  });

  Quasar.icons.set(iconSet);
  brQuasar.theme({
    Quasar,
    brand: {}
  });

  const BrApp = Vue.component('br-app');
  return new BrApp({
    router
  });*/
});
