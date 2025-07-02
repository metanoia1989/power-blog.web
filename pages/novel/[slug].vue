<template>
  <div class="novel-detail" v-loading="loading">
    <div class="novel-header">
      <img :src="novel?.feature_image || '/default-cover.png'" class="novel-cover" />
      <div class="novel-info">
        <h1>{{ novel?.title }}</h1>
        <div class="novel-tags">
          <span v-for="tag in tags" :key="tag.name" class="novel-tag" :style="{ background: tag.color }">
            {{ tag.name }}
          </span>
        </div>
        <div class="novel-author-date">
          <span v-if="novel?.author">
            <SvgIcon name="wode" /> {{ novel.author.name }}
          </span>
          <span>
            <SvgIcon name="shijian" /> {{ novel?.updated_at || '暂无更新' }}
          </span>
        </div>
        <div class="novel-latest-chapter" v-if="latestChapter">
          <SvgIcon name="gengduo" /> 
          <span>最新章节：{{ latestChapter.title }}</span>
        </div>
        <div class="novel-word-count">
          <SvgIcon name="wengao" /> <span class="text-black dark:text-white">{{ wordCount }}</span>字
        </div>
        <div class="novel-controls">
          <button class="novel-control-button" @click="navigateToChapter(latestChapter?.slug)">
            立即阅读
          </button>
          <div class="qrcode-container">
            <button class="novel-control-button scan-read" 
              @mouseenter="showQrCode = true" 
              @mouseleave="showQrCode = false">
              <Icon name="solar:smartphone-2-outline" />
              手机扫码阅读
            </button>
            <div class="qrcode-popup" v-show="showQrCode">
              <div class="qrcode-content">
                <Qrcode
                  :value="currentPageUrl"
                  variant="pixelated"
                  class="qrcode"
                />
                <div class="qrcode-text">手机扫码阅读</div>
              </div>
              <div class="qrcode-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="novel-desc">
      <h2>作品简介</h2>
      <p>{{ novel?.description || '暂无简介' }}</p>
    </div>
    <div class="novel-directory">
      <div class="novel-directory-header">
        <div class="novel-directory-header-left">
          <h2>目录</h2>
          <span>连载共{{ totalChapter }}章</span>
        </div>
        <div class="novel-directory-header-right">
          <div class="sort-controls">
            <div class="sort-buttons">
              <button class="sort-button" @click="toggleSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')">
                <Icon
                  :name="sortOrder === 'asc' ? 'solar:sort-from-top-to-bottom-linear' : 'solar:sort-from-bottom-to-top-linear'" />
                <span>{{ sortOrder === 'asc' ? '正序' : '倒序' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="update-status">
        <div class="left-status">
          已更新至 <span class="chapter-highlight" @click="navigateToChapter(latestChapter?.slug)"
            @mouseenter="showReadNow = true" @mouseleave="showReadNow = false">
            {{ latestChapter?.title || '暂无章节' }}
          </span>
        </div>
        <div class="right-status" @mouseenter="showReadNow = true" @mouseleave="showReadNow = false">
          <template v-if="!showReadNow">
            {{ novel?.updated_at || '暂无更新' }}
          </template>
          <template v-else>
            <span class="read-now" @click="navigateToChapter(latestChapter?.slug)">
              立即阅读
            </span>
          </template>
          <Icon name="solar:alt-arrow-right-outline" class="arrow-right" />
        </div>
      </div>
      <div v-for="(volume, idx) in sortedVolumes" :key="volume.id" class="novel-volume">
        <h3 @click="toggleVolume(volume.id)" class="volume-title">
          {{ volume.title }} · 共{{ computedTotal(volume.chapters) }}章
          <Icon :name="isVolumeExpanded(volume.id) ? 'solar:alt-arrow-down-linear' : 'solar:alt-arrow-up-linear'"
            class="volume-toggle" />
        </h3>
        <ul v-show="isVolumeExpanded(volume.id)">
          <li v-for="chapter in getSortedChapters(volume.chapters)" :key="chapter.id" class="novel-chapter"
            @click="navigateToChapter(chapter.slug)">
            {{ chapter.title }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from '#app'
import { useNovelStore } from '@/stores/novel'
import type { Novel, NovelChapter, NovelVolume } from '@/typings/request'
import { formatNumber } from '@/utils/util'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string

const novelStore = useNovelStore()
const novel = ref<Novel | null>(null)
const loading = ref(true)
const expandedVolumeIds = ref<number[]>([])
const showReadNow = ref(false)
const showQrCode = ref(false)
const sortOrder = ref<'asc' | 'desc'>('asc')
const sortType = ref<'id' | 'title'>('id')

// Get current URL for QR code
const currentPageUrl = computed(() => {
  if (import.meta.client) {
    return window.location.href
  }
  return `https://yourdomain.com/novel/${slug}`
})

onMounted(async () => {
  loading.value = true
  try {
    novel.value = await novelStore.fetchNovel(slug)
    if (novel.value?.volumes) {
      // Initially expand all volumes
      expandedVolumeIds.value = novel.value.volumes.map(volume => volume.id)
    }
    if (import.meta.client) {
      window.document.title = novel.value.title
    }
  } catch (error) {
    console.error('Failed to fetch novel:', error)
  } finally {
    loading.value = false
  }
})

// Toggle volume expansion
const toggleVolume = (volumeId: number) => {
  const index = expandedVolumeIds.value.indexOf(volumeId)
  if (index > -1) {
    expandedVolumeIds.value.splice(index, 1)
  } else {
    expandedVolumeIds.value.push(volumeId)
  }
}

// Check if volume is expanded
const isVolumeExpanded = (volumeId: number) => {
  return expandedVolumeIds.value.includes(volumeId)
}

// Toggle sort order
const toggleSortOrder = (order: 'asc' | 'desc') => {
  sortOrder.value = order
}

// tags
const tags = computed(() => {
  if (!novel.value?.tags) return [
    {
      name: '连载',
      color: '#4CAF50' // 绿色，表示连载状态
    },
    {
      name: '签约',
      color: '#2196F3' // 蓝色，表示签约状态
    },
    {
      name: 'VIP',
      color: '#FFC107' // 金色，表示VIP内容
    },
    {
      name: '玄幻',
      color: '#9C27B0' // 紫色，表示玄幻类型
    }
  ]
  return novel.value.tags
})

// 计算字数
const wordCount = computed(() => {
  let count = 0
  if (!novel.value?.volumes) return 0
  count = novel.value.volumes.reduce((acc, volume) => {
    return acc + (volume.chapters?.reduce((acc, chapter) => acc + chapter.words_num, 0) || 0)
  }, 0)
  return formatNumber(count)
})

// 总章节数
const totalChapter = computed(() => {
  if (!novel.value?.volumes) return 0
  return novel.value.volumes.reduce((acc, volume) => acc + (volume.chapters?.length || 0), 0)
})

// 最新章节
const latestChapter = computed(() => {
  if (!novel.value?.volumes) return null
  let chapters: NovelChapter[] = []
  novel.value.volumes.forEach((v: NovelVolume) => {
    if (v.chapters) chapters = chapters.concat(v.chapters)
  })
  if (chapters.length === 0) return null
  // 假设按sort或id排序，取最后一个
  return chapters.sort((a, b) => b.id - a.id)[0]
})

// 排序后的卷列表
const sortedVolumes = computed(() => {
  if (!novel.value?.volumes) return []
  const sorted = [...novel.value.volumes]
  if (sortOrder.value === 'desc') {
    return sorted.sort((a, b) => b.id - a.id)
  }
  return sorted.sort((a, b) => a.id - b.id)
})

// 导航到章节
const navigateToChapter = (chapterSlug?: string) => {
  if (!chapterSlug) return
  // 这里需要根据实际路由结构调整
  router.push(`/novel/${slug}/chapter/${chapterSlug}`)
}

// 计算章节数
const computedTotal = (values: any) => {
  if (Array.isArray(values)) {
    return values.length + 1;
  }
  return 0
}

// Get sorted chapters for a volume
const getSortedChapters = (chapters: NovelChapter[] | undefined) => {
  if (!chapters || !Array.isArray(chapters)) return []
  const sorted = [...chapters]
  if (sortOrder.value === 'desc') {
    return sorted.sort((a, b) => b.id - a.id)
  }
  return sorted.sort((a, b) => a.id - b.id)
}
</script>

<style lang="scss" scoped>
@use './slug.scss';

:deep(.chapter-icon) {
  font-size: 0.9em;
  color: var(--primary);
}
</style>
