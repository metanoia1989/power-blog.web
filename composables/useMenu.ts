import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NAVBAR, SIDEBAR } from '@/constants/menu'

// 原来是 Nuxt 的 useState(Nuxt 的跨组件共享 ref)，这里用一个模块级 ref 就够了
const menu = ref(NAVBAR)

export default function useMenu() {
    const route = useRoute()
    const sidebar = computed(() => getSidebar(route.meta.module as string))
    const hasSidebar = computed(() => sidebar.value.length)
    return {
        menu,
        sidebar,
        hasSidebar
    }
}

function getSidebar(module?: string): any[] {
    const queue: any[] = []
    SIDEBAR.forEach((item) => queue.push(item))
    while (queue.length) {
        const item = queue.shift()
        if (item.module && item.module == module) {
            return item.children
        }
        item.children && item.children.forEach((child: any) => queue.push(child))
    }
    return []
}
