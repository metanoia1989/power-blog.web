<script setup>
import { computed } from 'vue'
import { useAppStore } from '~/stores/app'

// Props 定义
const props = defineProps({
  post: {
    type: Object,
    default: () => ({}),
  },
})

// Computed properties
const postCategory = computed(() => {
  return props.post.category ? props.post.category.name || '未分类' : '未分类'
})

const showTagText = computed(() => {
  return props.post.tags && props.post.tags.length > 0
})

const appStore = useAppStore()
const $config = computed(() => appStore.config)

</script>

<template>
  <NuxtLink :to="`/posts/${post.slug}`" class="related-post">
    <figure class="post-cover">
      <img v-if="post.feature_image" :src="post.feature_image" alt="Cover">
      <img v-else :src="$config.defaultCover" alt="Cover">
    </figure>
    <div class="post-info">
      <div class="post-meta">
        <span class="post-cate">{{ postCategory }}</span>
        <span class="post-tags">
          <template v-if="showTagText">
            <SvgIcon name="biaoqian" />
            <span v-for="tag in post?.tags" :key="tag.id" class="post-tag">{{ tag.name }}</span>
          </template>
          <span v-if="!post?.tags?.length" class="post-tag">暂无标签</span>
        </span>
      </div>
      <div class="post-text">
        <h2 class="post-title">
          {{ post.title }}
        </h2>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
