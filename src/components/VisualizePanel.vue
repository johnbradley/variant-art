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
                :fit="true"
                :center="false"
    >
            <svg width="1000" height="400" style="border:1px solid black">
                <text 
                    v-for="txt in computedText" 
                    :key="txt.key"
                    :x="txt.x"
                    :y="txt.y"
                    font-size="12px"
                    >
                    {{txt.content}}
                </text>
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
            </svg>
            </SvgPanZoom>
        </v-col>
    </v-row>
 </v-container>
</template>

<script>
// TODO: show all colors for a sequence
//       add g and SvgElement children
// TODO: rotate shapes
import SvgElement from '../components/SvgElement'
import SvgPanZoom from 'vue-svg-pan-zoom';

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

const subwayMapConfig = {
    height: 200,
    labelWidth: 60,
    labelLeftMargin: 10,
    labelTopMargin: 9,
}

function spacerBlock(key, x, y, size) {
    const vOffset = 0
    const fill = 'white'
    return roundedBlock(key, x, y, vOffset, size, fill)
}

function roundedBlock(key, x, y, vOffset, size, fill, rotate=null, stroke=null) {
    if (stroke == null) {
        stroke = blockConfig.stroke
    }
    const [width, height] = [size * blockConfig.baseWidth, blockConfig.baseHeight]
    const adjustedY = y + vOffset * height * blockConfig.vOffsetFactor
    var transform = null
    if (rotate != null) {
        transform = `rotate(${rotate} ${x+5} ${adjustedY+5})`
    }
    return svgRect(
        key, x, adjustedY, width, height, 
        blockConfig.rx, fill, 
        blockConfig.stroke, blockConfig.strokeWidth,
        transform
    )
}

function sequenceBlock(key, x, y, vOffset, seq, rotate=null) {
    var size = seq.length
    var fill = letterToColor[seq[0]] || 'grey'
    const result = []
    if (size == 1) {
        result.push(roundedBlock(key, x, y, vOffset, size, fill, rotate))
    } else {
        //var block = roundedBlock(key, x, y, vOffset, size, "white", rotate)
        //x = block.newX
        //result.push(block)
        var idx = 1;
        var firstTransform = null
        for (const letter of seq) {
            fill = letterToColor[letter] || 'grey'
            var block = roundedBlock(key + "_" + idx, x, y, vOffset, 1, fill, rotate)
            if (firstTransform == null) {
                firstTransform = block.attrs.transform
            } else {
                block.attrs.transform = firstTransform
            }
            x = block.newX
            result.push(block)   
            idx += 1  
        }
    }
    return result
    
}

function vertConnector(key, x, y, vOffset, transform=null) {
    if (vOffset < 0) {
        vOffset += 1
    }
    const adjustedY = y + vOffset * blockConfig.baseHeight * blockConfig.vOffsetFactor
    const adjustedX = x + (blockConfig.baseWidth / 2);
    const y1 = adjustedY
    const y2 = y1 - connectorConfig.height
    return svgLine(key, adjustedX, y1, adjustedX, y2, 
        connectorConfig.stroke, connectorConfig.strokeWidth,
        transform)
}

function horizConnector(key, x, y) {
    const adjustedY = y + (blockConfig.baseHeight / 2)
    const adjustedX = x
    const x1 = adjustedX
    const x2 = adjustedX + blockConfig.baseWidth
    return svgLine(key, x1, adjustedY, x2, adjustedY, 
        connectorConfig.stroke, connectorConfig.strokeWidth)
}


const letterToColor = {
    T: "#C43314",
    A: "#1FCA23",
    G: "#CB41FC",
    C: "#CDFD34",
}

function svgRect(key, x, y, width, height, rx, fill, stroke, strokeWidth, transform=null) {
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
            "stroke-width": strokeWidth,
            transform: transform,
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

function makeResults(fileVcfData, nd, x, y, selectedChromosome) {
    const result = []
    var item
    item = spacerBlock(makeName(nd), x, y, 2)
    x = item.newX
    result.push(item)

    var idx = 0
    for (const variantCall of fileVcfData.contents) {
        if (variantCall.CHROM == selectedChromosome) {
            item = horizConnector(makeName(nd), x, y)
            x = item.newX
            result.push(item)
            var ary = sequenceBlock(makeName(nd), x, y, 0, variantCall.REF)
            result.push(...ary)
            var vOffset = 1
            for (const alt of variantCall.ALT) {
                var actualVOffset = vOffset
                var rotate = 45
                if (idx % 2 == 0) {
                    actualVOffset *= -1
                    rotate = -45
                }
                var rbary = sequenceBlock(makeName(nd), x, y, actualVOffset, alt, rotate)
                result.push(...rbary)
                result.push(vertConnector(makeName(nd), x, y, actualVOffset))
                vOffset += 1
            }
            for (var bi of ary) {
                x = Math.max(x, bi.newX)
            }
        }
        idx += 1
    }

    item = horizConnector(makeName(nd), x, y)
    x = item.newX
    result.push(item)

    item = spacerBlock(makeName(nd), x, y, 2)
    x = item.newX
    result.push(item)
    return result
}

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
            /*
            const result = []

            var item
            item = spacerBlock(makeName(nd), x, y, 2)
            x = item.newX
            result.push(item)


            const firstVcfData = this.vcfData[0]
            var idx = 0
            for (const variantCall of firstVcfData.contents) {
                if (variantCall.CHROM == this.selectedChromosome) {
                    item = horizConnector(makeName(nd), x, y)
                    x = item.newX
                    result.push(item)

                    var ary = sequenceBlock(makeName(nd), x, y, 0, variantCall.REF)
                    //var baseItem = ary[0]
                    result.push(...ary)
                    var vOffset = 1
                    for (const alt of variantCall.ALT) {
                        var actualVOffset = vOffset
                        var rotate = 45
                        if (idx % 2 == 0) {
                            actualVOffset *= -1
                            rotate = -45
                        }
                        var rbary = sequenceBlock(makeName(nd), x, y, actualVOffset, alt, rotate)
                        result.push(...rbary)
                        result.push(vertConnector(makeName(nd), x, y, actualVOffset))
                        vOffset += 1
                    }
                    for (var bi of ary) {
                        x = Math.max(x, bi.newX)
                    }
                }
                idx += 1
            }

            item = horizConnector(makeName(nd), x, y)
            x = item.newX
            result.push(item)

            item = spacerBlock(makeName(nd), x, y, 2)
            x = item.newX
            result.push(item)
            */
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