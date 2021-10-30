<template>
  <v-app>
    <v-app-bar
      app
    >
      <v-icon class="ma-2">mdi-graph</v-icon>
      <h3>Variant Call Art</h3>

      <v-spacer></v-spacer>
      <v-btn text>
          <router-link to="/">Home</router-link>
      </v-btn>      
      <v-btn text>
          <router-link to="/about">About</router-link>
      </v-btn>
      
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
