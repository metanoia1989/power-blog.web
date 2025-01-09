import { createApp } from 'vue'
import Message from './index.vue'

let seed = 1
const instances = []

const MessagePlugin = function (options) {
  options = options || {}
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
  instance.id = id
  document.body.appendChild(container)
  
  instances.push(instance)
  return instance
}

MessagePlugin.close = function (id, onClose) {
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
export const install = (app) => {
  app.config.globalProperties.$message = MessagePlugin
}

export default MessagePlugin
