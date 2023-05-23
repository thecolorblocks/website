<script setup>
import { ref, computed, onMounted } from 'vue'
import { computeHash, zeroToOne, toHeatColor, toGlyphColor, toMonoColor, hexToHtml } from '../compute'

const emit = defineEmits(['record'])

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    default: 'Mathematics'
  },
  signature: {
    type: String,
    default: '',
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
    // According to type
    let rgb
    if (props.type == 'Mathematics') {
      rgb = toGlyphColor(v)
    } else if (props.type == 'Monochrome') {
      rgb = toMonoColor(v)
    } else if (props.type == 'Nakamoto') {
      rgb = '#F7931A'
    }
    // Send record event to Heatmap
    // Do not record when message is empty
    if (!!props.message) {
      record(v)
      emit('record', heatmap.value)
    }
    return {
      color: rgb,
      htmlHex: hexToHtml(v, props.type),
    }
  } )
})

onMounted(() => {
  for (let i = 0; i < 256; i++) {
    const hexValue = i.toString(16).padStart(2, '0')
    heatmap.value.push({
      hex: hexValue,
      number: 0,
      heatValue: 0,
      heatColor: toHeatColor(0)
    })
  }
  // Send first record which is empty
  emit('record', heatmap.value)
})

function record(hex) {
  const index = heatmap.value.findIndex( i => i.hex == hex )
  let number = heatmap.value[index].number
  // Update
  number += 1
  heatmap.value[index].number = number
  heatmap.value[index].heatValue = zeroToOne(number)
  heatmap.value[index].heatColor = toHeatColor(zeroToOne(number))
}
</script>

<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    :width="size" 
    :height="size" 
    data-hash=""
    data-type=""
    data-signature="">
    <foreignObject x="0" y="0" width="100%" height="100%">
      <div 
        v-if="props.type != 'Monochrome'"
        xmlns="http://www.w3.org/1999/xhtml" 
        class="host" 
        :style="`width: ${size}px; height: ${size}px; font-family: '${props.type}'; display: flex; flex-wrap: wrap; gap: 0; background-color: ${props.type == 'Mathematics' ? '#000' : '#13161F'};`">
        <div
          v-for="(i, index) in hashglyphs"
          :key="index"
          class="item"
          :style="`color: ${i.color}; width: ${size/8}px; height: ${size/8}px; display: flex; justify-content: center; align-items: center;`">
          <span :style="`font-size: ${size/16}px;`" v-html="i.htmlHex">
          </span>
        </div>
      </div>
      <div
        v-else
        xmlns="http://www.w3.org/1999/xhtml" 
        class="host" 
        :style="`width: ${size}px; height: ${size}px; display: flex; flex-wrap: wrap; gap: 0; background-color: #000;`">
        <div
          v-for="(i, index) in hashglyphs"
          :key="index"
          class="item"
          :style="`background-color: ${i.color}; width: ${size/8}px; height: ${size/8}px;`">
        </div>
      </div>
    </foreignObject>
  </svg>
</template>