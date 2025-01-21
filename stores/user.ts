import { getUserCenter } from '@/api/user'
import { login, logout } from '@/api/account'
import { TOKEN_KEY } from '@/enums/cacheEnums'
import { defineStore } from 'pinia'
import { useCookie } from '#app'

interface UserState {
    userInfo: Record<string, any>
    temToken: string | null
}

export const useUserStore = defineStore('userStore', {
    state: (): UserState => {
        return {
            userInfo: {},
            temToken: null
        }
    },
    
    getters: {
        token(): string | null {
            return useCookie(TOKEN_KEY).value || null
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
            const tokenCookie = useCookie(TOKEN_KEY, {
                maxAge: 60 * 60 * 24 * 7, // 7 days
                secure: true,
                sameSite: 'lax'
            })
            tokenCookie.value = tokenValue
        },
        
        logout() {
            const tokenCookie = useCookie(TOKEN_KEY)
            tokenCookie.value = null
            this.userInfo = {}
        }
    }
})
