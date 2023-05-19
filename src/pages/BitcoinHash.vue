<script setup>

// Redesign UX/UI: 

import { ref, watch, onMounted } from 'vue'
import jsSHA from 'jssha'
import 'css-doodle'
import { reverseBytes, zeroToOne, toHeatColor, toBlockColor, toGlyphColor } from '../compute'

import { JuliaMonoMathOperators } from '../fonts'

import Hashglyphs from '../components/Hashglyphs.vue'
import Heatmap from '../components/Heatmap.vue'

const defaultMsg = 'Typing art into existence...'

const title = ref('Bitcoin Hash')
const message = ref('')
const size = ref(450)
const hashHex = ref(null)
const hashglyphs = ref(null)
// For heat recording
const heatmap = ref([])

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
  hashglyphs.value = hashHex.value.split('').map( (item, index) => {
    let v
    if ( index == hashHex.value.length-1 ) {
      v = hashHex.value[index] + hashHex.value[0]
    } else {
      v = hashHex.value.slice(index, index + 2)
    }
    let rgb = toGlyphColor(v)
    let htmlHex = `&#x22${v};`
    if (!init) record(htmlHex)
    return {
      color: rgb,
      htmlHex: htmlHex,
    }
  } )
}
const download = async (id) => {
  // Get svg information
  const svg = document.querySelector(id)

  // Add font data
  const fontDataURI = JuliaMonoMathOperators
  const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style')
  styleElement.textContent = `
  @font-face {
    font-family: 'JuliaMono-MathOp';
    src: url(${fontDataURI}) format('woff');
  }
  .item {
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
  link.download = id == '#hashglyphs' ? `${hashHex.value}.svg` : `${new Date().getTime()}.svg`
  link.click();
}

const record = (htmlHex) => {
  let index = heatmap.value.findIndex( i => i.htmlHex == htmlHex)
  let number = heatmap.value[index].number
  // Update
  number += 1
  heatmap.value[index].number = number
  heatmap.value[index].heatValue = zeroToOne(number)
  heatmap.value[index].heatColor = toHeatColor(zeroToOne(number))
}



watch(message, (currentValue, oldValue) => {
  update(currentValue, false)
})

onMounted(async () => {
  for (let i = 0; i <= 255; i++) {
    const hexValue = i.toString(16).padStart(2, '0')
    heatmap.value.push({
      htmlHex: `&#x22${hexValue};`,
      number: 0,
      heatValue: 0,
      heatColor: toHeatColor(0)
    })
  }
  update(message.value, true)
})
</script>
<template>
  <div class="flex gap-16 p-16 place-content-center items-center w-screen h-screen bitcoinhash">
    <div :class="`flex w-[${size}px]`">
      <hashglyphs :items="hashglyphs" :size="size" id="hashglyphs">
      </hashglyphs>
      <!--div class="flex">
        <heatmap :items="heatmap" :size="size" id="heatmap">
        </heatmap>
      </div-->
    </div>
    <div class="flex place-content-center">
      <div class="indicator flex">
        <div class="indicator-item indicator-bottom">
          <button class="btn btn-accent" @click="download('#hashglyphs')">
            Inscribe
          </button>
        </div>
        <div class="card border w-96">
          <div class="card-body">
            <h1 class="card-title text-accent">
              {{ title }}
            </h1>
            <p class="py-6">
              Inspired by the SHA-256 algorithm which ensures the immutability of the Bitcoin Blockchain, this generative art project let's you generate 
              <a href="#" class="link-primary">SHA-256 Hashglyphs</a> 
              from the message you type in.
            </p>
            <textarea class="textarea textarea-bordered" v-model="message" :placeholder="defaultMsg"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@font-face {
  /* https://juliamono.netlify.app */
  font-family: JuliaMono-Bold;
  src: url("https://cdn.jsdelivr.net/gh/cormullion/juliamono/webfonts/JuliaMono-Bold.woff2");
}

.bitcoinhash {
  /*font-family: monospace;*/
  font-family: JuliaMono-Bold;
}
</style>