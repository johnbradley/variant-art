<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h2 class="mb-3">
          Create VCF Visualizations
        </h2>
        <p>
           Explain what VCF files are and show simple example.
        </p>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col class="mb-4">
        <v-file-input
          chips
          multiple
          truncate-length="20"
          label="VCF files"
          v-model="selectedFiles"
        ></v-file-input>            
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col class="mb-4">
        <v-btn color="primary" v-on:click="importData">
          Import Data
        </v-btn>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>    
  </v-container>
</template>

<script>
  
  import { vcfDataFromFiles } from '../variant.js'

  export default {
    name: 'SelectInputPanel',
    data: () => ({
        selectedFiles: [],
        snackbar: false,
        snackbarText: "",
    }),
    methods: {
      async importData() {
        if(this.selectedFiles.length == 0) {
          this.snackbarText = "You must select at least 1 VCF file to import."
          this.snackbar = true
        } else {
          const fileData = await vcfDataFromFiles(this.selectedFiles);
          this.$emit('visualize', fileData)
        }
      }
    }

  }
</script>
