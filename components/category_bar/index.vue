<template>
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
        {{ category.name }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useArticleStore } from '@/stores/article'
import { useNuxtApp } from '#app'
import { getCategories } from '@/api/article'

const articleStore = useArticleStore()
const { $message } = useNuxtApp()

// computed
const categories = computed(() => articleStore.categories)

// methods
const getCategoriesFn = async () => {
  try {
    const res = await getCategories()
    articleStore.setCategories(res)
  } catch (err) {
    $message({
      content: '获取分类失败',
      type: 'error',
    })
    throw new Error(err)
  }
}

// init
if (articleStore.categories.length === 0) {
  getCategoriesFn()
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
