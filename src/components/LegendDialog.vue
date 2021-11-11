<template>
  <v-dialog v-model="show" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn small class="float-right" v-bind="attrs" v-on="on"> Legend </v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5 grey lighten-2"> Legend </v-card-title>

      <v-card-text>
        <Legend></Legend>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-end">
        <v-spacer></v-spacer>
        <v-btn text @click="show = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Legend from "../components/Legend";
export default {
  components: {
    Legend,
  },
  data() {
    return {
      show: false,
    };
  },
};
</script>