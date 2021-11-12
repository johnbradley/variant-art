const pako = require('pako');

export function parseVariantCalls(text) {
    // the returned items will be sorted based on POS numerically    
    const variantCalls = []
    text.split('\n').forEach((line) => {
        if (line !== '' && !line.startsWith('#')) {
        const parts = line.split('\t')
        variantCalls.push({
            CHROM: parts[0],
            POS: parseInt(parts[1]),
            REF: parts[3],
            ALT: parts[4].split(',')
        })
        }
    })
    variantCalls.sort((a, b) => (a.POS > b.POS) ? 1 : -1)
    return variantCalls
}

export function readFilePromise(file) {
    
    return new Promise((resolve, reject) => {
        const decoder = new TextDecoder()
        var fr = new FileReader()
        fr.onload = () => {
            var data = fr.result;
            if(file.name.endsWith(".gz")) {
                data = pako.inflate(data)
            } 
            resolve(decoder.decode(data))
        };
        fr.onerror = reject
        fr.readAsArrayBuffer(file)
      })
}

export async function vcfDataFromFiles(files) {
    const fileData = []
    for (const file of files) {
        const contents = await readFilePromise(file)
        fileData.push({
            file: file.name,
            contents: parseVariantCalls(contents)
        })
    }
    return fileData
}

export async function vcfDataFromURLs(urls) {
    const fileData = []
    for (const url of urls) {
        const response = await fetch(url)
        const contents = await response.text()
        fileData.push({
            file: url,
            contents: parseVariantCalls(contents)
        })
    }
    return fileData
}

export function findFirstChromosome(vcfData) {
    for (const fd of vcfData) {
      for (const content of fd.contents) {
        return content.CHROM
      }
    }
    return ""
}
