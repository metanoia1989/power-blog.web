import { useRoute, useRouter } from '#app'
import { useAppStore } from '~/stores/app'

export default function usePagination() {
    const route = useRoute()
    const router = useRouter()
    const appStore = useAppStore()
    const $config = computed(() => appStore.config)
    const currentPage = computed({
        get: () => route.query.page ? Number(route.query.page) : 1,
        set: (val) => {
            router.push({ query: { ...route.query, page: Number(val) } })
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        }
    })
    const pageSize = computed({
        get: () => route.query.page_size ? Number(route.query.page_size) : $config.pageSize,
        set: (val) => {
            router.push({ query: { ...route.query, page_size: Number(val) } })
        }
    })
    return {
        currentPage,
        pageSize
    }
}
