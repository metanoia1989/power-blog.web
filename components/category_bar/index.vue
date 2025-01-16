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

</script>

<style lang="scss" scoped>
@use './index.scss';;
</style>
