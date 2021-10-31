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
            <svg width="600" height="200" style="border:1px solid black">
                <SvgElement
                    v-for="svg in computedSvgArray"
                    :key="svg.key"
                    :shapeType="svg.type"
                    :attrs="svg.attrs"
                />
            </svg>
        </v-col>
    </v-row>
 </v-container>
</template>

<script>
import SvgElement from '../components/SvgElement'

const blockConfig = {
    baseWidth: 10,
    baseHeight: 10,
    rx: 2,
    stroke: 'black',
    strokeWidth: 2,
    vOffsetFactor: 2,
}

function roundedBlock(key, x, y, vOffset, size, fill) {
    const [width, height] = [size * blockConfig.baseWidth, blockConfig.baseHeight]
    const adjustedY = y + vOffset * height * blockConfig.vOffsetFactor
    return svgRect(
        key, x, adjustedY, width, height, 
        blockConfig.rx, fill, 
        blockConfig.stroke, blockConfig.strokeWidth
    )
}

function vertConnector(key, x, y, vOffsetFrom, vOffsetTo) {
    const adjustedX = x + (blockConfig.baseWidth / 2);
    const y1 = y + blockConfig.baseHeight + vOffsetFrom * blockConfig.baseHeight * blockConfig.vOffsetFactor
    const y2 = y + blockConfig.baseHeight + vOffsetTo * blockConfig.baseHeight * blockConfig.vOffsetFactor
    return svgLine(key, adjustedX, y1, adjustedX, y2, 'black', 2)
}

function horizConnector(key, x, y) {
    const adjustedY = y + (blockConfig.baseHeight / 2)
    const adjustedX = x
    const x1 = adjustedX
    const x2 = adjustedX + blockConfig.baseWidth
    return svgLine(key, x1, adjustedY, x2, adjustedY, 'black', 2)
}

function svgRect(key, x, y, width, height, rx, fill, stroke, strokeWidth) {
    return {
        key: key, 
        type: 'rect',
        attrs: {
            x: x,
            y: y,
            width: width,
            height: height,
            rx: rx,
            fill: fill,
            stroke: stroke,
            "stroke-width": strokeWidth
        },
        newX: x + width,
    }
}
function svgLine(key, x1, y1, x2, y2, stroke, strokeWidth) {
    return {
        key: key,
        type: 'line',
        attrs: {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            stroke: stroke,
            "stroke-width": strokeWidth,
        },
        newX: x2,
    }
}

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
            startX: 20,
            startY: 95,
            svgArray: [
                roundedBlock('s5', 100, 100, 0, 2, 'white'),
                horizConnector('s13', 120, 100),
                roundedBlock('s6', 150, 100, 0, 1, 'orange'),
                vertConnector('s7', 150, 100, 0, 1),
                roundedBlock('s8', 150, 100, 1, 1, 'cyan'),
                vertConnector('s9', 150, 100, 1, 2),
                roundedBlock('s10', 150, 100, 2, 1, 'yellow'),
                vertConnector('s11', 150, 100, 2, 3),
                roundedBlock('s12', 150, 100, 3, 1, 'green'),  
                horizConnector('s13', 150, 100),
            ]
        }
    },
    computed: {
        computedSvgArray() {
            const result = []
            var x = this.startX
            var y = this.startY
            var item
            item = roundedBlock('s1', x, y, 0, 2, 'white')
            x = item.newX
            result.push(item)

            item = horizConnector('s2', x, y)
            x = item.newX
            result.push(item)

            var baseItem = roundedBlock('s3', x, y, 0, 1, 'cyan')
            result.push(baseItem)
            result.push(vertConnector('s4', x, y, 0, 1))
            result.push(roundedBlock('s5', x, y, 1, 1, 'orange'))
            x = baseItem.newX

            item = horizConnector('s6', x, y)
            x = item.newX
            result.push(item)

            result.push(roundedBlock('s7', x, y, 0, 3, 'white'))

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