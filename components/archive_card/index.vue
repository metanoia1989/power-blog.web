<script setup>
import { computed } from 'vue'

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

const $config = useAppConfig()
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
@import './index.scss'
</style>
