<template>
    <ElConfigProvider v-bind="config">
        <NuxtLayout>
            <NuxtPage :transition="{
                name: transitionName,
            }" />
        </NuxtLayout>
    </ElConfigProvider>
</template>

<script lang="ts" setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { ref, watch, computed } from 'vue'
import { useRoute } from '#app'

const config = {
    locale: zhCn
}
const transitionName = ref('slide-left')
const route = useRoute()


// 在 app.vue 中，由于它是应用的最外层组件，在某些生命周期中 Pinia 可能还没有完全初始化。
// 1. 使用 useState 替代 Pinia store（推荐）
// 2. 将 Pinia store 的使用延迟到 onMounted 生命周期

// 替换 Pinia store 为 useState
const prevRoute = useState('prevRoute', () => null)

// 替换 appStore.setPrevRoute
const setPrevRoute = (route: any) => {
  prevRoute.value = route
}

// Watch
watch(
  () => route,
  // @ts-ignore
  (to) => {
    if (import.meta.client && to.meta?.title) {
      // @ts-ignore
      window.document.title = to.meta?.title
    }

    if (!prevRoute.value) {
      setPrevRoute({ ...to })
      return
    }

    if (to.path === prevRoute.value.path) return

    const toIndex = to.meta.index || 0
    const fromIndex = prevRoute.value?.meta?.index || 0

    transitionName.value = toIndex > fromIndex ? 'slide-left' : 'slide-right'
    setPrevRoute({ ...to })
  },
  { deep: true }
)

</script>


<style lang="scss" scoped> 
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
