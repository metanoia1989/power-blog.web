<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from '#app'
import RelatedPost from '@/components/related_post/index.vue'
import Markdown from '@/components/markdown/index.vue'
import MarkIt from '@/components/markdown/mark_it'
import { updateCurrentLink } from '@/utils/blog'
import { getArticleDetail, getRelativePosts } from '@/api/article'
import { useAppStore } from '~/stores/app'
import { useUserStore } from '~/stores/user'

definePageMeta({
  index: 99,
  title: '文章',
})

// State
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const $config = computed(() => appStore.config)
const isLogin = computed(() => userStore.isLogin)

const post = ref({})
const relates = ref([])
const toc = ref('')
const content = ref('')
const loading = ref(true)
const commentVisible = ref(false)
const tocWrap = ref(null)

// Computed
const postSlug = computed(() => {
  if (route.params?.slug) {
    return route.params.slug
  }
  const url = window.location.href
  const slug = url.match(/\/post\/(\w+)/)?.[1]
  return slug
})

const showTagText = computed(() => 
  post.value.tags && post.value.tags.length > 0
)

// Methods
const getPostFn = async () => {
  const markIt = new MarkIt()
  try {
    loading.value = true
    post.value = await getArticleDetail(postSlug.value)

    const parsedMarked = await markIt.parse(post.value.plaintext)
    window.document.title = post.value.title
    commentVisible.value = true
    toc.value = parsedMarked?.toc
    content.value = parsedMarked?.content
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const generateRelatesFn = async () => {
  try {
    const postList = await getRelativePosts(postSlug.value)
    relates.value = postList
  } catch (err) {
    console.error(err)
  }
}

// Lifecycle hooks & watchers
watch(() => route.path, () => {
  commentVisible.value = false
  initAllData()
  getPostFn()
  generateRelatesFn()
})

getPostFn()

onMounted(() => {
  generateRelatesFn()
  nextTick(() => {
    window.addEventListener('scroll', updateCurrentTocLink)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateCurrentTocLink)
})

const initAllData = () => {
  post.value = {}
  relates.value = []
  toc.value = ''
  content.value = ''
  loading.value = true
}

const handleClick = (e) => {
  const tocLinks = document.querySelectorAll('.toc-link')
  if (e.target.classList.contains('toc-link')) {
    tocLinks.forEach((item) => {
      item.classList.remove('active')
    })
    const id = e.target.getAttribute('href')
    const el = document.querySelector(id)
    const offset = 100
    if (el) {
      const topPos = el.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top: topPos, behavior: 'smooth' })
    }
  }
}

const updateCurrentTocLink = () => {
  updateCurrentLink('.toc-link')
}

const backLastPage = () => {
  router.back()
}

const showToc = () => {
  tocWrap.value?.classList.add('show')
}

const hideToc = () => {
  tocWrap.value?.classList.remove('show')
}

const handleEdit = () => {
  if (isLogin.value) {
    console.log(post.value.id)
    router.push(`/posts/edit?id=${post.value.id}`)
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <article class="post">
    <section ref="tocWrap" class="toc-wrap">
      <div class="toc-header">
        <div class="toc-title">
          <SvgIcon name="toc" />
          <span>文章目录</span>
        </div>
        <div class="toc-close" @click="hideToc">
          <SvgIcon name="close" />
        </div>
      </div>
      <div class="toc" @click.prevent="handleClick" v-html="toc" />
    </section>
    <section class="post-header">
      <div class="page-control">
        <div class="back" @click="backLastPage">
          <SvgIcon name="back" />
        </div>
        <div class="show-toc" @click="showToc">
          <SvgIcon name="toc" />
        </div>
      </div>
      <figure class="post-cover">
        <img :src="post.feature_image || $config.defaultCover" alt="cover">
      </figure>
    </section>
    <section class="post-body">
      <div class="post-info">
        <div class="title-wrap">
          <div class="title-top">
            <div class="cate-wrap">
              <span v-if="!post.category" class="cate-text">未分类</span>
              <template v-else>
                <NuxtLink
                  class="cate-link"
                  :to="`/category/${post.category.slug}`"
                >
                  {{ post.category.name }}
                </NuxtLink>
              </template>
            </div>
            <div class="tags">
              <SvgIcon name="biaoqian" />
              <template v-if="showTagText">
                <span v-for="tag in post.tags" :key="tag.id" class="tag" :style="{ color: `#${tag.color}` }">
                  # {{ tag.name }}
                </span>
              </template>
              <span v-else>无标签</span>
            </div>
          </div>
          <h1 class="post-title">
            {{ post.title }}
          </h1>
          <span class="post-edit-btn" @click="handleEdit">
            <SvgIcon name="shuru" />
          </span>
        </div>
        <div class="tags-wrap">
          <div class="author">
            <figure class="author-avatar">
              <img :src="$config.avatar" alt="头像">
            </figure>
            <div class="text">
              <p class="author-name">
                {{ $config.author }}
              </p>
              <div class="meta">
                <span class="time"><SvgIcon name="shijian" /> {{ post.created_at }}</span>
                <span class="hot"><SvgIcon name="huore" /> {{ post.hot ?? 1 }}</span>
                <span class="visibility"><SvgIcon name="chakan" /> {{ post.visibility_desc }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-loading="loading" class="post-main">
        <Markdown :content="content" :parsed="true" />
      </div>
    </section>
    <section class="post-footer">
      <div class="related-posts">
        <RelatedPost v-for="relate in relates" :key="relate.id" :post="relate" />
      </div>
    </section>
  </article>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
