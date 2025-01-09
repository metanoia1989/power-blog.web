<template>
  <section class="layout-default min-w-[1200px]">
    <slot />
  </section>
</template>

<script lang="ts" setup>
import { useUserStore } from "~~/stores/user";
import ToLogin from "./components/account/to-login.vue";
const userStore = useUserStore();
</script>

<style lang="scss" scoped>
.main-contain {
  min-height: calc(100vh - var(--header-height));
  @apply flex flex-col;
}
</style>
