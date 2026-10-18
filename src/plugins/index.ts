import type { App } from 'vue'
import { setupElementPlus } from './element-plus'
import { setupMessage } from './message'
import { setupEditor } from './editor'
import { setupFetch } from './fetch'
import { setupMathJax } from './mathjax'
import { setupRouterGuards } from '@/src/router/guards'
import router from '@/src/router'

/**
 * 原来 Nuxt 的 plugins/ + middleware/ 都收敛到这里，由 main.ts 显式调用。
 */
export function setupPlugins(app: App) {
    setupElementPlus(app)
    setupMessage(app)
    setupEditor(app)
    setupFetch(app)
    setupMathJax(app)
    setupRouterGuards(router)
}
