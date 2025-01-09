<script setup>
import { ref, onMounted, onCreated } from 'vue'
import { useMessage } from '@/hooks/useMessage'
import { useArticleStore } from '@/stores/article'
import Comment from '@/components/comment/index.vue'
import MarkIt from '@/components/markdown/mark_it'
import Markdown from '@/components/markdown/index.vue'

const store = useArticleStore()
const message = useMessage()

// state
const about = ref('')
const isLiked = ref('notLiked')
const likeTimes = ref(0)
const loading = ref(true)

// methods
const getAboutFn = async () => {
  try {
    const res = await store.getAbout()
    const content = res?.body || ''
    const markIt = new MarkIt()
    const parsedString = await markIt.parse(content)
    about.value = parsedString?.content
    appendBusuanzi(parsedString?.content)
  }
  catch (err) {
    message.error('获取关于内容失败')
    throw new Error(err)
  }
  finally {
    loading.value = false
  }
}

const queryLikeFn = async () => {
  try {
    const res = await store.queryLike('getTimes')
    if (res !== 'undefined')
      likeTimes.value = res
  }
  catch (err) {
    message.error('获取点赞次数失败')
    throw new Error(err)
  }
}

const likeClick = async () => {
  if (localStorage.getItem('configLeancloud') === 'no') {
    message.error('博主还没有设置 Leancloud，点赞无效')
    return
  }
  if (isLiked.value === 'isLiked') {
    message.warning('您已经点过赞了哦~')
    return
  }
  
  try {
    likeTimes.value = await store.queryLike()
    isLiked.value = 'isLiked'
    localStorage.setItem('isLiked', 'isLiked')
    message.success('谢谢您的点赞~')
  }
  catch (err) {
    message.error('点赞失败')
    throw new Error(err)
  }
}

const appendBusuanzi = (string) => {
  if (!string)
    return
  const hasBusuanzi = string.includes('busuanzi')
  if (hasBusuanzi) {
    const busuanziScript = document.querySelector('script[src*="busuanzi"]')
    if (busuanziScript)
      busuanziScript.remove()
    const script = document.createElement('script')
    script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
    document.body.appendChild(script)
  }
}

// lifecycle
onCreated(() => {
  if (localStorage.getItem('isLiked') === 'undefined') {
    localStorage.setItem('isLiked', 'notLiked')
    isLiked.value = 'notLiked'
  }
  else {
    isLiked.value = localStorage.getItem('isLiked')
  }
  getAboutFn()
})

onMounted(() => {
  if (localStorage.getItem('configLeancloud') === 'yes')
    queryLikeFn()
})
</script>

<template>
  <div class="about-wrap">
    <div class="about">
      <div v-loading="loading" class="about-content">
        <Markdown :content="about" />
      </div>
    </div>
    <Comment />
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
