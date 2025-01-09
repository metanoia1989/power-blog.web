<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import Category from '@/pages/category/index.vue'

const route = useRoute()
const articleStore = useArticleStore()

// computed
const isHome = computed(() => route.name === 'Home')
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
        <router-link to="/">
          近期文章
        </router-link>
        <router-link v-for="category in categories" :key="category.id" :to="{ name: 'Category', params: { number: category.number, category } }">
          {{ category.title }}
        </router-link>
      </div>
    </div>
    <transition name="fade">
      <template v-if="isHome">
        <Category />
      </template>
      <template v-else>
        <router-view />
      </template>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
