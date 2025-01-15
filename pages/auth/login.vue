<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
      <div class="flex justify-center">
        <img src="/PowerBrand.svg" alt="PowerBlog" class="h-15 w-auto" />
      </div>
      <div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">帐号登陆</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="username" class="sr-only">帐号</label>
            <input
              id="username"
              v-model="username"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border-solid border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="请输入用户名或邮箱"
            />
          </div>
          <div>
            <label for="password" class="sr-only">密码</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border-solid border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="请输入密码"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>
      </form>
      <div class="text-center">
        <NuxtLink to="/auth/register" class="text-sm text-primary hover:text-primary-dark">
          还没有账户？立即注册
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user'


definePageMeta({
  layout: 'blank'
})

const userStore = useUserStore()
const username = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  try {
    // loading.value = true
    // let res = await userStore.login({
    //   username: username.value,
    //   password: password.value
    // })

    // useNotify('Success', '登录成功', 1, 2)

    // // 登录成功后跳转
    // navigateTo('/')
  } catch (error) {
    console.error('登录失败:', error)
    // @ts-ignore
    useErrorAlert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="postcss">

</style>
