import jsSHA from 'jssha'

function computeTxId(txHex) {
  const hashFn1 = new jsSHA("SHA-256", "HEX")
  const firstHash = hashFn1.update(txHex).getHash('HEX')
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

function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
  return new Uint8Array(bytes);
}

function reverseBytes(hex) {
  var bytes = [];
  for(var i=0; i< hex.length-1; i+=2)
      bytes.unshift(hex.substr(i, 2));
  return bytes.join('');
}

export { computeTxId, computeBlockHash }