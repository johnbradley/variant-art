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

export const subwayMapConfig = {
    height: 200,
    labelWidth: 60,
    labelLeftMargin: 10,
    labelTopMargin: 9,
}

function spacerBlock(nd, x, y, size) {
    const vOffset = 0
    const fill = 'white'
    return roundedBlock(nd, x, y, vOffset, size, fill)
}

function roundedBlock(nd, x, y, vOffset, size, fill, rotate=null, stroke=null) {
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
        nd, x, adjustedY, width, height, 
        blockConfig.rx, fill, 
        blockConfig.stroke, blockConfig.strokeWidth,
        transform
    )
}

function sequenceBlock(nd, x, y, vOffset, seq, rotate=null) {
    var size = seq.length
    var fill = letterToColor[seq[0]] || 'grey'
    const result = []
    if (size == 1) {
        result.push(roundedBlock(nd, x, y, vOffset, size, fill, rotate))
    } else {
        //var block = roundedBlock(key, x, y, vOffset, size, "white", rotate)
        //x = block.newX
        //result.push(block)
        var firstTransform = null
        for (const letter of seq) {
            fill = letterToColor[letter] || 'grey'
            var block = roundedBlock(nd, x, y, vOffset, 1, fill, rotate)
            if (firstTransform == null) {
                firstTransform = block.attrs.transform
            } else {
                block.attrs.transform = firstTransform
            }
            x = block.newX
            result.push(block)
        }
    }
    return result
    
}

function vertConnector(nd, x, y, vOffset, transform=null) {
    if (vOffset < 0) {
        vOffset += 1
    }
    const adjustedY = y + vOffset * blockConfig.baseHeight * blockConfig.vOffsetFactor
    const adjustedX = x + (blockConfig.baseWidth / 2);
    const y1 = adjustedY
    const y2 = y1 - connectorConfig.height
    return svgLine(nd, adjustedX, y1, adjustedX, y2, 
        connectorConfig.stroke, connectorConfig.strokeWidth,
        transform)
}

function horizConnector(nd, x, y) {
    const adjustedY = y + (blockConfig.baseHeight / 2)
    const adjustedX = x
    const x1 = adjustedX
    const x2 = adjustedX + blockConfig.baseWidth
    return svgLine(nd, x1, adjustedY, x2, adjustedY, 
        connectorConfig.stroke, connectorConfig.strokeWidth)
}


const letterToColor = {
    T: "#C43314",
    A: "#1FCA23",
    G: "#CB41FC",
    C: "#CDFD34",
}

function svgRect(nd, x, y, width, height, rx, fill, stroke, strokeWidth, transform=null) {
    var pos = null;
    if (nd.variantCall) {
        pos = nd.variantCall.POS;
    }
    return {
        key: makeName(nd), 
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
            "data-pos": pos,
        },
        newX: x + width,
    }
}
function svgLine(nd, x1, y1, x2, y2, stroke, strokeWidth) {
    return {
        key: makeName(nd),
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

export function makeResults(fileVcfData, nd, x, y, selectedChromosome) {
    const result = []
    var item
    var first = true

    var furthestPosition = 1
    
    for (const variantCall of fileVcfData.contents) {
        if (variantCall.CHROM == selectedChromosome) {
            //spacer blocks do not have a position
            nd.variantCall = null
            if (variantCall.POS > furthestPosition) {
                if (!first) {
                    item = horizConnector(nd, x, y)
                    x = item.newX
                    result.push(item)                    
                }
                
                var diff = variantCall.POS - furthestPosition
                item = spacerBlock(nd, x, y, diff.toString().length)
                x = item.newX
                result.push(item)
            }
            first = false
            nd.variantCall = variantCall
            
            item = horizConnector(nd, x, y)
            x = item.newX
            result.push(item)

            var ary = sequenceBlock(nd, x, y, 0, variantCall.REF)
            furthestPosition = variantCall.POS + variantCall.REF.length
            result.push(...ary)
            var vOffset = 1
            for (const alt of variantCall.ALT) {
                var actualVOffset = vOffset
                var rotate = 45
                if (variantCall.POS % 2 == 0) {
                    actualVOffset *= -1
                    rotate = -45
                }
                var rbary = sequenceBlock(nd, x, y, actualVOffset, alt, rotate)
                result.push(...rbary)
                result.push(vertConnector(nd, x, y, actualVOffset))
                vOffset += 1
            }
            for (var bi of ary) {
                x = Math.max(x, bi.newX)
            }
        }
    }
    return result
}