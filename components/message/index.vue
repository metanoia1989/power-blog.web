<script setup>
import { ref, onMounted, computed } from 'vue'

// Props
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'info',
  },
  duration: {
    type: Number,
    default: 3000,
  },
  showClose: {
    type: Boolean,
    default: false,
  },
  onClose: {
    type: Function,
    default: () => {},
  },
})

// Refs
const visible = ref(false)
const timer = ref(null)

// Computed
const iconClass = computed(() => `icon-${props.type}`)

// Methods
const show = () => {
  visible.value = true
  if (props.duration > 0) {
    timer.value = setTimeout(() => {
      close()
    }, props.duration)
  }
}

const close = () => {
  visible.value = false
}

const afterLeave = () => {
  clearTimeout(timer.value)
  props.onClose()
  const el = document.getElementsByClassName('message')[0]
  el.parentNode.removeChild(el)
}

// Lifecycle
onMounted(() => {
  show()
})
</script>

<template>
  <transition name="message" @after-leave="afterLeave">
    <div v-show="visible" class="message" :class="type">
      <div class="content">
        <i :class="iconClass" />
        <span>{{ content }}</span>
      </div>
      <i v-if="showClose" class="close-btn" @click="close">×</i>
    </div>
  </transition>
</template>

<style lang="scss">
.message {
  position: fixed;
  display: flex;
  align-items: center;
  gap: 8px;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 16px;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  z-index: 9999;
  &.info {
    background-color: #1890ff;
  }
  &.success {
    background-color: #52c41a;
  }
  &.warning {
    background-color: #faad14;
  }
  &.error {
    background-color: #f5222d;
  }
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      margin-right: 8px;
      font-size: 16px;
    }
  }
  .close-btn {
    color: #fff;
    cursor: pointer;
    font-size: 14px;
  }
}
.message-enter-active,
.message-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.message-enter,
.message-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}
</style>
