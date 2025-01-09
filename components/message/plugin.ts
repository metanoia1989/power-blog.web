import { createApp } from 'vue'
import Message from './index.vue'

interface MessageOptions {
  content: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  showClose?: boolean
  onClose?: () => void
}

let seed = 1
const instances: any[] = []

const MessagePlugin = function (options: MessageOptions | string) {
  // 支持直接传入字符串作为 content
  if (typeof options === 'string') {
    options = {
      content: options
    }
  }

  const id = `message_${seed++}`
  const onClose = options.onClose

  options.onClose = function () {
    MessagePlugin.close(id, onClose)
  }

  // 创建新的应用实例
  const messageApp = createApp(Message, {
    ...options,
  })
  
  // 挂载到新的 div 元素
  const container = document.createElement('div')
  const instance = messageApp.mount(container)
  
  // 保存实例信息
  // @ts-ignore
  instance.id = id
  document.body.appendChild(container)
  
  instances.push(instance)
  return instance
}

// 添加便捷方法
MessagePlugin.info = (content: string, options?: Omit<MessageOptions, 'content' | 'type'>) => {
  return MessagePlugin({ content, type: 'info', ...options })
}

MessagePlugin.success = (content: string, options?: Omit<MessageOptions, 'content' | 'type'>) => {
  return MessagePlugin({ content, type: 'success', ...options })
}

MessagePlugin.warning = (content: string, options?: Omit<MessageOptions, 'content' | 'type'>) => {
  return MessagePlugin({ content, type: 'warning', ...options })
}

MessagePlugin.error = (content: string, options?: Omit<MessageOptions, 'content' | 'type'>) => {
  return MessagePlugin({ content, type: 'error', ...options })
}

MessagePlugin.close = function (id: string, onClose?: (instance: any) => void) {
  const index = instances.findIndex(instance => instance.id === id)
  if (index === -1) return
  
  const instance = instances[index]
  if (typeof onClose === 'function') {
    onClose(instance)
  }
  instances.splice(index, 1)
}

MessagePlugin.closeAll = function () {
  instances.forEach(instance => {
    instance.close()
  })
}

// 为了在 Vue 应用中使用
export const install = (app: any) => {
  app.config.globalProperties.$message = MessagePlugin
}

export default MessagePlugin
