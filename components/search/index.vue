<script setup>
import { ref } from 'vue'
import { useRouter } from '#app'
import { useArticleStore } from '@/stores/article'
import { useNuxtApp } from '#app'

const { $message } = useNuxtApp()

const router = useRouter()
const articleStore = useArticleStore()


// Refs
const searchValue = ref('')
const searchCount = ref(0)
const posts = ref([])
const showModal = ref(false)
const loading = ref(true)
const searchWrap = ref(null)

// Methods
const showSearchWrap = () => {
  showModal.value = true
  searchPostsFn()
  document.documentElement.classList.add('modal-open')
  searchWrap.value.classList.add('active')
}

const hideSearchWrap = () => {
  showModal.value = false
  searchValue.value = ''
  document.documentElement.classList.remove('modal-open')
  searchWrap.value.classList.remove('active')
}

const pushToPost = (number) => {
  router.push(`/posts/${number}`)
  hideSearchWrap()
}

const searchPostsFn = async () => {
  loading.value = true
  posts.value = []
  
  try {
    const res = await articleStore.searchPosts({ q: searchValue.value })
    searchValue.value = ''
    searchCount.value = res.searchCount
    posts.value = res.posts
  } catch (err) {
    $message({
      content: '搜索文章失败',
      type: 'error',
    })
    throw new Error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="site-search">
    <div ref="searchWrap" class="search-wrap">
      <form class="search-box" @submit.prevent="searchPostsFn">
        <input
          v-model="searchValue"
          type="text"
          class="search-input"
          placeholder="输入关键词进行搜索"
          @focus="showSearchWrap"
        >
        <button type="submit" class="search-btn">
          搜索
        </button>
      </form>
      <div v-if="showModal" class="search-res">
        <div class="close-btn" @click="hideSearchWrap">
          <SvgIcon name="close" />
        </div>
        <div class="container">
          <div v-loading="loading" class="posts">
            <ul class="items">
              <li
                v-for="post in posts"
                :key="post.id"
                class="item"
                @click="pushToPost(post.number)"
              >
                <SvgIcon name="arrow" />
                <span>{{ post.title }}</span>
              </li>
            </ul>
          </div>
          <p class="tip">
            <span v-if="searchCount >= 10">仅展示前 10 条结果，点击可跳转至相应文章</span>
            <span v-else>找到了 {{ searchCount }} 条结果，点击即可跳转至相应文章</span>
          </p>
        </div>
      </div>
    </div>
    <div class="mask" @click="hideSearchWrap" />
  </div>
</template>

<style lang="scss" scoped>
@import 'index.scss'
</style>
