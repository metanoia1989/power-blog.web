import { isMobile } from './util'

/**
 * 原来读的是 Nuxt runtimeConfig，现在读 Vite 的 import.meta.env。
 * 变量在 .env / .env.production 里配置，必须以 VITE_ 开头。
 */
export const runtimeConfig = {
    public: {
        apiUrl: import.meta.env.VITE_API_URL as string,
        apiPrefix: (import.meta.env.VITE_API_PREFIX as string) || '',
        version: (import.meta.env.VITE_APP_VERSION as string) || '',
        baseUrl: (import.meta.env.VITE_BASE_URL as string) || '/'
    }
}

/**
 * @description 获取客户端类型
 */
export function getClient() {
    // 检测是手机访问还是电脑访问
    return isMobile() ? 3 : 4
}

/**
 * @description 获取版本号
 */
export function getVersion() {
    return runtimeConfig.public.version
}

/**
 * @description 获取请求域名
 */
export function getApiUrl() {
    return runtimeConfig.public.apiUrl
}

/**
 * @description 获取请求前缀
 */
export function getApiPrefix() {
    return runtimeConfig.public.apiPrefix
}
