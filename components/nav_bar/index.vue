<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from '#app'
import { useStyleStore } from '@/stores/style'
import SvgIcon from '@/components/svg-icon/index.vue'

const router = useRouter()
const route = useRoute()
const styleStore = useStyleStore()
const $config = useAppConfig()

const menus = [
  { id: 0, title: '首页', path: '/', icon: 'home' },
  { id: 1, title: '归档', path: '/archives', icon: 'archives' },
  { id: 2, title: '灵感', path: '/weibo', icon: 'inspire' },
  { id: 3, title: '关于', path: '/about', icon: 'about' },
]

const routerChanged = ref(false)
const theme = ref('light')
const menuWrap = ref(null)

const darkMode = computed(() => theme.value === 'dark')

const getCurrentTheme = () => {
  theme.value = styleStore.theme
}

const changeTheme = () => {
  getCurrentTheme()
  styleStore.setTheme(theme.value === 'light' ? 'dark' : 'light')
}

const setCurrentMenu = () => {
  const path = routerChanged.value ? route.path : styleStore.currentMenu.path
  const menu = menus.find(item => item.path === path)
  if (menu) {
    const leftDu = `${menu.id * 20}%`
    menuWrap.value.style.setProperty('--left-du', leftDu)
    styleStore.setCurrentMenu(menu)
  }
}

const backToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

watch(() => styleStore.theme, () => {
  getCurrentTheme()
})

onMounted(() => {
  getCurrentTheme()
  setCurrentMenu()
  router.afterEach(() => {
    routerChanged.value = true
    setCurrentMenu()
  })
})
</script>

<template>
  <div class="nav-bar" @dblclick="backToTop">
    <div class="site-title">
      <div class="site-logo">
        <img src="/logo-center.png" alt="site logo">
      </div>
      <h1>
        <NuxtLink class="title" to="/">
          {{ $config.title }}
        </NuxtLink>
        <span class="subtitle">{{ $config.subtitle }}</span>
      </h1>
    </div>
    <nav class="site-nav">
      <ul ref="menu-wrap">
        <li v-for="menu in menus" :key="menu.id">
          <NuxtLink :to="menu.path">
            <SvgIcon :name="menu.icon" color="currentColor" />
             {{ menu.title }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <div class="site-control">
      <div class="change-theme" @click="changeTheme">
        <span class="theme__toggle-wrap">
          <span class="theme__icon">
            <span class="theme__icon-part" />
            <span class="theme__icon-part" />
            <span class="theme__icon-part" />
            <span class="theme__icon-part" />
            <span class="theme__icon-part" />
            <span class="theme__icon-part" />
            <span class="theme__icon-part" />
            <span class="theme__icon-part" />
            <span class="theme__icon-part" />
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>

