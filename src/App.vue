<template>
    <ElConfigProvider v-bind="config">
        <component :is="layoutComponent">
            <RouterView v-slot="{ Component }">
                <Transition :name="transitionName" mode="out-in">
                    <component :is="Component" />
                </Transition>
            </RouterView>
        </component>
    </ElConfigProvider>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const config = {
    locale: zhCn
}

/**
 * 等价于 Nuxt 的布局机制：layouts/<name>.vue，路由 meta.layout 决定用哪个，
 * 不写就用 default。
 */
const layoutModules = import.meta.glob<any>('../layouts/*.vue', { eager: true })
const layouts: Record<string, any> = {}
for (const [path, mod] of Object.entries(layoutModules)) {
    const name = path.slice(path.lastIndexOf('/') + 1).replace(/\.vue$/, '')
    layouts[name] = mod.default ?? mod
}

const route = useRoute()
const router = useRouter()

const layoutComponent = computed(() => {
    const name = (route.meta?.layout as string) || 'default'
    return layouts[name] || layouts.default
})

/**
 * 按照路由 meta.index 的大小决定页面左右滑动的方向。
 * 注意：SPA 首次导航是在 mount 之后才 resolve 的（守卫里还要拉接口），
 * 所以要用 router.isReady() 来记录"起点"，否则会把 START_LOCATION 当成上一页。
 */
const transitionName = ref('slide-left')
let seeded = false
let prevPath: string | null = null
let prevIndex = 0

function applyTransition() {
    // route.name 为空说明还是 vue-router 的 START_LOCATION
    if (!route.name) return

    const currentIndex = Number(route.meta?.index ?? 0)

    if (!seeded) {
        seeded = true
        prevPath = route.path
        prevIndex = currentIndex
        return
    }

    if (prevPath !== route.path) {
        transitionName.value = currentIndex > prevIndex ? 'slide-left' : 'slide-right'
    }
    prevPath = route.path
    prevIndex = currentIndex
}

watch(() => route.fullPath, applyTransition, { immediate: true })
router.isReady().then(applyTransition)
</script>

<style lang="scss" scoped>
.slide-left-enter-from,
.slide-right-leave-to {
    opacity: 0;
    transform: translate(30px, 0);
}

.slide-left-leave-to,
.slide-right-enter-from {
    opacity: 0;
    transform: translate(-30px, 0);
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.3s ease;
}
</style>
