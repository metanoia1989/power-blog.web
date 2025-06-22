<script setup>
import { ref, onMounted } from 'vue'
import Markdown from '@/components/markdown/index.vue'
import { useNuxtApp, useRouter } from '#app'
import { useAppStore } from '@/stores/app';

const appStore = useAppStore()
const $config = computed(() => appStore.config)

// Props 定义
const props = defineProps({
  post: {
    type: Object,
    default: () => ({}),
  },
})

const content = ref('')

// 处理 Markdown 内容
const initContent = async () => {
  // const markIt = new MarkIt()
  // try {
  //   console.log('desc', props.post.desc)
  //   const parsedMarked = await markIt.parse(props.post.desc)
  //   content.value = parsedMarked?.content
  // } catch (err) {
  //   $message({
  //     content: '解析 markdown 失败',
  //     type: 'error',
  //   })
  //   throw new Error(err)
  // }
  content.value = props.post.desc
}

onMounted(() => {
  initContent()
})

</script>

<template>
  <div class="post-card">
    <figure class="post-cover">
      <img v-if="post.feature_image" :src="post.feature_image" alt="Cover">
      <img v-else :src="$config.defaultCover" alt="Cover">
    </figure>
    <div class="post-info">
      <div class="post-meta">
        <span class="post-tags">
          <span v-if="!post?.tags?.length" class="post-tag">暂无标签</span>
          <span 
            v-for="tag in post?.tags" 
            :key="tag.id" 
            class="post-tag" 
            :style="{ color: `#${tag.color}` }"
          ># {{ tag.name }}</span>
        </span>
      </div>
      <div class="post-text">
        <h2 class="post-title">
          {{ post.title }}
        </h2>
        <p class="post-summary">
          <Markdown :content="content" />
        </p>
      </div>
      <div class="post-meta-num">
        <span class="post-created"><SvgIcon name="shijian" /> {{ post.created_at }}</span>
        <span class="post-hot"><SvgIcon name="huore" /> 热度 {{ post.hot }} &#8451;</span>
        <span class="post-visibility"><SvgIcon name="chakan" /> {{ post.visibility_desc }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './index.scss'
</style>
