<template>
  <v-app>
    <v-app-bar
      app
    >
      <v-icon class="ma-2">mdi-graph</v-icon>
      <h3>Variant Call Art</h3>

      <v-spacer></v-spacer>
      <router-link to="/">
        <v-btn text>
          Home
        </v-btn>
      </router-link>
      <router-link to="/about">
        <v-btn text>
            About
        </v-btn>
      </router-link>
      <v-btn
        href="https://github.com/johnbradley"
        target="_blank"
        text
      > Source
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
