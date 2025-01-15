<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from '#app'
import SvgIcon from '@/components/svg-icon/index.vue'
import { useStyleStore } from '@/stores/style'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()

const styleStore = useStyleStore()
const appStore = useAppStore()
const userStore = useUserStore()

const $config = computed(() => appStore.config)

const menus = [
  { id: 0, title: '首页', path: '/', icon: 'home' },
  { id: 1, title: '归档', path: '/archives', icon: 'archives' },
  { id: 2, title: '灵感', path: '/weibo', icon: 'inspire' },
  { id: 3, title: '关于', path: '/about', icon: 'about' },
]

const routerChanged = ref(false)
const theme = ref('light')
const menuWrap = ref(null) // 将与template中的ref名称保持一致

const darkMode = computed(() => theme.value === 'dark')
const isLogin = computed(() => userStore.isLogin)

console.log('isLogin', isLogin.value)

const getCurrentTheme = () => {
  theme.value = styleStore.theme
}

const changeTheme = () => {
  getCurrentTheme()
  styleStore.setTheme(theme.value === 'light' ? 'dark' : 'light')
}

const setCurrentMenu = (path) => {
  const menu = menus.find(item => item.path === path)
  if (menu) {
    const leftDu = `${menu.id * 25}%`
    menuWrap.value.style.setProperty('--left-du', leftDu)
    styleStore.setCurrentMenu(menu)
  }
}

const goLogin = () => {
  router.push('/auth/login', {
    query: {
      redirect: route.path
    }
  })
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
  setCurrentMenu(route.path)
  router.afterEach((to) => {
    routerChanged.value = true
    setCurrentMenu(to.path)
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
      <ul ref="menuWrap">
        <li v-for="menu in menus" :key="menu.id">
          <NuxtLink :to="menu.path">
            <SvgIcon :name="menu.icon" color="currentColor" />
             {{ menu.title }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <div class="site-control">
      <div class="h-9 w-9 rounded-full overflow-hidden mr-4 cursor-pointer" v-if="isLogin">
        <img :src="$config.avatar" alt="avatar" class="h-full w-full object-cover">
      </div>
      <div 
        class="px-4 py-2 mr-4 outline outline-2 outline-primary rounded-full 
          text-primary-600 
          cursor-pointer
          hover:outline-primary-light
          hover:text-primary-light
          dark:text-gray-100
          dark:outline-gray-100
          dark:hover:outline-gray-200
          dark:hover:text-gray-200"
        @click="goLogin"
        v-else
      >
        登录
      </div>
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

