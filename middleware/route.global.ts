import { useAppStore } from '~~/stores/app'
import { useUserStore } from '~~/stores/user'
import { isEmptyObject } from '~~/utils/validate'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore()
    const appStore = useAppStore()
    try {
        if (isEmptyObject(appStore.config) || !appStore.isInit) {
            await appStore.getConfig()
        }
        if (userStore.isLogin && isEmptyObject(userStore.userInfo)) {
            await userStore.getUser()
        }
    } catch (error) {
        console.log('route.global.ts', error)
        userStore.$reset()
    }
})
