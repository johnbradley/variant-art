<template>
  <v-app>
    <v-app-bar app>
      <v-icon class="ma-2">mdi-graph</v-icon>
      <h2 class="text-no-wrap">
        Variant <span class="font-italic font-weight-medium">Art</span>
      </h2>
      <v-spacer></v-spacer>
      <v-btn
        fab
        text
        href="https://github.com/johnbradley/variant-art"
        target="_blank"
      >
        <v-icon>mdi-github</v-icon>
      </v-btn>
      <template v-slot:extension>
        <v-tabs align-with-title>
          <v-tab to="/">Concept</v-tab>
          <v-tab to="/create">Create</v-tab>
        </v-tabs>
      </template>
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
