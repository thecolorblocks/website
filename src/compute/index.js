import jsSHA from 'jssha'

function computeTxId(txHex) {
  const hashFn1 = new jsSHA("SHA-256", "HEX")
  const firstHash = hashFn1.update(txHex).getHash('HEX')
  console.log(firstHash)
  const hashFn2 = new jsSHA("SHA-256", "HEX")
  const secondHash = hashFn2.update(firstHash).getHash('HEX')
  return reverseBytes(secondHash)
}

function computeBlockHash(blockHeaderHex) {
  const hashFn1 = new jsSHA("SHA-256", "HEX")
  const firstHash = hashFn1.update(blockHeaderHex).getHash('HEX')
  const hashFn2 = new jsSHA("SHA-256", "HEX")
  const secondHash = hashFn2.update(firstHash).getHash('HEX')
  return reverseBytes(secondHash)
}

function reverseBytes(hex) {
  return hex.match(/.{2}/g).reverse().join('');
}

function zeroToOne(x) {
  return parseFloat((1 - Math.pow(Math.E, -0.05 * x)).toFixed(2))
}

function toHeatColor(x) {
  // x = [0-1]
  const hue = (1-x) * 150
  const saturation = 100
  const luminance = 66
  return `hsl(${hue}, ${saturation}%, ${luminance}%)`
}

function toSpectrumColor(x, s, l) {
  const hue = (1-x) * 360
  return `hsl(${hue}, ${s}%, ${l}%)`
}

function shallowCopy(value) {
  return JSON.parse(JSON.stringify(value))
}

export { reverseBytes, zeroToOne, toHeatColor, toSpectrumColor, shallowCopy }