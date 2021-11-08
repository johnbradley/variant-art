
export function parseVariantCalls(text) {
    const variantCalls = []
    text.split('\n').forEach((line) => {
        if (line !== '' && !line.startsWith('#')) {
        const parts = line.split('\t')
        variantCalls.push({
            CHROM: parts[0],
            POS: parts[1],
            REF: parts[3],
            ALT: parts[4].split(',')
        })
        }
    })
    //sort positions numerically
    variantCalls.sort((a, b) => (a.POS > b.POS) ? 1 : -1)
    return variantCalls;
}
