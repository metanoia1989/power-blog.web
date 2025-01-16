<script setup>
import { computed } from 'vue'
import { useAppStore } from '~/stores/app';

const props = defineProps({
  cover: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  createdAt: {
    type: String,
    default: '',
  },
})

const appStore = useAppStore()
const $config = computed(() => appStore.config)
const create = computed(() => props.createdAt.slice(5, 10))

</script>

<template>
  <div class="archive-card">
    <figure class="archive-cover">
      <img :src="cover || $config.defaultCover" alt="cover">
    </figure>
    <div class="archive-text">
      <h3>{{ create }}</h3>
      <p>{{ title }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
