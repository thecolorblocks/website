<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="heatmap">
    <div
      v-for="i in props.items"
      :key="i.operator"
      class="item"
      :style="`background-color: ${i.heatColor}`">
      <span v-html="i.rawHTML">
      </span>
    </div>
  </div>
</template>

<style scoped>
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