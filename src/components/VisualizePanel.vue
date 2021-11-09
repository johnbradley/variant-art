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
            <SvgPanZoom 
                :zoomEnabled="true"
                :controlIconsEnabled="true"
    >
            <svg width="1000" height="400" style="border:1px solid black">
                <SvgElement
                    v-for="svg in computedSvgArray"
                    :key="svg.key"
                    :shapeType="svg.type"
                    :attrs="svg.attrs"
                    :children="svg.children"
                >
                    <SvgElement
                        v-for="svgchild in svg.children"
                        :key="svgchild.key"
                        :shapeType="svgchild.type"
                        :attrs="svgchild.attrs"
                        :children="svgchild.children"
                    />
                </SvgElement>
               <text 
                    v-for="txt in computedText" 
                    :key="txt.key"
                    :x="txt.x"
                    :y="txt.y"
                    font-size="12px"
                    >
                    
                </text>                
            </svg>
            </SvgPanZoom>
        </v-col>
    </v-row>
 </v-container>
</template>

<script>
import SvgElement from '../components/SvgElement'
import SvgPanZoom from 'vue-svg-pan-zoom';
import { subwayMapConfig, makeResults } from '../visualizeVariants.js'


export default {
    name: 'VisualizePanel',
    components:{
        SvgElement,
        SvgPanZoom
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
            startX: 20,
            startY: 95,
        }
    },
    computed: {
        computedText() {
            const result = []
            var idx = 0
            for(var fileVcfData of this.vcfData) {
                var filename = fileVcfData.file.replace(".vcf", "")
                var x = this.startX + subwayMapConfig.labelLeftMargin
                var y = this.startY + subwayMapConfig.height * idx + subwayMapConfig.labelTopMargin
                result.push({
                    key: `txt${idx}`,
                    x: x,
                    y: y + 20,
                    content: `${this.selectedChromosome}: ${filename}`,
                })             
                idx += 1
            }
            return result            
        },
        computedSvgArray() {
            var x = this.startX + subwayMapConfig.labelWidth
            var y = this.startY
            const nd = {
                idx: 1
            }
            const result = []
            for(var fileVcfData of this.vcfData) {
                result.push(...makeResults(fileVcfData, nd, x, y, this.selectedChromosome))
                y += subwayMapConfig.height
            }
            
            return result
        },
        summaryVCFData() {
            const result = []
            for (const fd of this.vcfData) {
                const chroms = new Set();
                for (const content of fd.contents) {
                    chroms.add(content.CHROM)
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