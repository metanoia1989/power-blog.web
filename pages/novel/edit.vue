<template>
    <div class="bg-white min-h-screen">
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
        <main class="min-h-[calc(100vh-4rem)] mt-16 md:pt-4 md:px-4 max-w-4xl mx-auto flex flex-col">
            <div class="flex-1 flex flex-col space-y-6 md:py-6">
                <!-- Title -->
                <div class="max-md:px-4 max-md:pt-4">
                    <textarea v-model="formData.title" placeholder="输入小说标题" class="editor-title"
                        @input="handleTitleChange" @blur="handleTitleBlur" />
                </div>

                <!-- Description -->
                <div class="flex-1 max-md:px-4">
                    <textarea v-model="formData.description" placeholder="输入小说简介" 
                        class="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"></textarea>
                </div>
            </div>
        </main>

        <!-- Sidebar -->
        <div v-if="showSidebar" class="fixed inset-0 bg-mask bg-opacity-50 z-20" @click="showSidebar = false" />
        <aside :class="['fixed top-0 right-0 w-80 h-full bg-white shadow-xl z-30 transform transition-transform overflow-y-auto',
            showSidebar ? 'translate-x-0' : 'translate-x-full']">
            <div class="p-6 space-y-6">
                <h3 class="text-lg font-bold">小说设置</h3>

                <div class="space-y-6">
                    <!-- Cover Image Section -->
                    <div class="space-y-2">
                        <label class="block text-sm font-medium">封面图片</label>
                        <input v-model="formData.feature_image" type="text" placeholder="输入封面图片链接"
                            class="w-full px-3 py-2 border-solid border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        <div class="h-48 aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden border mx-auto">
                            <img v-if="formData.feature_image" :src="formData.feature_image"
                                class="h-full w-full object-cover" />
                            <div v-else class="flex items-center justify-center h-full w-full">
                                <span class="text-gray-500">暂无封面</span>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium">小说slug</label>
                        <input v-model="formData.slug" type="text"
                            class="w-full px-3 py-2 border-solid border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium">排序</label>
                        <input v-model="formData.sort" type="number"
                            class="w-full px-3 py-2 border-solid border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>


                    <div class="space-y-2">
                        <label class="block text-sm font-medium">可见性</label>
                        <select v-model="formData.visibility"
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option v-for="option in visibilityOptions" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>
                    </div>

                    <div v-if="formData.visibility === 'special_password'" class="space-y-2">
                        <label class="block text-sm font-medium">解锁密码</label>
                        <input v-model="formData.unlock_password" type="text" placeholder="设置解锁密码"
                            class="w-full px-3 py-2 border-solid border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium">显示状态</label>
                        <div class="flex items-center space-x-4">
                            <div class="flex items-center">
                                <input v-model="formData.is_show" type="radio" :value="1"
                                    class="w-6 h-6 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                <label class="ml-2 text-sm">显示</label>
                            </div>
                            <div class="flex items-center">
                                <input v-model="formData.is_show" type="radio" :value="0"
                                    class="w-6 h-6 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                <label class="ml-2 text-sm">隐藏</label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </aside>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useNovelStore } from '~/stores/novel'
import { addBook, editBook, getBookDetailsById } from '~/api/book'
import { VisibilityMap } from '~/enums/visibilityEnums'
import { useRouter, useRoute } from 'vue-router'
import { generateSlug } from '~/utils/write'
import $message from '@/components/message/plugin'


const route = useRoute()
const router = useRouter()
const novelStore = useNovelStore()
const showSidebar = ref(false)
const isLoading = ref(false)
const formData = ref({
    title: '',
    slug: '',
    description: '',
    feature_image: '',
    visibility: 'public',
    is_show: 1,
    unlock_password: '',
    sort: 100
})

const isEdit = computed(() => !!route.query?.id)

const visibilityOptions = Object.entries(VisibilityMap).map(([value, label]) => ({
    value,
    label
}))

// 获取小说详情
const getNovelDetail = async () => {
    formData.value = await getBookDetailsById(Number(route.query.id), 0)
}

const handleBack = () => {
    router.back()
}

const handleSave = async () => {
    isLoading.value = true
    try {
        if (isEdit.value) { 
            await editBook({ ...formData.value, id: Number(route.query.id) })
        } else {
            const { book } = await addBook(formData.value)
            router.replace(`/novel/edit?id=${book.id}`)
        }
    } catch (err) {
        $message({
            content: err ? err : '保存失败',
            type: 'error',
        })
        throw new Error(err)
    } finally {
        isLoading.value = false
    }
}

const handlePublish = async () => {
    await handleSave()
    router.back()
}

const handleTitleChange = async (e: Event) => {
    const textarea = e.target as HTMLTextAreaElement
    textarea.style.height = '0'
    textarea.style.height = `${textarea.scrollHeight}px`
}

const handleTitleBlur = async () => {
    if (formData.value.title && !formData.value.slug) {
        formData.value.slug = await generateSlug(formData.value.title)
    }
}

onMounted(async () => {
    if (isEdit.value) {
        await getNovelDetail()
    }
    // 等待 DOM 更新后计算标题高度
    nextTick(() => {
        const textarea = document.querySelector('.editor-title') as HTMLTextAreaElement
        if (textarea) {
            textarea.style.height = `${textarea.scrollHeight}px`
        }
    })
})
</script>

<style lang="scss" scoped>
@use './edit.scss';
</style>