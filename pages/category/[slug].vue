<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from '#app'
import { useArticleStore } from '@/stores/article'
import Loading from '@/components/loading/index.vue'
import PostCard from '@/components/post_card/index.vue'
import CategoryBar from '@/components/category_bar/index.vue'
import Pagination from '@/components/pagination/index.vue'
import { useNuxtApp } from '#app'
import { getCategories } from '@/api/article'

definePageMeta({
  index: 2,
  title: '分类',
})

const { $message } = useNuxtApp()

const route = useRoute()
const store = useArticleStore()

// 状态
const posts = ref([])
const totalCount = ref(0)
const loading = ref(true)
const { currentPage, pageSize } = usePagination()


// 计算属性
const categorySlug = computed(() => {
  return store.currentCategory.slug || route.params.slug
})


// 方法
const pageChangeFn = () => {
  posts.value = []
  loading.value = true
  getPostsFn()
}

// methods
const getCategoriesFn = async () => {
  if (store.categories.length != 0) {
    return Promise.resolve()
  }
  try {
    await store.getCategories()
  } catch (err) {
    $message({
      content: '获取分类失败',
      type: 'error',
    })
    throw new Error(err)
  }
}

const getPostsCountFn = async () => {
  try {
    totalCount.value = categorySlug.value
      ? store.currentCategory.article_count
      : await store.getPostsCount()
    
  } catch (err) {
    $message({
      content: '获取文章总数失败',
      type: 'error',
    })
    throw new Error(err)
  }
}

const getPostsFn = async () => {
  loading.value = true
  try {
    let res = []

    if (categorySlug.value) {
      res = await store.fetchArticleList({
        page_no: currentPage.value,
        page_size: pageSize.value,
        category_slug: categorySlug.value,
      })
    }
    else {
      res = await store.fetchArticleList({
        page_no: currentPage.value,
        page_size: pageSize.value,
      })
    }

    posts.value = res.posts.map(post => ({
      ...post,
      hot: 1,
    }))

    
    store.setAllPosts(res.posts)
  } catch (err) {
    $message({
      content: '获取文章列表失败',
      type: 'error',
    })
    throw new Error(err)
  } finally {
    loading.value = false
  }
}

const setCurrentCategory = () => {
  if (store.categories.length != 0) {
    const category = store.categories.find(item => item.slug === route.params.slug)
    if (category) {
      store.setCurrentCategory(category)
    } else {
      store.setCurrentCategory('')
    }
  }
}

// 监听
watch(() => route, (from, to) => {
  if (from.path != to.path) {
    posts.value = []
    currentPage.value = 1
    setCurrentCategory()
    getPostsFn()
    getPostsCountFn()
  }
}, { deep: true })

// 初始化
getCategoriesFn().then(() => {
  setCurrentCategory()
  getPostsFn()
  getPostsCountFn()
})
</script>

<template>
  <div class="category-page"> 
    <CategoryBar />
    <div class="post-list">
      <div class="posts-wrap">
        <Loading v-if="loading" />
        <transition name="from-bottom">
          <div v-if="!loading" class="posts">
            <NuxtLink
              v-for="post in posts"
              :key="post.id"
              :to="`/posts/${post.slug}`"
            >
              <PostCard
                :post="post"
              />
            </NuxtLink>
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
.category-page {
  margin-top: 1em;
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
