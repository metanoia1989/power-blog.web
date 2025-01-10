<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from '#app'
import { useArticleStore } from '@/stores/article'
import { useNuxtApp } from '#app'
import { getCategories } from '@/api/article'
import Category from '@/pages/category/[slug].vue'

const route = useRoute()
const articleStore = useArticleStore()
const { $message } = useNuxtApp()

definePageMeta({
  index: 0,
  title: '首页',
})

// computed
const isHome = computed(() => route.path === '/')
const categories = computed(() => articleStore.categories)

// methods
const getCategoriesFn = async () => {
  try {
    const res = await getCategories()
    articleStore.setCategories(res)
  } catch (err) {
    // 假设 $message 是全局注册的组件/方法
    $message({
      content: '获取分类失败',
      type: 'error',
    })
    throw new Error(err)
  }
}

// lifecycle hooks
if (articleStore.categories.length === 0) {
  getCategoriesFn()
}

onMounted(() => {
  articleStore.setCurrentCategory('')
})
</script>

<template>
  <div class="home-page">
    <div class="categories-bar">
      <div class="categories">
        <NuxtLink to="/">
          近期文章
        </NuxtLink>
        <NuxtLink 
          v-for="category in categories" 
          :key="category.id" 
          :to="`/category/${category.slug}`"
        >
          {{ category.name}}
        </NuxtLink>
      </div>
    </div>

    <transition name="fade">
      <template v-if="isHome">
        <Category />
      </template>
      <template v-else>
        <NuxtPage />
      </template>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
