<template>
    <slot />
</template>

<script lang="ts" setup>
/**
 * 原来是 Nuxt 的 <ClientOnly>。改成 SPA 之后本来就没有服务端渲染，
 * 这个组件只是为了让已有模板不用改，直接透传 slot。
 */
</script>
