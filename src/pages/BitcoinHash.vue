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
const mapTest = ref([])

const doodleCSS = computed(() => {
  let rgbStr = map.value ? map.value.map( i => i.color ).join(',') : ''
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
  const hashFn = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8", numRounds: 2})
  hashFn.update(msg)
  return hashFn.getHash('HEX')
}
const update = (value) => {
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
    record(unicode)
    return {
      color: `#${rgb}`,
      operator: unicode,
    }
  } )
  doodle.value.update(doodleCSS.value)
}
const download = async () => {
  let result = await doodle.value.export({
    scale: 2,
    download: true
  })
}
const record = (operator) => {
  let index = mapTest.value.findIndex( i => i.operator == operator)
  mapTest.value[index].number += 1
}


watch(message, (currentValue, oldValue) => {
  update(currentValue)
})

onMounted(async () => {
  for (let i = 0; i <= 255; i++) {
    const hexValue = i.toString(16).padStart(2, '0')
    mapTest.value.push({
      operator: `\\22${hexValue}`,
      number: 0,
    })
  }
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
    <div>
      <ul>
        <li v-for="i in mapTest" :key="i.operator">
          <span>{{ i.operator }}:</span><strong>{{ i.number }}</strong>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
</style>