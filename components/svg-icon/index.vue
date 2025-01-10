<template>
  <i class="svg-icon" :style="iconStyle" v-html="icon" v-if="icon"></i>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, ref, watchEffect } from 'vue'
import { addUnit } from '@/utils/util'

interface Props {
  name: string
  size?: number | string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: '1em',
  color: 'currentColor'
})

const icon = ref<string>('')

const iconStyle = computed<CSSProperties>(() => ({
  width: addUnit(props.size),
  height: addUnit(props.size),
  color: props.color,
}))

const getPath = async () => {
  try {
    const { default: svg } = await import(`../../assets/images/icons/${props.name}.svg?raw`)
    icon.value = svg
  } catch (error) {
    console.error(`Failed to load SVG icon: ${props.name}`, error)
    icon.value = ''
  }
}

watchEffect(() => {
  getPath()
})
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: -0.15em;
  overflow: hidden;
  color: currentColor;
}
.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.svg-icon :deep(svg path) {
  fill: currentColor;
}

</style>
