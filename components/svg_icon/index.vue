<template>
  <!-- <NuxtIcon :name="symbolId" mode="svg" :class="svgClass" :style="{ color: color }" /> -->
   <div></div>
</template>

<script setup>
import { computed } from 'vue'

// 定义 props
const props = defineProps({
  prefix: {
    type: String,
    default: 'svg'
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'currentColor'
  }
})

// 计算属性
const symbolId = computed(() => `${props.prefix}-${props.name}`)
const svgClass = computed(() => props.name ? `svg-icon ${props.prefix}-${props.name}` : 'svg-icon')
</script>

<style lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  color: inherit;
  fill: currentColor;
  overflow: hidden;
}
</style>
