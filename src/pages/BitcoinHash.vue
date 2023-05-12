<script setup>

// UPDATE IMAGE DOWNLOAD TO JPEG FORMAT

import { ref, computed, watch, onMounted } from 'vue'
import jsSHA from 'jssha'
import 'css-doodle'

const canvasSize = 30
const codeSize = 2
const defaultMsg = 'Hello World'

const message = ref(defaultMsg)
const hashHex = ref(null)
const map = ref(null)
const doodle = ref(null)

const doodleCSS = computed(() => {
  let rgbStr = map.value ? map.value.map( i => i.color ).join(',') : ''
  let bgStr = map.value ? map.value.map( i => i.background ).join(',') : ''
  let unicodeStr = map.value ? map.value.map( i => i.operator ).join(',') : ''
  let css = `
    :doodle {
      @grid: 8 / ${canvasSize}rem;
    }
    background: black;
    :after {
      content: @pick-n(${unicodeStr});
      color: @pick-n(${rgbStr});
      font-size: ${codeSize}rem;
      font-weight: 900;
    }
  `
  return css
})

const hash = (msg) => {
  const hashFn = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8", numRounds: 2 })
  hashFn.update(msg)
  return hashFn.getHash('HEX')
}
const update = (value) => {
  if (!value) {
    hashHex.value = hash(defaultMsg)
  } else {
    hashHex.value = hash(value)
  }
  map.value = hashHex.value.split('').map( i => {
    let h = hash(i)
    let rgb = h.slice(0, 6)
    let unicode = `22${h.slice(4, 6)}`
    return {
      color: `#${rgb}`,
      operator: `\\${unicode}`,
    }
  } )
  doodle.value.update(doodleCSS.value)
}
const download = async () => {
  let result = await doodle.value.export({
    scale: 1,
    download: false
  })
  const parser = new DOMParser()
  const svg = parser.parseFromString(result.svg, 'image/svg+xml').querySelector('svg')
  const serializer = new XMLSerializer()
  const link = document.createElement('a');
  let svgString, dataURL

  svg.style.width = '500px'
  svg.style.height = '500px'
  svgString = serializer.serializeToString(svg)
  dataURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  
  link.href = dataURL;
  link.download = hashHex.value;
  link.click();
}


watch(message, (currentValue, oldValue) => {
  update(currentValue)
})

onMounted(async () => {
  update(message.value)
})
</script>
<template>
  <div>
    <h1>
      Bitcoin Hash
    </h1>
    <h4>
      Inspired by SHA256
    </h4>
    <div>
      <css-doodle ref="doodle" style="margin: 0 auto;" id="hashimage">
        {{ doodleCSS }}
      </css-doodle>
    </div>
    <div>
      <p>
        Message
      </p>
      <input v-model="message" :placeholder="defaultMsg" />
    </div>
    <div>
      <p>
        Hash
      </p>
      <p>
        {{ hashHex }}
      </p>
    </div>
    <div>
      <button @click="download">
        Download
      </button>
    </div>
  </div>
</template>
<style scoped>
</style>