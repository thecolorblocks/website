<script setup>

// TAKE SNAPSHOTS OF MESSAGE AND HEATMAP DATA FOR FUTURE REPLAYS

// CHANGE BITCOIN HASH WITHOUT AFFECTING STORED VALUES FOR DISPLAY PURPOSES

import { ref, computed, watch, onMounted } from 'vue'
import jsSHA from 'jssha'
import 'css-doodle'
import { reverseBytes, zeroToOne, toHeatColor } from '../compute'

import { JuliaMonoMathOperators } from '../fonts'

const canvasSize = 500
const codeSize = 35
const defaultMsg = 'Hello World'

const message = ref('')
const hashHex = ref(null)
const map = ref(null)
const doodle = ref(null)
const mapTest = ref([])

const doodleCSS = computed(() => {
  let rgbStr = map.value ? map.value.map( i => i.color ).join(',') : ''
  let unicodeStr = map.value ? map.value.map( i => i.operator ).join(',') : ''
  let css = `
    :doodle {
      @grid: 8 / ${canvasSize}px;
    }
    background: #000;
    :after {
      content: @pick-n(${unicodeStr});
      color: @pick-n(${rgbStr});
      font-size: ${codeSize}px;
      font-weight: 900;
    }
  `
  return css
})

const hash = (msg) => {
  const hashFn = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8", numRounds: 2})
  hashFn.update(msg)
  return reverseBytes(hashFn.getHash('HEX'))
}
const update = (value, init) => {
  if (!value) {
    hashHex.value = hash(defaultMsg)
  } else {
    hashHex.value = hash(value)
  }
  map.value = hashHex.value.split('').map( (item, index) => {
    let v
    if ( index == hashHex.value.length-1 ) {
      v = hashHex.value[index] + hashHex.value[0]
    } else {
      v = hashHex.value.slice(index, index + 2)
    }
    let h = hash(v)
    let rgb = h.slice(0, 6)
    let unicode = `\\22${v}`
    if (!init) record(unicode)
    return {
      color: `#${rgb}`,
      operator: unicode,
    }
  } )
  doodle.value.update(doodleCSS.value)
}
const download = async () => {
  // Get svg information
  const result = await doodle.value.export({
    scale: 1,
    download: false,
    detail: true
  })

  // Create svg node
  const div = document.createElement('div')
  div.innerHTML = result.svg
  const svg = div.querySelector('svg')

  // Edit svg style to fix aspect ratio problem
  svg.style.width = 'unset'
  svg.style.height = 'unset'

  // Add font data
  const fontDataURI = JuliaMonoMathOperators
  const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style')
  styleElement.textContent = `
  @font-face {
    font-family: 'JuliaMono-MathOp';
    src: url(${fontDataURI}) format('woff');
  }
  .container {
    font-family: 'JuliaMono-MathOp';
  }`
  svg.querySelector('div.host').appendChild(styleElement)
  
  // Download svg image
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  const dataURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link); // To work with Firefox
  link.href = dataURL;
  link.download = `${hashHex.value}.svg`;
  link.click();
}
const record = (operator) => {
  let index = mapTest.value.findIndex( i => i.operator == operator)
  let number = mapTest.value[index].number
  number += 1
  mapTest.value[index].number = number
  mapTest.value[index].heatValue = zeroToOne(number)
  mapTest.value[index].heatColor = toHeatColor(zeroToOne(number))
}


watch(message, (currentValue, oldValue) => {
  update(currentValue, false)
})

onMounted(async () => {
  for (let i = 0; i <= 255; i++) {
    const hexValue = i.toString(16).padStart(2, '0')
    mapTest.value.push({
      operator: `\\22${hexValue}`,
      rawHTML: `&#x22${hexValue};`,
      number: 0,
      heatValue: 0,
      heatColor: toHeatColor(0)
    })
  }
  update(message.value, true)
})
</script>
<template>
  <div class="bitcoinhash">
    <css-doodle ref="doodle" class="center">
      {{ doodleCSS }}
    </css-doodle>
    <h1>
      Bitcoin Hash
    </h1>
    <a href="#" @click="download">
      Download
    </a>
    |
    <a href="#">
      Inscribe
    </a>
    <h5>
      Message
    </h5>
    <textarea v-model="message" :placeholder="defaultMsg"></textarea>
    <div>
      <h5>Hash</h5>
      <code>
        {{ hashHex }}
      </code>
    </div>
    <h5>
      Hashing Heatmap
    </h5>
    <div class="heatmap center">
      <div
        v-for="i in mapTest"
        :key="i.operator"
        class="item"
        :style="`background-color: ${i.heatColor}`">
        <span v-html="i.rawHTML">
        </span>
      </div>
    </div>
    <br />
    <footer>
      <router-link to="/">
        Return
      </router-link>
    </footer>
  </div>
</template>
<style scoped>
@font-face {
  /* https://juliamono.netlify.app */
  font-family: JuliaMono-Bold;
  src: url("https://cdn.jsdelivr.net/gh/cormullion/juliamono/webfonts/JuliaMono-Bold.woff2");
}

div.bitcoinhash {
  /*font-family: monospace;*/
  font-family: JuliaMono-Bold;
  text-align: center;
}
.center {
  margin: 0 auto;
}
div.heatmap {
  width: 500px;
  height: 500px;
  display: flex;
  flex-wrap: wrap;
  gap: 0;
}
div.heatmap .item {
  width: 31.25px;
  height: 31.25px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
</style>