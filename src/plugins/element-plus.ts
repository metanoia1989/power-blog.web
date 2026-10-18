import type { App } from 'vue'
import ElementPlus, { ElLoading, ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus'

export function setupElementPlus(app: App) {
    app.provide(ID_INJECTION_KEY, {
        prefix: 1024,
        current: 0
    })
    app.provide(ZINDEX_INJECTION_KEY, {
        current: 0
    })
    app.use(ElementPlus)
    // v-loading 指令（多个页面在用）
    app.use(ElLoading)
}
