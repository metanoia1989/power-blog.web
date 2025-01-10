<script setup>
import { ref, onMounted } from 'vue'
import { useArticleStore } from '@/stores/article'
import IdeaItem from '@/components/idea_item/index.vue'
import { useNuxtApp } from '#app'

const { $message } = useNuxtApp()
const store = useArticleStore()

definePageMeta({
  index: 2,
  title: '絮絮叨叨',
})

// 状态
const ideas = ref([])
const loading = ref(true)

// 方法
const getInspirationCount = async () => {
  try {
    return await store.getWeiboListCount()
  } catch (err) {
    $message({
      content: '获取灵感总数失败',
      type: 'error',
    })
    throw new Error(err)
  }
}

const getInspiration = async () => {
  try {
    const totalCount = await getInspirationCount()
    ideas.value = await store.fetchWeiboList({
      page: 1,
      pageSize: totalCount
    })
  } catch (err) {
    $message({
      content: '获取灵感失败',
      type: 'error',
    })
    throw new Error(err)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  getInspiration()
})
</script>

<template>
  <div class="inspiration-wrap">
    <div class="inspiration">
      <h2><SvgIcon name="tongzhi" /> 絮絮叨叨</h2>
      <div v-loading="loading" class="ideas-wrap">
        <transition name="from-bottom">
          <div v-if="!loading">
            <div v-for="idea in ideas" :key="idea.id" class="idea-item">
              <IdeaItem
                :idea="idea.body"
                :create="idea.created_at.slice(0, 10)"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
