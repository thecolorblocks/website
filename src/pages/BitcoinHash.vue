<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import jsSHA from 'jssha'
import 'css-doodle'

const hashFn = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" })
const canvasSize = 30
const codeSize = 2
const katakanaNumbers = 90
const firstKatakanaUnicode = '30a1'

const message = ref('Hello World')
const hashHex = ref(null)
const map = ref(null)
const doodle = ref(null)

const doodleCSS = computed(() => {
  let rgbStr = map.value ? map.value.map( i => i.rgb ).join(',') : ''
  let bgStr = map.value ? map.value.map( i => i.bg ).join(',') : ''
  let unicodeStr = map.value ? map.value.map( i => i.unicode ).join(',') : ''
  let css = `
    :doodle {
      @grid: 8 / ${canvasSize}rem;
    }
    background: @pick-n(${bgStr});
    :after {
      content: @pick-n(${unicodeStr});
      color: @pick-n(${rgbStr});
      font-size: ${codeSize}rem;
    }
  `
  console.log(css)
  return css
})

const hash = (msg) => {
  hashFn.update(msg)
  return hashFn.getHash('HEX')
}
const parseKatakana = (hex) => {
  return (parseInt(firstKatakanaUnicode, 16) + parseInt(hex, 16) % katakanaNumbers).toString(16)
}
const update = () => {
  hashHex.value = hash(message.value)
  map.value = hashHex.value.split('').map( i => {
    let h = hash(i)
    let rgb = h.slice(0, 3)
    let bg = h.slice(3, 6)
    let unicode = parseKatakana(h.slice(-4))
    return {
      rgb: `#${rgb}`,
      bg: `#${bg}`,
      unicode: `\\${unicode}`,
    }
  } )
  doodle.value.update(doodleCSS.value)
}


watch(message, (currentValue, oldValue) => {
  update()
})

onMounted(async () => {
  update()
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
      <css-doodle ref="doodle" style="margin: 0 auto;">
        {{ doodleCSS }}
      </css-doodle>
    </div>
    <div>
      <p>
        Message
      </p>
      <input v-model="message" />
    </div>
    <div>
      <p>
        Hash
      </p>
      <p>
        {{ hashHex }}
      </p>
    </div>
  </div>
</template>
<style scoped>
</style>