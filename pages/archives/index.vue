<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { useArticleStore } from '@/stores/article'
import ArchiveCard from '@/components/archive_card/index.vue'
import Loading from '@/components/loading/index.vue'
import { hexToHsl, parseArchives, sortArchiveMap } from '@/utils/blog'
import { useNuxtApp } from '#app'
import { getTags } from '@/api/article'
import { useAppStore } from '~/stores/app'

const { $message } = useNuxtApp()
const appStore = useAppStore()
const $config = computed(() => appStore.config)

const store = useArticleStore()

definePageMeta({
  index: 1,
  title: '归档',
})

// 状态
const totalCount = ref(0)
const archives = ref([])
const archiveMap = ref({})
const tags = ref([])
const isFilter = ref(false)
const filterCount = ref(0)
const timer = ref(null)
const loading = ref(true)
const page = ref(1)
const hasMore = ref(true)
const loadingMore = ref(false)

// 计算属性
const editLink = computed(() => {
  return  $config.adminLink + `/article/lists`
})

const filterText = computed(() => {
  return filterCount.value === 0 ? '该标签下暂时没有文章~' : `该标签下有 ${filterCount.value} 篇文章~`
})

// 方法
const getArchiveCountFn = async () => {
  try {
    totalCount.value = await store.getPostsCount()
  } catch (err) {
    $message({
      content: '获取文章总数失败',
      type: 'error',
    })
    throw new Error(err)
  }
}

const getArchivesFn = async () => {
  try {
    const newArchives = await store.fetchArticleList({ page_no: page.value, page_size: 100 })
    archives.value = [...archives.value, ...newArchives.posts]
    const parsedArchiveMap = parseArchives(archives.value)
    archiveMap.value = sortArchiveMap(parsedArchiveMap)
    
    // Check if we have more posts to load
    hasMore.value = newArchives.posts.length === 100
  } catch (err) {
    $message({
      content: '获取文章列表失败',
      type: 'error',
    })
    throw new Error(err)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const getTagsFn = async () => {
  try {
    const fetchedTags = await getTags()
    console.log('fetchedTags', fetchedTags)
    tags.value = fetchedTags.map((tag, index) => ({
      ...tag,
      index,
      hslColor: hexToHsl(tag.color ? `#${tag.color}` : `#000000`)
    }))
  } catch (err) {
    $message({
      content: '获取标签列表失败',
      type: 'error',
    })
    console.error('getTagsFn', err)
  }
}

const filterArchives = (e) => {
  const target = e.target
  const tagList = tags.value || []
  if (target.classList.contains('tag')) {
    loading.value = true
    const tagId = Number(target.getAttribute('data-tag'))
    const duration = Math.random() * (1300 - 300) + 300
    const tag = tagList.find(item => item.id === tagId)
    if (tag) {
      const filteredArchives = archives.value.filter(archive => archive.tags.find(item => item.id === tag.id))
      target.parentNode.querySelectorAll('.tag').forEach((item) => {
        item.classList.remove('active')
      })
      target.classList.add('active')
      const parsedArchiveMap = parseArchives(filteredArchives)
      archiveMap.value = sortArchiveMap(parsedArchiveMap)
      filterCount.value = filteredArchives.length
      isFilter.value = true
      timer.value = setTimeout(() => {
        clearTimeout(timer.value)
        loading.value = false
      }, duration)
    }
  }
}

const clearAll = () => {
  document.querySelectorAll('.tag').forEach((item) => {
    item.classList.remove('active')
  })
  const parsedArchiveMap = parseArchives(archives.value)
  archiveMap.value = sortArchiveMap(parsedArchiveMap)
  isFilter.value = false
}

// Add new method for infinite scroll
const handleScroll = async () => {
  if (loadingMore.value || !hasMore.value || isFilter.value) return
  
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight
  
  if (scrollHeight - scrollTop - clientHeight < 100) {
    loadingMore.value = true
    page.value++
    await getArchivesFn()
  }
}

// Update lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  clearTimeout(timer.value)
  window.removeEventListener('scroll', handleScroll)
})

// 初始化
getArchiveCountFn()
getArchivesFn()
getTagsFn()
</script>

<template>
  <div class="archives-wrap">
    <div class="archives">
      <div class="tags">
        <div class="tags-header">
          <h2><SvgIcon name="biaoqian" /> 标签</h2>
          <div v-if="isFilter" class="clear-all" @click="clearAll">
            清除选中
          </div>
        </div>
        <div class="tags-body">
          <ul ref="tagList" class="tag-list" @click="filterArchives">
            <li v-for="tag in tags" :key="tag.id" class="tag" :data-tag="tag.id" :style="{ '--color': `#${tag.color}`, '--tag-hsl': tag.hslColor, '--delay': `${tag.index}` }">
              {{ tag.name || '' }}
            </li>
          </ul>
        </div>
      </div>
      <div class="archives-list">
        <div class="archives-header">
          <h2 v-if="!isFilter">
            <SvgIcon name="danju" /> 你已经写了 {{ totalCount }} 篇文章了，继续坚持哦~
            <a class="edit" :href="editLink" target="_blank">
              <SvgIcon name="shuru" />
            </a>
          </h2>
          <h2 v-else>
            <SvgIcon name="danju" /> {{ filterText }}
          </h2>
        </div>
        <div class="archives-body">
          <Loading v-if="loading" />
          <transition name="from-bottom">
            <div v-if="!loading">
              <div v-for="year in Object.keys(archiveMap).reverse()" :key="year" class="archive-items">
                <div class="archive-year">
                  {{ year }}
                </div>
                <div class="archive-item-list">
                  <NuxtLink
                    v-for="archive in archiveMap[year]"
                    :key="archive.id"
                    :to="`/posts/${archive.slug}`"
                  >
                    <ArchiveCard :cover="archive.feature_image" :title="archive.title" :created-at="archive.created_at_raw" />
                  </NuxtLink>
                </div>
              </div>
              <div v-if="loadingMore" class="loading-more">
                <Loading />
              </div>
              <div v-if="!hasMore && !isFilter" class="no-more">
                已经到底啦 ~
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
