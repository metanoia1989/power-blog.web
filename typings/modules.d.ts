declare module '#app' {
  interface NuxtApp {
    $message: {
      (options: {
        content: string
        type?: 'info' | 'success' | 'warning' | 'error'
        duration?: number
        showClose?: boolean
      }): void
      close: (id: string, onClose?: Function) => void
      closeAll: () => void
    }
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: {
      (options: {
        content: string
        type?: 'info' | 'success' | 'warning' | 'error'
        duration?: number
        showClose?: boolean
      }): void
      close: (id: string, onClose?: Function) => void
      closeAll: () => void
    }
  }
}

export {}
