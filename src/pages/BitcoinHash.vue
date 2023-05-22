<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { JuliaMonoMathOperators } from '../fonts'

import FlipBlock from '../components/FlipBlock.vue'
import Hashglyphs from '../components/Hashglyphs.vue'
import Heatmap from '../components/Heatmap.vue'

const router = useRouter()

const title = ref('Bitcoin Hashglyphs')
const message = ref('')
const defaultMsg = ref('Typing art into existence...')
const size = ref(450)
const hashglyphs = ref(null)
const heatmap = ref([])
const flipped = ref(false)
const type = ref('glyph')

const hashglyphsd = [
  {
    cmd: './hashglyphsd --show-heatmap',
    execute: () => flipped.value = true,
  },{
    cmd: './hashglyphsd --show-hashglyphs',
    execute: () => flipped.value = false,
  },{
    cmd: './hashglyphsd --type glyph',
    execute: () => type.value = 'glyph',
  },{
    cmd: './hashglyphsd --type mono',
    execute: () => type.value = 'mono',
  },{
    cmd: './hashglyphsd --type kana',
    execute: () => type.value = 'kana',
  },
]

const inscribe = async (id) => {
  // See if commands are met
  let cmd = hashglyphsd.find( c => c.cmd == message.value )
  if (!!cmd) {
    if (!!cmd.execute) cmd.execute()
    return
  }

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
  link.download = id == '#hashglyphs' ? `hashglyphs.svg` : `heatmap.svg`
  link.click();
}
</script>
<template>
  <div class="flex gap-16 p-16 place-content-center items-center w-screen h-screen bitcoinhash">
    <div :class="`flex w-[${size}px]`">
      <flip-block :size="size" :flipped="flipped">
        <template #front>
          <hashglyphs 
            :message="message" 
            :size="size" 
            :type="type" 
            @record="hm => heatmap = hm" 
            id="hashglyphs">
          </hashglyphs>
        </template>
        <template #back>
          <heatmap :heatmap="heatmap" :size="size" id="heatmap">
          </heatmap>
        </template>
      </flip-block>
    </div>
    <div class="flex place-content-center">
      <div class="indicator flex">
        <div class="indicator-item indicator-bottom">
          <button class="btn btn-accent" @click="inscribe('#hashglyphs')">
            Inscribe
          </button>
        </div>
        <div class="card border w-96">
          <div class="card-body">
            <h1 class="card-title text-accent">
              {{ title }}
            </h1>
            <p class="py-6">
              Inspired by the SHA-256 algorithm which ensures the immutability of the Bitcoin Blockchain, this generative art project lets you generate 
              <a href="#" class="link-primary">SHA-256 Hashglyphs</a> 
              from the message you type in.
            </p>
            <textarea class="textarea textarea-bordered w-full h-64" v-model="message" :placeholder="defaultMsg"></textarea>
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