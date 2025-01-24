import { isMobile } from "./util"

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
    return useRuntimeConfig().public.version
}

/**
 * @description 获取请求域名
 */
export function getApiUrl() {
    return useRuntimeConfig().public.apiUrl
}

/**
 * @description 获取请求前缀
 */
export function getApiPrefix() {
    return useRuntimeConfig().public.apiPrefix
}
