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

const connectorConfig = {
    stroke: 'black',
    strokeWidth: 2,
    height: 10,
    initialOffset: 10
}

function spacerBlock(key, x, y, size) {
    const vOffset = 0
    const fill = 'white'
    return roundedBlock(key, x, y, vOffset, size, fill)
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

function vertConnector(key, x, y, vOffset) {
    if (vOffset < 0) {
        vOffset += 1
    }
    const adjustedY = y + vOffset * blockConfig.baseHeight * blockConfig.vOffsetFactor
    const adjustedX = x + (blockConfig.baseWidth / 2);
    const y1 = adjustedY
    const y2 = y1 - connectorConfig.height
    return svgLine(key, adjustedX, y1, adjustedX, y2, 
        connectorConfig.stroke, connectorConfig.strokeWidth)
}

function horizConnector(key, x, y) {
    const adjustedY = y + (blockConfig.baseHeight / 2)
    const adjustedX = x
    const x1 = adjustedX
    const x2 = adjustedX + blockConfig.baseWidth
    return svgLine(key, x1, adjustedY, x2, adjustedY, 
        connectorConfig.stroke, connectorConfig.strokeWidth)
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
        newX: Math.max(x1, x2),
    }
}

function makeName(nameData) {
    nameData.idx += 1
    return `s${nameData.idx}`
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
        }
    },
    computed: {
        computedSvgArray() {
            const result = []
            var x = this.startX
            var y = this.startY
            const nd = {
                idx: 1
            }

            // beginning of shape
            var item
            item = spacerBlock(makeName(nd), x, y, 2)
            x = item.newX
            result.push(item)

            item = horizConnector(makeName(nd), x, y)
            x = item.newX
            result.push(item)

            // first colored block
            var baseItem = roundedBlock(makeName(nd), x, y, 0, 1, 'cyan')
            result.push(baseItem)
            
            result.push(roundedBlock(makeName(nd), x, y, 1, 1, 'orange'))
            result.push(vertConnector(makeName(nd), x, y, 1))

            result.push(roundedBlock(makeName(nd), x, y, 2, 1, 'white'))
            result.push(vertConnector(makeName(nd), x, y, 2))

            x = baseItem.newX

            item = horizConnector(makeName(nd), x, y)
            x = item.newX
            result.push(item)

            // second colored block
            baseItem = roundedBlock(makeName(nd), x, y, 0, 1, 'yellow')
            result.push(baseItem)
            
            result.push(roundedBlock(makeName(nd), x, y, -1, 1, 'cyan'))
            result.push(vertConnector(makeName(nd), x, y, -1))

            x = baseItem.newX

            item = horizConnector(makeName(nd), x, y)
            x = item.newX
            result.push(item)
            
            // third colored block
            baseItem = roundedBlock(makeName(nd), x, y, 0, 1, 'green')
            result.push(baseItem)
            
            result.push(roundedBlock(makeName(nd), x, y, 1, 1, 'cyan'))
            result.push(vertConnector(makeName(nd), x, y, 1))

            x = baseItem.newX

            item = horizConnector(makeName(nd), x, y)
            x = item.newX
            result.push(item)            

            // end of shape

            result.push(spacerBlock(makeName(nd), x, y, 3))

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