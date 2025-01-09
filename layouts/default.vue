<template>
  <div id="app">
    <NavBar />
    <Search v-if="showSearch" />
    <main class="main">
      <transition :name="transitionName">
        <slot />
      </transition>
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
const transitionName = ref('slide-left')

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

// Watch
watch(
  () => route.path,
  (to, from) => {
    if (to === from) return
    transitionName.value = route.meta.index > from.meta.index ? 'slide-left' : 'slide-right'
  }
)

</script>

<style lang="scss" scoped>
#app {
  position: relative;
}

.main {
  padding-bottom: 180px;
}

.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  transform: translate(30px, 0);
  transition: all 0.3s ease;
}

.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  transform: translate(-30px, 0);
  transition: all 0.3s ease;
}
</style>
