import { getUserCenter } from '@/api/user'
import { login, logout } from '@/api/account'
import { TOKEN_KEY } from '@/enums/cacheEnums'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

interface UserSate {
    userInfo: Record<string, any>
    token: string | null
    temToken: string | null
}
export const useUserStore = defineStore('userStore', {
    state: (): UserSate => {
        const TOKEN = useStorage(TOKEN_KEY, '')
        return {
            userInfo: {},
            token: TOKEN.value || null,
            temToken: null
        }
    },
    getters: {
        isLogin: (state) => !!state.token
    },
    actions: {
        async getUser() {
            const data = await getUserCenter()
            this.userInfo = data
        },
        setUser(userInfo: any) {
            this.userInfo = userInfo
        },
        login(token: string) {
            const TOKEN = useStorage(TOKEN_KEY, '')
            this.token = token
            TOKEN.value = token
        },
        logout() {
            const TOKEN = useStorage(TOKEN_KEY, '')
            this.token = '' 
            this.userInfo = {}
            TOKEN.value = ''
        }
    }
})
