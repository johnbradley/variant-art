<template>
  <div>
    <select-input-panel 
      v-if="state == 'select-input'"
      @visualize=visualize
    />
    <visualize-panel 
      v-if="state == 'visualize'"      
      @promptForInput=promptForInput
      :vcf-data=vcfData
      :selected-chromosome=selectedChromosome
    />
  </div>
</template>

<script>
  import SelectInputPanel from '../components/SelectInputPanel'
  import VisualizePanel from '../components/VisualizePanel'

  function findFirstChromosome(vcfData) {
    for (const fd of vcfData) {
      for (const content of fd.contents) {
        return content.CHROM
      }
    }
    return ""
  }

  export default {
    name: 'Home',
    data: () => ({
      state: 'select-input',
      vcfData: [{
        file: "myfile1",
        contents: [
          {
            CHROM: "chr1",
            POS: 12,
            REF: "T",
            ALT: ["G"]
          }
        ]
      }],
      selectedChromosome: "chr1"
    }),
    components: {
      SelectInputPanel,
      VisualizePanel,
    },
    methods: {
      visualize(vcfData) {
        this.vcfData = vcfData
        this.selectedChromosome = findFirstChromosome(vcfData)
        this.state = 'visualize'
      },
      promptForInput() {
        this.state = 'select-input'  
      }
    }
    
  }
</script>
