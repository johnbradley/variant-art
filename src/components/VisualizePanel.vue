<template>
 <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h2 class="mb-3">
          Visualize variants
        </h2>
        <v-simple-table>
            <template v-slot:default>
            <thead>
                <tr>
                <th class="text-left">
                    Filename
                </th>
                <th class="text-left">
                    Chromosomes
                </th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="item in summaryVCFData"
                :key="item.filename"
                >
                <td class="text-left">{{ item.filename }}</td>
                <td class="text-left">{{ item.chroms }}</td>
                </tr>
            </tbody>
            </template>
        </v-simple-table>
        <v-select
          v-model="selectedChromosome"
          :items="uniqueChroms"
          label="Selected Chromosome"
          dense
        ></v-select>
        <v-btn @click="promptForInput">
            Back
        </v-btn>

      </v-col>
    </v-row>
    <v-row>
        <v-col>
            <svg width="400" height="400">
                <SvgElement
                    v-for="svg in svgArray"
                    :key="svg.key"
                    :shapeType="svg.type"
                    :attrString="svg.attr"
                />
            </svg>
        </v-col>
    </v-row>
 </v-container>
</template>

<script>
 import SvgElement from '../components/SvgElement'

export default {
    name: 'VisualizePanel',
    components:{
        SvgElement
    },
    props: {
        vcfData: Array,
        selectedChromosome: String,
    },
    methods: {
        promptForInput() {
            this.$emit('promptForInput')
        }
    },
    data () {
        return {
            svgArray: [
                { type: 'rect', attr: 'attrString', key: 'shape1' },
                { type: 'circle', attr: 'attrString', key: 'shape2' }
            ]
        }
    },
    computed: {
        summaryVCFData() {
            const result = []
            for (const fd of this.vcfData) {
                const chroms = new Set();
                for (const content of fd.contents) {
                    chroms.add(content.CHROM)
                    console.log(content)
                }
                result.push({
                    filename: fd.file,
                    chroms: Array.from(chroms).join(', ')
                })
            }
            return result
        },
        uniqueChroms() {
            const chroms = new Set();            
            for (const fd of this.vcfData) {
                for (const content of fd.contents) {
                    chroms.add(content.CHROM)
                }            
            }
            return Array.from(chroms)
        }
    }
}
</script>