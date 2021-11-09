<template>
<v-container>

    <v-card
    class="mx-auto"
    max-width="800"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="text-h5 mb-1">
          Visualizing Variants
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      <p>
      Visualizing an entire genome can be challenging due to the length of the genome.
      However genetic variants can be visualized as a difference from a reference genome.
      This website will let you create a visualization for one or more variants.
      </p>
      <div>
      <pre class="grey lighten-4 black--text pa-2 rounded elevation-5 d-inline-block"
       style="vertical-align: top"
      >
#CHROM POS ID REF ALT ...
chr1   2370 . G   A ...
chr1   4321 . T   A ...
      </pre>
      <v-icon style="vertical-align: top" color="black">mdi-arrow-right-thick</v-icon>
      <img src="@/assets/example.png" width="200" class="elevation-5"/>
      </div>      
      <p>
      Above a sample VCF (Variant Call Format) file is converted into a subway map style visualization.
      Each white block represents part of the reference genome that is skipped.
      Each block along the center represents a nucleotide from the reference genome. 
      Each diagnal box represents the alternative nucleotide(s) the variant.
      </p>

    </v-card-text>

    <v-card-actions>
      <router-link to="/visualize">
        <v-btn color="primary">
          Create a Visualization
        </v-btn>
      </router-link>
    </v-card-actions>
  </v-card>
  </v-container>
</template>

<script>
  export default {
    name: 'Concept',
    data () {
      return {
        exampleVCs: [
          {
            key: "1",
            CHROM: 'chr1',
            POS: 2370,
            REF: "G",
            ALT: "A",
          },{
            key: "2",
            CHROM: 'chr1',
            POS: 4321,
            REF: "T",
            ALT: "A",            
          },
        ]
      }
    }
  }
</script>