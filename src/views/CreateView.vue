<template>
  <div>
    <select-input-panel @visualize="visualize" v-if="state == 'select-input'" />
    <visualize-panel
      v-if="state == 'visualize'"
      @promptForInput="promptForInput"
      :vcf-data="vcfData"
      :selected-chromosome="selectedChromosome"
    />
  </div>
</template>

<script>
import SelectInputPanel from "../components/SelectInputPanel";
import VisualizePanel from "../components/VisualizePanel";
import { findFirstChromosome } from "../readVCFs.js";

export default {
  name: "Home",
  data: () => ({
    state: "select-input",
    vcfData: [],
    selectedChromosome: "",
  }),
  components: {
    SelectInputPanel,
    VisualizePanel,
  },
  methods: {
    visualize(vcfData) {
      this.vcfData = vcfData;
      this.selectedChromosome = findFirstChromosome(vcfData);
      this.state = "visualize";
    },
    promptForInput() {
      this.state = "select-input";
    },
  },
};
</script>
