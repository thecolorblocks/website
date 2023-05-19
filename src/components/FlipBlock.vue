<script setup>
const props = defineProps({
  perspective: {
    type: Number,
    default: 800,
  },
  size: {
    type: Number,
    required: true,
  },
  flipped: {
    type: Boolean,
    default: false,
  }
})
</script>

<template>
  <div class="flipblock static" :class="{ flipped: flipped }" :style="{ width: `${props.size}px`, height: `${props.size}px`, perspective: `${props.perspective}px` }">
    <div class="flipblock-content relative w-full h-full shadow-xl transition-transform duration-1000">
      <div class="front absolute w-full h-full">
        <slot name="front"></slot>
      </div>
      <div class="back absolute w-full h-full">
        <slot name="back"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flipblock .flipblock-content {
  transform-style: preserve-3d;
}

.flipblock.flipped .flipblock-content {
  transform: rotateY(180deg);
  transition: transform 500ms;
}
.front,
.back {
  backface-visibility: hidden;
}
.back {
  transform: rotateY(180deg);
}
</style>