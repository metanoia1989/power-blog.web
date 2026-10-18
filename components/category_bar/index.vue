<template>
  <div class="categories-bar">
    <div class="categories">
      <RouterLink to="/">
        近期文章
      </RouterLink>
      <RouterLink 
        v-for="category in categories" 
        :key="category.id" 
        :to="`/category/${category.slug}`"
      >
        {{ category.name }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useArticleStore } from '@/stores/article'

import { getCategories } from '@/api/article'

const articleStore = useArticleStore()
// computed
const categories = computed(() => articleStore.categories)

</script>

<style lang="scss" scoped>
@use './index.scss';;
</style>
