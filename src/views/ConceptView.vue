<template>
  <v-container>
    <div class="mx-auto" fluid>
      <h3>Visualizing Variants</h3>
      <v-row>
        <v-col>
          <p class="text-body-2">
            Visualizing an entire genome can be challenging due to the length of
            the genome. However genetic variants can be visualized as a
            difference from a reference genome. This website will let you create
            a visualization for one or more variants.
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="grey lighten-4 black--text rounded elevation-5">
            <h4 class="text-center">VCF File</h4>
            <pre class="pa-2">
#CHROM POS ID REF ALT ...
chr1   2370 . G   A   ...
chr1   2371 . T   A   ...
      </pre
            >
          </div>
          <div class="text-center">
            <v-icon class="pt-1" color="black">mdi-arrow-down-thick</v-icon>
          </div>
          <img
            src="@/assets/example.png"
            width="100%"
            class="elevation-5 d-block rounded"
          />
        </v-col>
        <v-col>
          <p class="text-body-2">
            A VCF (Variant Call Format) file is converted into a subway map
            style visualization. Each white block represents part of the
            reference genome that matches the variant. Each block along the
            center represents a nucleotide from the reference genome. Each
            diagnal box represents the alternative nucleotide(s) of the variant.
          </p>
          <h4 class="text-center">Legend</h4>
          <Legend />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <router-link to="/create">
            <v-btn color="primary"> Create Visualization </v-btn>
          </router-link>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import Legend from "../components/Legend.vue";
export default {
  name: "Concept",
  components: {
    Legend,
  },
  data() {
    return {
      exampleVCs: [
        {
          key: "1",
          CHROM: "chr1",
          POS: 2370,
          REF: "G",
          ALT: "A",
        },
        {
          key: "2",
          CHROM: "chr1",
          POS: 4321,
          REF: "T",
          ALT: "A",
        },
      ],
    };
  },
};
</script>