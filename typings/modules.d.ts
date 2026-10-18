/**
 * 全局注入的类型声明。
 * 原来还声明了 Nuxt 的 '#app' 模块，迁移后已删除。
 */
export interface MessageInstance {
    (options: {
        content: string
        type?: 'info' | 'success' | 'warning' | 'error'
        duration?: number
        showClose?: boolean
    }): void
    close: (id: string, onClose?: Function) => void
    closeAll: () => void
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $message: MessageInstance
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $message: MessageInstance
    }
}

export {}
