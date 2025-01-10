<template>
  <div id="app">
    <NavBar />
    <Search v-if="showSearch" />
    <main class="main">
        <slot />
    </main>
    <Copyright />
    <BackToTop />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from '#app'

// Components
import NavBar from '@/components/nav_bar/index.vue'
import Search from '@/components/search/index.vue'
import Copyright from '@/components/copyright/index.vue'
import BackToTop from '@/components/back_to_top/index.vue'

const route = useRoute()

// Computed
const showSearch = computed(() => {
  const whiteList = {
    '/': true,
    '/archives': true,
    '/about': false,
    '/post': false,
  }
  return whiteList[route.path] || route.path.startsWith('/category')
})


</script>

<style lang="scss" scoped>
#app {
  position: relative;
  padding-top: var(--nav-height);
}

.main {
  padding-bottom: 180px;
}

</style>
