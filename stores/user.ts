import { getUserCenter } from '@/api/user'
import { login, logout } from '@/api/account'
import { TOKEN_KEY } from '@/enums/cacheEnums'
import { defineStore } from 'pinia'
import { getCookie, setCookie } from '@/utils/cookie'

interface UserState {
    userInfo: Record<string, any>
    temToken: string | null
    /** token 的响应式副本，真实存储仍在 cookie 里（原来用 useCookie 的 ref） */
    tokenValue: string | null
}

export const useUserStore = defineStore('userStore', {
    state: (): UserState => {
        return {
            userInfo: {},
            temToken: null,
            tokenValue: getCookie(TOKEN_KEY)
        }
    },

    getters: {
        token(): string | null {
            return this.tokenValue || null
        },
        isLogin(): boolean {
            return !!this.token
        }
    },

    actions: {
        async getUser() {
            const data = await getUserCenter()
            this.userInfo = data
        },

        setUser(userInfo: any) {
            this.userInfo = userInfo
        },

        login(tokenValue: string) {
            this.tokenValue = tokenValue
            setCookie(TOKEN_KEY, tokenValue, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                secure: true,
                sameSite: 'lax'
            })
        },

        logout() {
            this.tokenValue = null
            setCookie(TOKEN_KEY, null)
            this.userInfo = {}
        }
    }
})
