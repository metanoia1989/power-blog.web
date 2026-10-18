<script setup>
import { ref, onMounted } from 'vue'
import { useArticleStore } from '@/stores/article'
import { useUserStore } from '@/stores/user'
import IdeaItem from '@/components/idea_item/index.vue'
import Pagination from '@/components/pagination/index.vue'
import { useAppStore } from '@/stores/app'
import WeiboEditor from '@/components/weibo_editor/index.vue'
import $message from '@/components/message/plugin'

const appStore = useAppStore()
const userStore = useUserStore()
const $config = computed(() => appStore.config)
const store = useArticleStore()


// 状态
const isLogin = computed(() => userStore.isLogin)
const ideas = ref([])
const loading = ref(true)
const totalCount = ref(0)
const { currentPage, pageSize } = usePagination()

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
    const { lists, count }= await store.fetchWeiboList({
      page_no: currentPage.value,
      page_size: pageSize.value
    })
    ideas.value = lists
    totalCount.value = count
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

// Add click handler for edit button
const showEditor = ref(false)
const handleEditClick = () => {
  showEditor.value = true
}

// Add refresh method to update list after new post
const refreshList = () => {
  pageChangeFn()
}
</script>

<template>
  <div class="inspiration-wrap">
    <div class="inspiration">
      <h2>
        <div class="inspiration-header">
          <SvgIcon name="tongzhi" /> 絮絮叨叨
        </div>
        <span class="inspiration-edit-btn" v-if="isLogin" @click="handleEditClick">
          <SvgIcon name="shuru" />
        </span>
      </h2>
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
        :page-size="pageSize"
        @pageChange="pageChangeFn"
      />
    </div>
    <WeiboEditor 
      v-model:show="showEditor"
      @submit-success="refreshList"
    />
  </div>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
