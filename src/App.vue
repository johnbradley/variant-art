<template>
  <v-app>
    <v-app-bar app>
      <v-icon class="ma-2">mdi-graph</v-icon>
      <h3>Variant Art</h3>
      <v-spacer></v-spacer>
      <router-link to="/">
        <v-btn small text> Concept </v-btn>
      </router-link>
      <router-link to="/Create">
        <v-btn small text> Create </v-btn>
      </router-link>
      <v-btn
        small
        href="https://github.com/johnbradley/variant-art"
        target="_blank"
        text
      >
        Code
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
