<script setup>
import { ref, onMounted } from 'vue'
import MarkIt from '@/components/markdown/mark_it'
import Markdown from '@/components/markdown/index.vue'


import { useAppStore } from '~/stores/app'
import $message from '@/components/message/plugin'

const appStore = useAppStore()

const config = computed(() => appStore.config)
const about = ref('')


// state
const isLiked = ref('notLiked')
const likeTimes = ref(0)
const loading = ref(true)

// methods
const getAboutFn = async () => {
  try {
    const content = config.value.about || ''
    const markIt = new MarkIt()
    const parsedString = await markIt.parse(content)
    about.value = parsedString?.content
    appendBusuanzi(parsedString?.content)
  }
  catch (err) {
    $message({
      content: '获取关于内容失败',
      type: 'error',
    })
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
    $message({
      content: '获取点赞次数失败',
      type: 'error',
    })
    throw new Error(err)
  }
}

const likeClick = async () => {
  if (localStorage.getItem('configLeancloud') === 'no') {
    $message({
      content: '博主还没有设置 Leancloud，点赞无效',
      type: 'error',
    })
    return
  }
  if (isLiked.value === 'isLiked') {
    $message({
      content: '您已经点过赞了哦~',
      type: 'warning'
    })
    return
  }
  
  try {
    likeTimes.value = await store.queryLike()
    isLiked.value = 'isLiked'
    localStorage.setItem('isLiked', 'isLiked')
    $message({
      content: '谢谢您的点赞~',
      type: 'success',
    })
  }
  catch (err) {
    $message({
      content: '点赞失败',
      type: 'error',
    })
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
onMounted(() => {
  if (localStorage.getItem('isLiked') === 'undefined') {
    localStorage.setItem('isLiked', 'notLiked')
    isLiked.value = 'notLiked'
  }
  else {
    isLiked.value = localStorage.getItem('isLiked')
  }
  getAboutFn()
})
</script>

<template>
  <div class="about-wrap">
    <div class="about">
      <div v-loading="loading" class="about-content">
        <Markdown :content="about" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
