import type { Router } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { isEmptyObject } from '@/utils/validate'
import { isWeixin } from '@/utils/util'

/**
 * 原来是 Nuxt 的 middleware/route.global.ts，语义保持不变：
 *  1. 微信浏览器一律跳到 /wechat-tip
 *  2. 首次进入拉站点配置
 *  3. 已登录但没用户信息时补拉用户信息
 */
export function setupRouterGuards(router: Router) {
    // 原来 Nuxt 里是在 app.vue 里监听 route 设置 document.title，
    // 但 SPA 首次导航是在 mount 之后才 resolve 的，放在 afterEach 最稳。
    router.afterEach((to) => {
        if (to.meta?.title) {
            window.document.title = to.meta.title as string
        }
    })

    router.beforeEach(async (to) => {
        if (isWeixin() && to.path !== '/wechat-tip') {
            return {
                path: '/wechat-tip',
                query: {
                    redirect: window?.location?.href || to.fullPath
                }
            }
        }

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
            console.log('router guard error', error)
            userStore.$reset()
        }
    })
}
