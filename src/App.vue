<template>
  <v-app>
    <v-app-bar app flat dense>
      <v-icon class="ma-2 hidden-xs-only">mdi-graph</v-icon>
      <h1 class="text-no-wrap text-h6">
        Variant <span class="font-italic font-weight-medium">Art</span>
      </h1>
      <v-tabs align-with-title>
        <v-tab to="/">Concept</v-tab>
        <v-tab to="/create">Create</v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
      <v-btn
        fab
        text
        href="https://github.com/johnbradley/variant-art"
        class="hidden-xs-only"
        target="_blank"
      >
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
.router-link-active {
  color: blue;
}
</style>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
