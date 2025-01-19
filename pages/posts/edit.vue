<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useEditorStore } from '~/stores/editor'
import { useArticleStore } from '~/stores/article'
import { uploadImage } from '~/api/app'
import { deleteArticle, getArticleById } from '~/api/article'
import { VisibilityMap } from '~/enums/visibilityEnums'
import { useRoute, useRouter, useNuxtApp } from '#app'

definePageMeta({
    layout: 'blank',
})

const route = useRoute()
const router = useRouter()
const editorStore = useEditorStore()
const articleStore = useArticleStore()
const { $message } = useNuxtApp()

const showSidebar = ref(false)
const isLoading = ref(false)
const formData = ref(editorStore.getArticleDraft())
const categories = computed(() => articleStore.categories)

const isEdit = computed(() => !!route.query?.id)

const visibilityOptions = Object.entries(VisibilityMap).map(([value, label]) => ({
  value,
  label
}))

const handleBack = () => {
  router.back()
}

const handleSave = async () => {
  isLoading.value = true
  try {
    // Save logic here
    if (!isEdit.value) {
      editorStore.saveArticleDraft(formData.value)
    }
  } finally {
    isLoading.value = false
  }
}

const handlePublish = async () => {
  await handleSave()
  router.back()
}

const handleImageUpload = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const result = await uploadImage(formData)
  return result.url
}

const handleTitleChange = async (e: Event) => {
  const textarea = e.target as HTMLTextAreaElement
  textarea.style.height = `${textarea.scrollHeight}px`
  
  // 标题高度变化后，重新计算编辑器高度
  handleEditorChange()
  
  if (!formData.value.slug) {
    formData.value.slug = await editorStore.generateSlug(formData.value.title)
  }
}

const handleDelete = async () => {
  if (isEdit.value) {
    await deleteArticle(Number(route.query.id))
    // 检查路由历史
    const from = router.options.history.state.back
    if (from) {
      router.back() // 有来源页面则返回上一页
    } else {
      router.replace('/') // 无来源页面则返回首页
    }

  }
}

const getCategoriesFn = async () => {
  if (categories.value.length != 0) {
    return Promise.resolve()
  }
  try {
    await articleStore.getCategories()
  } catch (err) {
    $message({
      content: '获取分类失败',
      type: 'error',
    })
    throw new Error(err)
  }
}

const handleEditorChange = () => {
  nextTick(() => {
    const editor = document.querySelector('.v-md-editor .vuepress-markdown-body')
    if (editor) {
      // 计算视口剩余高度
      const viewportHeight = window.innerHeight
      const headerHeight = 64 // 顶部固定导航栏高度 (h-16 = 64px)
      const titleOffset = document.querySelector('.editor-title')?.getBoundingClientRect().bottom || 0
      const minHeight = viewportHeight - headerHeight - titleOffset - 32 // 32px for padding
      
      // 取实际内容高度和最小高度的较大值
      const height = Math.max(minHeight, editor.scrollHeight + 100)
      
      const vmdEditor = document.querySelector('.v-md-editor') as HTMLElement
      if (vmdEditor) {
        vmdEditor.style.height = `${height}px`
      }
    }
  })
}

getCategoriesFn()

onMounted(async () => {
  if (isEdit.value) {
    const article = await getArticleById(Number(route.query.id))
    formData.value = {
        plaintext: article.plaintext,
        title: article.title,
        feature_image: article.feature_image,
        slug: article.slug,
        visibility: article.visibility,
        is_show: article.is_show,
        category_id: article.category_id
    }
    
    // 等待 DOM 更新后计算标题高度
    nextTick(() => {
      const textarea = document.querySelector('.editor-title') as HTMLTextAreaElement
      if (textarea) {
        textarea.style.height = `${textarea.scrollHeight}px`
      }
      handleEditorChange()
    })
  }
})
</script>

<template>
  <div class="bg-white">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center justify-between px-4 z-10">
      <button @click="handleBack" class="p-2">
        <SvgIcon name="back" class="w-6 h-6" />
      </button>
      <div class="flex items-center gap-4">
        <button @click="handleSave" class="btn btn-outline">保存</button>
        <button @click="handlePublish" class="btn btn-primary">发布</button>
        <button @click="showSidebar = true" class="p-2">
          <SvgIcon name="tiaojie" class="w-6 h-6" />
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="h-[calc(100vh-4rem)] mt-16 md:pt-4 md:px-4 max-w-4xl mx-auto flex flex-col">
      <div class="flex-1 flex flex-col space-y-6 md:py-6">
        <!-- Title -->
        <div class="max-md:px-4 max-md:pt-4">
            <textarea
                v-model="formData.title"
                placeholder="输入文章标题" 
                class="editor-title "
                @input="handleTitleChange"
                />

        </div>

        <!-- Editor -->
        <div class="flex-1">
            <v-md-editor
            v-model="formData.plaintext"
            :height="'auto'"
            mode="edit"
            :toc-nav-position-right="true"
            :default-show-toc="false"
            :default-show-preview="false"
            @upload-image="handleImageUpload"
            @change="handleEditorChange"
            />
        </div>
      </div>
    </main>

    <!-- Sidebar -->
    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-mask bg-opacity-50 z-20"
      @click="showSidebar = false"
    />
    <aside
      :class="['fixed top-0 right-0 w-80 h-full bg-white shadow-xl z-30 transform transition-transform overflow-y-auto', 
        showSidebar ? 'translate-x-0' : 'translate-x-full']"
    >
      <div class="p-6 space-y-6">
        <h3 class="text-lg font-bold">文章设置</h3>
        
        <div class="space-y-6">
          <!-- Cover Image Section -->
          <div class="space-y-2">
            <label class="block text-sm font-medium">封面图片</label>
            <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden border">
              <img v-if="formData.feature_image" :src="formData.feature_image" class="w-full h-full object-cover" />
            </div>
            <input
              v-model="formData.feature_image"
              type="text"
              placeholder="输入封面图片链接"
              class="w-full px-3 py-2 border-solid border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium">文章别名</label>
            <input
              v-model="formData.slug"
              type="text"
              class="w-full px-3 py-2 border-solid border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium">分类</label>
            <select
              v-model="formData.category_id"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" :selected="!formData.category_id">请选择分类</option>
              <option v-for="category in categories" :key="category.id" :value="category.id" :selected="formData.category_id === category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium">显示状态</label>
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <input
                  v-model="formData.is_show"
                  type="radio"
                  :value="1"
                  class="w-6 h-6 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label class="ml-2 text-sm">显示</label>
              </div>
              <div class="flex items-center">
                <input
                  v-model="formData.is_show"
                  type="radio"
                  :value="0" 
                  class="w-6 h-6 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label class="ml-2 text-sm">隐藏</label>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium">可见性</label>
            <select
              v-model="formData.visibility"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option v-for="option in visibilityOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <button
            v-if="isEdit"
            @click="handleDelete"
            class="w-full px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
          >
            删除文章
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<style lang="scss" scoped>
@use './edit.scss';
</style>
