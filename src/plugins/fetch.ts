import type { App } from 'vue'
import { createRequest } from '@/utils/http'

/**
 * api/*.ts 里用的是全局 $request，这里把它挂到 globalThis 上。
 * 注意：必须在任何接口调用之前执行，所以放在 setupPlugins 里、mount 之前。
 */
export function setupFetch(_app: App) {
    const request = createRequest()
    // @ts-ignore 全局请求实例
    globalThis.$request = request
}
