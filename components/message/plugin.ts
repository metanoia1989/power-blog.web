import { createVNode, render } from 'vue'
import Message from './index.vue'

let seed = 1
const instances: { id: string, container: HTMLElement, height: number }[] = []
const GAP = 16  // 消息之间的间距

// 更新所有消息的位置
const updateMessagePositions = () => {
  let currentTop = 16  // 初始顶部距离
  instances.forEach(instance => {
    const element = instance.container.firstElementChild as HTMLElement
    if (element) {
      element.style.top = `${currentTop}px`
      // 更新当前实例的高度
      instance.height = element.offsetHeight
      currentTop += instance.height + GAP
    }
  })
}

const MessagePlugin = function (options: any) {
  options = options || {}
  const id = `message_${seed++}`
  const onClose = options.onClose

  const container = document.createElement('div')
  
  const props = {
    ...options,
    id,
    onDestroy: () => {
      render(null, container)
      container.remove()
      const index = instances.findIndex(instance => instance.id === id)
      if (index !== -1) {
        instances.splice(index, 1)
      }
      onClose?.()
      // 更新剩余消息的位置
      updateMessagePositions()
    }
  }

  const vnode = createVNode(Message, props)
  render(vnode, container)
  document.body.appendChild(container)
  
  // 添加新实例时，先用0作为临时高度
  instances.push({ id, container, height: 0 })
  
  // 使用 nextTick 确保 DOM 已更新
  setTimeout(() => {
    updateMessagePositions()
  }, 0)

  return {
    close: () => {
      const vnode = document.querySelector(`[data-message-id="${id}"]`)
      if (vnode) {
        props.onDestroy()
      }
    }
  }
}

MessagePlugin.close = function (id: string, onClose?: Function) {
  const instance = instances.find(instance => instance.id === id)
  if (instance) {
    render(null, instance.container)
    instance.container.remove()
    const index = instances.findIndex(i => i.id === id)
    if (index !== -1) {
      instances.splice(index, 1)
    }
    onClose?.()
    updateMessagePositions()
  }
}

MessagePlugin.closeAll = function () {
  instances.forEach(({ container }) => {
    render(null, container)
    container.remove()
  })
  instances.length = 0
}

export default MessagePlugin
