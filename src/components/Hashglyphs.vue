<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="500px" height="500px">
    <foreignObject x="0" y="0" width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" class="host" style="width: 500px; height: 500px; display: flex; flex-wrap: wrap; gap: 0; background-color: #000;">
        <div
          v-for="(i, index) in props.items"
          :key="index"
          class="item"
          :style="`color: ${i.color}; font-size: 35px; width: 62.5px; height: 62.5px; display: flex; justify-content: center; align-items: center;`">
          <span v-html="i.htmlHex">
          </span>
        </div>
      </div>
    </foreignObject>
  </svg>
</template>