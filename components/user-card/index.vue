<script setup>
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { logout } from '@/api/account'

const userStore = useUserStore()
const appStore = useAppStore()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const handleLogout = async () => {
  await logout()
  userStore.logout()
  emit('close')
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}
</script>

<template>
  <div v-if="show" 
       class="user-card absolute right-0 top-12 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50">
    <div class="flex items-center space-x-4 mb-4">
      <img :src="appStore.config.avatar" 
           class="w-12 h-12 rounded-full object-cover" 
           alt="用户头像">
      <div class="flex-1">
        <h3 class="font-medium text-gray-900 dark:text-white">
          {{ userStore.userInfo.name }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ userStore.userInfo.email }}
        </p>
      </div>
    </div>
    <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
      <button 
        @click="handleLogout"
        class="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 
               hover:bg-red-50 dark:hover:bg-red-900/20 
               rounded-md transition-colors">
        退出登录
      </button>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 
