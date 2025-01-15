import { useRoute, useRouter } from '#app'
import { useAppStore } from '~/stores/app'

export default function usePagination() {
    const route = useRoute()
    const router = useRouter()
    const appStore = useAppStore()
    const $config = computed(() => appStore.config)

    const _pageNo = ref(route.query.page ? Number(route.query.page) : 1)
    const currentPage = computed({
        get: () => {
            return _pageNo.value
        },
        set: (val) => {
            _pageNo.value = val
            router.push({ query: { ...route.query, page: Number(val) } })
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        }
    })

    const _pageSize = ref(route.query.page_size ? Number(route.query.page_size) : $config.value.pageSize)
    const pageSize = computed({
        get: () => _pageSize.value,
        set: (val) => {
            _pageSize.value = val
            router.push({ query: { ...route.query, page_size: Number(val) } })
        }
    })

    return {
        currentPage,
        pageSize
    }
}
