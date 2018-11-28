<template>
  <q-layout>

    <q-layout-header>
      <q-toolbar>
        <q-toolbar-title @click.native="goHome()">
          Veres One
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-page-container style="overflow: auto">
      <router-view/>
    </q-page-container>

    <q-layout-footer>
    </q-layout-footer>

  </q-layout>
</template>
<script>
export default {
  name: 'BrRoot',
  methods: {
    goHome() {
      this.$router.push({path: '/'});
    }
  }
};
</script>
<style>
</style>
