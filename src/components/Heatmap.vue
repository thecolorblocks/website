<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  size: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size">
    <foreignObject x="0" y="0" width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" class="host" :style="`width: ${size}px; height: ${size}px; display: flex; flex-wrap: wrap; gap: 0;`">
        <div
          v-for="i in props.items"
          :key="i.htmlHex"
          class="item"
          :style="`background-color: ${i.heatColor}; width: ${size/16}px; height: ${size/16}px; display: flex; justify-content: center; align-items: center; color: #fff;`">
          <span :style="`font-size: ${size/28}px;`" v-html="i.htmlHex">
          </span>
        </div>
      </div>
    </foreignObject>
  </svg>
</template>