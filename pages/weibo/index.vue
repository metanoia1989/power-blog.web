<script setup>
import { ref, onMounted } from 'vue'
import { useArticleStore } from '@/stores/article'
import IdeaItem from '@/components/idea_item/index.vue'
import Pagination from '@/components/pagination/index.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const $config = computed(() => appStore.config)
const store = useArticleStore()

definePageMeta({
  index: 2,
  title: '絮絮叨叨',
})

// 状态
const ideas = ref([])
const loading = ref(true)
const totalCount = ref(0)
const currentPage = ref(1)

// 方法
const pageChangeFn = () => {
  ideas.value = []
  loading.value = true
  getInspiration()
}

const getInspirationCount = async () => {
  try {
    totalCount.value = await store.getWeiboListCount()
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
    await getInspirationCount()
    ideas.value = await store.fetchWeiboList({
      page_no: currentPage.value,
      page_size: $config.pageSize
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
                :idea="idea.plaintext"
                :create="idea.created_at"
              />
            </div>
          </div>
        </transition>
      </div>
      <Pagination
        v-model:current-page="currentPage"
        :total="totalCount"
        :page-size="$config.pageSize"
        @pageChange="pageChangeFn"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
