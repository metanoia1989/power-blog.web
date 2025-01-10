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
import { ID_INJECTION_KEY, ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { ref, watch } from 'vue'
import { useRoute } from '#app'

provide(ID_INJECTION_KEY, {
    prefix: 100,
    current: 0
})
const config = {
    locale: zhCn
}
const transitionName = ref('slide-left')
const route = useRoute()

// Watch
watch(
  () => route,
  (to, from) => {
    if (to.path === from?.path) return
    
    const toIndex = to.meta.index || 0
    const fromIndex = from?.meta?.index || 0
    
    transitionName.value = toIndex > fromIndex ? 'slide-left' : 'slide-right'
  },
  { deep: true }  // 需要深度监听
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
