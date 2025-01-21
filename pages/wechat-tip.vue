<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center space-y-8">
      <div class="text-red-500 text-2xl md:text-3xl mb-8">
        ⚠️ 本网站禁止微信浏览器访问
      </div>
      <div class="text-gray-600 text-lg md:text-xl mb-8">
        请复制以下链接，使用浏览器访问
      </div>
      <div class="space-y-4">
        <div class="w-full px-4 py-3 text-left border rounded-lg bg-gray-50 text-base md:text-lg break-all">
          {{ targetUrl }}
        </div>
        <button 
          @click="copyUrl"
          class="w-full px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-base md:text-lg transition-colors"
        >
          复制链接
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useRoute } from '#app'

definePageMeta({
  layout: 'blank',
  title: '禁止微信浏览器访问',
})

const { $message } = useNuxtApp();
const route = useRoute()
const targetUrl = ref(route.query.redirect as string || '/')

const copyUrl = () => {
  navigator.clipboard.writeText(targetUrl.value)
    .then(() => {
      $message({ content: '链接已复制', type: 'success' })
    })
    .catch(() => {
      $message({ content: '复制失败，请手动复制', type: 'error' })
    })
}
</script> 
