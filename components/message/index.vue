<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  id: string
  content: string
  type?: string
  duration?: number
  showClose?: boolean
  onDestroy?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
  showClose: false,
  onDestroy: () => {},
})

const visible = ref(false)
const timer = ref<NodeJS.Timeout | null>(null)

const iconClass = computed(() => `icon-${props.type}`)

onMounted(() => {
  visible.value = true
  if (props.duration > 0) {
    timer.value = setTimeout(() => {
      close()
    }, props.duration)
  }
})

function close() {
  visible.value = false
}

function afterLeave() {
  if (timer.value) {
    clearTimeout(timer.value)
  }
  props.onDestroy?.()
}
</script>

<template>
  <transition name="message" @after-leave="afterLeave">
    <div 
      v-show="visible" 
      class="message" 
      :class="type"
      :data-message-id="id"
    >
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
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 16px;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  z-index: 9999;
  transition: top 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
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
.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%);
}
</style>
