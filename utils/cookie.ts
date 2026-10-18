/**
 * 替代 Nuxt 的 useCookie：就是一个普通的 cookie 读写工具。
 * 响应式交给 store 自己维护（见 stores/user.ts）。
 */
export interface CookieOptions {
    /** 有效期（秒） */
    maxAge?: number
    path?: string
    secure?: boolean
    sameSite?: 'lax' | 'strict' | 'none'
}

export function getCookie(key: string): string | null {
    if (typeof document === 'undefined') return null
    const target = `${encodeURIComponent(key)}=`
    const parts = document.cookie ? document.cookie.split('; ') : []
    for (const part of parts) {
        if (part.indexOf(target) === 0) {
            return decodeURIComponent(part.slice(target.length))
        }
    }
    return null
}

export function setCookie(key: string, value: string | null, options: CookieOptions = {}) {
    if (typeof document === 'undefined') return
    const { maxAge, path = '/', secure, sameSite } = options

    let cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value ?? '')}`
    cookie += `; path=${path}`
    if (maxAge !== undefined) {
        // 写 null 视为删除
        cookie += `; max-age=${value === null ? 0 : maxAge}`
    }
    if (secure && window.location.protocol === 'https:') cookie += '; secure'
    if (sameSite) cookie += `; samesite=${sameSite}`

    document.cookie = cookie
}

export function removeCookie(key: string, options: CookieOptions = {}) {
    setCookie(key, null, { ...options, maxAge: 0 })
}
