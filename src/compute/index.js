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

function computeHash(text) {
  const hashFn = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8", numRounds: 2})
  hashFn.update(text)
  return reverseBytes(hashFn.getHash('HEX'))
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

function toGlyphColor(hex) {
  const hue = (1 - parseInt(hex, 16) / parseInt('100', 16)) * 360
  const saturation = 100
  const luminance = 50
  return `hsl(${hue}, ${saturation}%, ${luminance}%)`
}

function toBlockColor(hex) {
  return '#' + hex + hex + hex;
}

function shallowCopy(value) {
  return JSON.parse(JSON.stringify(value))
}

export { computeHash, reverseBytes, zeroToOne, toHeatColor, toGlyphColor, toBlockColor, shallowCopy }