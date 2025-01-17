<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
      <div class="flex justify-center">
        <img src="/PowerBrand.svg" alt="PowerBlog" class="h-12 w-auto" />
      </div>
      <div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">注册账户</h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-4">

          <BaseInput
            id="nickname"
            label="昵称"
            v-model="nickname"
            placeholder="请输入昵称"
            required
          />
          <BaseInput
              id="email"
              label="邮箱地址"
              type="email"
              v-model="email"
              placeholder="请输入邮箱地址"
              :show-clear="true"
              required
              />
          <div class="flex items-center">
            <div class="flex-1">
              <BaseInput
                id="activeCode"
                label="邮箱验证码"
                type="text"
                v-model="activeCode"
                placeholder="请输入邮箱验证码"
                :show-clear="true"
                required
              />
            </div>
            <div class="p-2">
              <VerificationCode
                ref="verificationCodeRef"
                @click-get="handleSendActiveCode"
              />
            </div>
          </div>


          <BaseInput
            id="password"
            label="密码"
            type="password"
            v-model="password"
            placeholder="请输入密码"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </div>
      </form>
      <div class="text-center">
        <NuxtLink to="/auth/login" class="text-sm text-primary hover:text-primary-dark">
          已有账户？立即登录
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { useUserStore } from '@/stores/user'
import { sendActiveCode, register } from '@/api/account'

definePageMeta({
  layout: 'blank'
})

const { $message } = useNuxtApp()

const userStore = useUserStore()
const nickname = ref('')
const email = ref('')
const activeCode = ref('')
const password = ref('')
const loading = ref(false)
const verificationCodeRef = shallowRef()

const handleSendActiveCode = async () => {
  await sendActiveCode({ email: email.value })
  verificationCodeRef.value?.start()
}

const handleRegister = async () => {
  loading.value = true

  try {
    const res = await register({
      account: email.value,
      name: nickname.value,
      code: activeCode.value,
      password: password.value
    })

    userStore.login(res.token)
    userStore.setUser(res.user)
    loading.value = false

    $message({
      content: '注册成功',
      type: 'success',
    })

    setTimeout(() => {
      navigateTo('/')
    }, 800)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="postcss">

</style>
