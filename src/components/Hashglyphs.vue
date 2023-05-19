<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { computeHash, zeroToOne, toHeatColor, toGlyphColor } from '../compute'

const emit = defineEmits(['record'])

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  }
})

const heatmap = ref([])

const hashHex = computed(() => {
  return computeHash(props.message)
})
const hashglyphs = computed(() => {
  return hashHex.value.split('').map( (item, index) => {
    let v
    if ( index == hashHex.value.length-1 ) {
      v = hashHex.value[index] + hashHex.value[0]
    } else {
      v = hashHex.value.slice(index, index + 2)
    }
    let rgb = toGlyphColor(v)
    let htmlHex = `&#x22${v};`
    // Send record event to Heatmap
    // Do not record when message is empty
    if (!!props.message) {
      record(htmlHex)
      emit('record', heatmap.value)
    }
    return {
      color: rgb,
      htmlHex: htmlHex,
    }
  } )
})

onMounted(() => {
  for (let i = 0; i < 256; i++) {
    const hexValue = i.toString(16).padStart(2, '0')
    heatmap.value.push({
      htmlHex: `&#x22${hexValue};`,
      number: 0,
      heatValue: 0,
      heatColor: toHeatColor(0)
    })
  }
  // Send first record which is empty
  emit('record', heatmap.value)
})

function record(htmlHex) {
  const index = heatmap.value.findIndex( i => i.htmlHex == htmlHex )
  let number = heatmap.value[index].number
  // Update
  number += 1
  heatmap.value[index].number = number
  heatmap.value[index].heatValue = zeroToOne(number)
  heatmap.value[index].heatColor = toHeatColor(zeroToOne(number))
}
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size">
    <foreignObject x="0" y="0" width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" class="host" :style="`width: ${size}px; height: ${size}px; display: flex; flex-wrap: wrap; gap: 0; background-color: #000;`">
        <div
          v-for="(i, index) in hashglyphs"
          :key="index"
          class="item"
          :style="`color: ${i.color}; width: ${size/8}px; height: ${size/8}px; display: flex; justify-content: center; align-items: center;`">
          <span :style="`font-size: ${size/16}px;`" v-html="i.htmlHex">
          </span>
        </div>
      </div>
    </foreignObject>
  </svg>
</template>