<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import Category from '@/pages/category/[slug].vue'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const articleStore = useArticleStore()


// computed
const isHome = computed(() => route.path === '/')

// lifecycle hooks
onMounted(() => {
  articleStore.setCurrentCategory('')
})
</script>

<template>
  <div class="home-page">
    <Category />
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  margin-top: 1em;
}

.fade-enter-active, .fade-leave-active {
  transform: translate(0, 0);
  transition: .5s;
}

.fade-enter, .fade-leave-to {
  transform: translate(0, 1em);
  opacity: 0;
}
</style>
