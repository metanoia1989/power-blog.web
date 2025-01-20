import { useAppStore } from '~~/stores/app'
import { useUserStore } from '~~/stores/user'
import { isEmptyObject } from '~~/utils/validate'
import { isWeixin } from '~~/utils/util'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore()
    const appStore = useAppStore()

    // 检查是否是微信浏览器且不是已经在提示页面
    if (isWeixin() && to.path !== '/wechat-tip') {
        return navigateTo({
            path: '/wechat-tip',
            query: {
                redirect: window?.location?.href || to.fullPath
            }
        })
    }

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
