<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { useMessage } from '@/hooks/useMessage'
import Loading from '@/components/loading/index.vue'
import PostCard from '@/components/post_card/index.vue'
import Pagination from '@/components/pagination/index.vue'

const route = useRoute()
const store = useArticleStore()
const message = useMessage()

// 状态
const posts = ref([])
const totalCount = ref(0)
const loading = ref(true)

// 计算属性
const categoryNumber = computed(() => {
  return store.currentCategory.number || route.params.number
})

const currentPage = computed({
  get: () => store.currentPage || 1,
  set: (val) => {
    store.setCurrentPage(val)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
})

// 方法
const pageChangeFn = () => {
  posts.value = []
  loading.value = true
  getPostsFn()
}

const getPostsCountFn = async () => {
  try {
    totalCount.value = categoryNumber.value
      ? store.currentCategory.open_issues
      : await store.getPostsCount()
  } catch (err) {
    message.error('获取文章总数失败')
    throw new Error(err)
  }
}

const getPostsFn = async () => {
  loading.value = true
  try {
    let res = []
    if (categoryNumber.value) {
      const filter = `&milestone=${categoryNumber.value}`
      res = await store.fetchPosts({ page: currentPage.value, filter })
    }
    else {
      res = await store.fetchPosts({ page: currentPage.value })
    }

    const ids = res.map(post => post.id)
    if (localStorage.getItem('configLeancloud') === 'yes') {
      const hot = await store.queryHot({ ids })
      if (hot) {
        posts.value = res.map((post) => ({
          ...post,
          hot: hot[post.id] || 1
        }))
      }
    } else {
      posts.value = res.map(post => ({
        ...post,
        hot: 1
      }))
    }
    
    store.setAllPosts(res)
  } catch (err) {
    message.error('获取文章列表失败')
    throw new Error(err)
  } finally {
    loading.value = false
  }
}

// 监听
watch(() => route, () => {
  posts.value = []
  currentPage.value = 1
  store.setCurrentCategory(route.params.category || '')
  getPostsFn()
  getPostsCountFn()
}, { deep: true })

// 初始化
currentPage.value = 1
store.setCurrentCategory(route.params.category || '')
getPostsFn()
getPostsCountFn()
</script>

<template>
  <div class="post-list">
    <div class="posts-wrap">
      <Loading v-if="loading" />
      <transition name="from-bottom">
        <div v-if="!loading" class="posts">
          <router-link
            v-for="post in posts"
            :key="post.id"
            :to="{ name: 'Post', params: { number: post.number } }"
          >
            <PostCard
              :post="post"
            />
          </router-link>
        </div>
      </transition>
    </div>
    <Pagination
      :current-page.sync="currentPage"
      :total="totalCount"
      :page-size="$config.pageSize"
      @pageChange="pageChangeFn"
    />
  </div>
</template>

<style lang="scss" scoped>
.from-bottom-enter-active {
  transition: all 0.3s ease;
}
.from-bottom-enter {
  opacity: 0;
  transform: translateY(30px);
}
.post-list {
  .posts-wrap {
    position: relative;
    width: 100%;
    min-height: 200px;
    margin: 0 auto;
    margin-top: 1em;
    .posts {
      width: 100%;
      display: flex;
      gap: 1em;
      flex-wrap: wrap;
      & > a {
        margin: 0;
        width: calc(100% / 3 - 10.7px);
        > div {
          width: 100%;
          height: 100%;
        }
      }
    }
    @media screen and (min-width: 876px) {
      max-width: 876px;
    }
    @media screen and (max-width: 876px) {
      .posts {
        padding-left: 9px;
      }
    }
    @include sm-layout {
      .posts {
        padding: 0 calc(1em - 9px) 0 1em;
        & > a {
          width: calc(100% / 2 - 8px);
        }
      }
    }
    @include xs-layout {
      .posts {
        & > a {
          width: 100%;
        }
      }
    }
  }
}
</style>
