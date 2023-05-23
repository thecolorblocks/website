<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { computeHash } from '../compute'

import { JuliaMonoMathOperators, BabelStoneHanKana } from '../fonts'

import FlipBlock from '../components/FlipBlock.vue'
import Hashglyphs from '../components/Hashglyphs.vue'
import Heatmap from '../components/Heatmap.vue'

const router = useRouter()

const title = ref('Bitcoin Glyphs')
const message = ref('')
const defaultMsg = ref('Typing art into existence...')
const size = ref(450)
const hashglyphs = ref(null)
const heatmap = ref([])
const flipped = ref(false)
const type = ref('Mathematics')
const signature = ref('')

const glyphsd = [
  {
    cmd: './glyphd --show-heatmap',
    execute: () => flipped.value = true,
  },{
    cmd: './glyphd --show-glyphs',
    execute: () => flipped.value = false,
  },{
    cmd: './glyphd --type mathematics',
    execute: () => type.value = 'Mathematics',
  },{
    cmd: './glyphd --type nakamoto',
    execute: () => type.value = 'Nakamoto',
  },
]

const buttonText = computed(() => {
  if (glyphsd.find( c => c.cmd == message.value )) return 'EXECUTE'
  return 'INSCRIBE'
})

const inscribe = (id) => {
  // See if commands are met
  let cmd = glyphsd.find( c => c.cmd == message.value )
  if (!!cmd) {
    if (!!cmd.execute) cmd.execute()
    return
  }

  // Get svg information
  const svg = document.querySelector(id)

  // Provide metadata and provenance signature
  const signature = 'thisissigned'
  svg.dataset.hash = computeHash(message.value)
  svg.dataset.type = type.value
  svg.dataset.signature = signature

  // Add font data
  if (type.value == 'Mathematics' || type.value == 'Nakamoto') {
    const fontDataURI = type.value == 'Mathematics' ? JuliaMonoMathOperators : BabelStoneHanKana
    const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style')
    styleElement.textContent = `
    @font-face {
      font-family: 'CustomFont';
      src: url(${fontDataURI}) format('woff');
    }
    .item {
      font-family: 'CustomFont';
    }`
    svg.querySelector('div.host').appendChild(styleElement)
  }
  
  // Download svg image
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  const dataURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link); // To work with Firefox
  link.href = dataURL;
  link.download = `hashglyphs.svg`
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
            :signature="signature" 
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
            {{ buttonText }}
          </button>
        </div>
        <div class="card border w-96">
          <div class="card-body">
            <h1 class="card-title text-accent">
              {{ title }}
            </h1>
            <p class="py-6">
              Inspired by SHA-256 which helps ensure the immutability of the Bitcoin Blockchain, this generative art project lets you inscribe 
              <a href="#" class="link-primary">SHA-256 Glyphs</a> 
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
  font-family: JuliaMono-Light;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/juliamono/0.049/JuliaMono-Light.woff2");
}
.bitcoinhash {
  font-family: JuliaMono-Light;
}
</style>