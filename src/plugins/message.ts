import type { App } from 'vue'
import MessagePlugin from '@/components/message/plugin'

/**
 * 页面里到处都在用 $message({ content, type })，保留这个全局注入。
 */
export function setupMessage(app: App) {
    app.config.globalProperties.$message = MessagePlugin
    app.provide('$message', MessagePlugin)
}
