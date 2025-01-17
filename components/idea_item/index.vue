<script setup>
import Markdown from '@/components/markdown/index.vue'
import { useAppStore } from '~/stores/app';

// Props 定义
const props = defineProps({
  idea: {
    type: String,
    default: ''
  },
  create: {
    type: String,
    default: ''
  }
})

const appStore = useAppStore()
const config = computed(() => appStore.config)

</script>

<template>
  <div class="idea-wrap">
    <div class="idea">
      <div class="header">
        <figure class="avatar">
          <img :src="config.avatar" alt="avatar">
        </figure>
        <div class="author-info">
          <h3 class="author">
            {{ config.author }}
          </h3>
          <div class="publish-time">
            发布于 {{ create }}
          </div>
        </div>
      </div>
      <div class="content">
        <Markdown :content="idea" :need-parsed="true" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
