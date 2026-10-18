<template>
    <div class="qrcode-wrapper" v-html="svg"></div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { renderSVG } from 'uqr'

/**
 * 替代 nuxt-qrcode 的 <Qrcode>。用 uqr 直接渲染 SVG，
 * 不依赖 canvas，也不需要额外的运行时依赖。
 */
const props = withDefaults(
    defineProps<{
        value: string
        /** 兼容 nuxt-qrcode 的写法，SVG 渲染下无实际作用 */
        variant?: string
    }>(),
    {
        value: '',
        variant: undefined
    }
)

const svg = computed(() =>
    renderSVG(props.value || '', {
        border: 2,
        black: '#000000',
        white: '#ffffff'
    })
)
</script>

<style lang="scss" scoped>
.qrcode-wrapper {
    display: block;
    line-height: 0;

    :deep(svg) {
        display: block;
        width: 100%;
        height: 100%;
    }
}
</style>
