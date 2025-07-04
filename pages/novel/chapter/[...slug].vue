<template>
  <div class="novel-reader" :class="{
    'night-mode': settings.theme === 'night',
    'sepia-mode': settings.theme === 'sepia'
  }">
    <div class="reader-content" :style="contentStyle">
      <div class="chapter-header">
        <h1>{{ chapter.title }}</h1>
      </div>
      <div class="chapter-content">
        <div v-html="chapter.html"></div>
      </div>
      <div class="chapter-footer">
        <div class="chapter-control">
          <el-button v-if="prevChapterId" @click="navigateToChapter(prevChapterId)">上一章</el-button>
          <el-button v-if="nextChapterId" @click="navigateToChapter(nextChapterId)">下一章</el-button>
        </div>
      </div>
    </div>
    
    <div class="reader-toolbar">
      <div class="toolbar-item" @click="showToc = !showToc">
        <Icon name="solar:document-linear" size="24" />
        <span>目录</span>
      </div>
      <div class="toolbar-item" @click="navigateToNovel">
        <Icon name="solar:book-2-linear" size="24" />
        <span>书籍</span>
      </div>
      <div class="toolbar-item" @click="showSettings = !showSettings">
        <Icon name="solar:settings-linear" size="24" />
        <span>设置</span>
      </div>
    </div>

    <!-- Table of Contents Drawer -->
    <el-drawer v-model="showToc" :with-header="false" direction="rtl" size="50%" :before-close="handleTocClose">
      <div class="toc-header">  
        <div class="novel-directory-header">
          <h2>目录</h2>
          <span>连载共{{ totalChapter }}章</span>
        </div>
        <div class="sort-controls">
          <div class="sort-buttons">
            <button class="sort-button" @click="toggleSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')">
              <Icon
                :name="sortOrder === 'asc' ? 'solar:sort-from-top-to-bottom-linear' : 'solar:sort-from-bottom-to-top-linear'" />
              <span>{{ sortOrder === 'asc' ? '正序' : '倒序' }}</span>
            </button>
          </div>
        </div>
        <SvgIcon class="close-icon" name="close" @click="showToc = false" />
      </div>
      <div class="toc-content" ref="tocContentRef">
        <div v-if="sortedChapterList && sortedChapterList.length" class="volumes-grid">
          <div v-for="volume in sortedChapterList" :key="volume.id" class="volume-section">
            <div class="volume-title" @click="toggleVolume(volume.id)">
              {{ volume.title }}
              <Icon 
                :name="isVolumeExpanded(volume.id) ? 'solar:alt-arrow-down-linear' : 'solar:alt-arrow-up-linear'"
                class="volume-toggle" 
                :class="{ 'expanded': isVolumeExpanded(volume.id) }"
              />
            </div>
            <div class="chapters-grid" :class="{ 'collapsed': !isVolumeExpanded(volume.id) }">
              <div 
                v-for="chapterItem in volume.chapters" 
                :key="chapterItem.id" 
                @click="navigateToChapter(chapterItem.id)"
                class="chapter-item"
                :class="{ 'active': chapterItem.id === parseInt(chapterId) }"
              >
                {{ chapterItem.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- Settings Drawer -->
    <el-drawer v-model="showSettings" title="设置" direction="rtl" size="300px">
      <div class="settings-panel">
        <div class="setting-group">
          <h3>主题</h3>
          <div class="theme-options">
            <div 
              class="theme-option" 
              :class="{ 'active': settings.theme === 'default' }"
              @click="updateSetting('theme', 'default')"
            >
              <div class="theme-preview default-theme"></div>
              <span>默认</span>
            </div>
            <div 
              class="theme-option"
              :class="{ 'active': settings.theme === 'night' }"
              @click="updateSetting('theme', 'night')"
            >
              <div class="theme-preview night-theme"></div>
              <span>夜间</span>
            </div>
            <div 
              class="theme-option"
              :class="{ 'active': settings.theme === 'sepia' }"
              @click="updateSetting('theme', 'sepia')"
            >
              <div class="theme-preview sepia-theme"></div>
              <span>护眼</span>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <h3>字体</h3>
          <el-select v-model="settings.fontFamily" placeholder="字体类型" @change="(val) => updateSetting('fontFamily', val)">
            <el-option label="系统默认" value="system"></el-option>
            <el-option label="宋体" value="SimSun, serif"></el-option>
            <el-option label="黑体" value="SimHei, sans-serif"></el-option>
            <el-option label="楷体" value="KaiTi, serif"></el-option>
            <el-option label="LXGW Bright" value="'LXGW Bright', serif"></el-option>
          </el-select>
        </div>

        <div class="setting-group">
          <h3>字体大小</h3>
          <el-slider v-model="settings.fontSize" :min="14" :max="30" :step="1" @change="(val) => updateSetting('fontSize', val)" />
          <div class="font-size-display">{{ settings.fontSize }}px</div>
        </div>

        <div class="setting-group">
          <h3>页面宽度</h3>
          <div class="width-options">
            <div 
              v-for="option in widthOptions" 
              :key="option.value"
              :class="['width-option', { active: settings.contentWidth === option.value }]"
              @click="updateSetting('contentWidth', option.value)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>

        <div class="setting-group">
          <h3>翻页模式</h3>
          <el-radio-group v-model="settings.pageMode" @change="(val) => updateSetting('pageMode', val)">
            <el-radio label="scroll">滚动加载</el-radio>
            <el-radio label="click">点击翻页</el-radio>
          </el-radio-group>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReadStore } from '~/stores/read'
import { getChapter } from '~/api/book'

definePageMeta({
  layout: 'blank',
})

const route = useRoute()
const router = useRouter()
const readStore = useReadStore()

// Get book slug and chapter id from route params
const slugParams = computed(() => route.params.slug || [])
const bookSlug = computed(() => slugParams.value[0])
const chapterId = computed(() => parseInt(slugParams.value[1]) || 0)

// State variables
const chapter = ref({})
const chapterList = ref([])
const prevChapterId = ref(null)
const nextChapterId = ref(null)
const loading = ref(false)
const tocContentRef = ref(null)

// UI state
const showToc = ref(false)
const showSettings = ref(false)
const sortOrder = ref('asc')
const expandedVolumeIds = ref([])

// Use settings from store instead of local state
const settings = computed(() => readStore.settings)
const book = computed(() => readStore.currentBook)
const totalChapter = computed(() => book.value?.volumes?.reduce((acc, volume) => acc + volume.chapters.length, 0) || 0)
const sortedChapterList = computed(() => {
  const sortedFn = sortOrder.value === 'asc' 
    ? (a, b) => a.sort - b.sort || a.id - b.id 
    : (a, b) => b.sort - a.sort || b.id - a.id

  if (!book.value?.volumes) return []

  // Sort volumes first
  const sortedVolumes = [...book.value.volumes].sort(sortedFn)

  // Then sort chapters within each volume
  return sortedVolumes.map(volume => ({
    ...volume,
    chapters: [...volume.chapters].sort(sortedFn)
  }))
})

// Width options
const widthOptions = [
  { label: '自动', value: 'auto' },
  { label: '640px', value: '640px' },
  { label: '800px', value: '800px' },
  { label: '900px', value: '900px' },
  { label: '1000px', value: '1000px' },
  { label: '1280px', value: '1280px' },
]

// Computed styles for content area
const contentStyle = computed(() => {
  return {
    fontFamily: settings.value.fontFamily === 'system' ? 'inherit' : settings.value.fontFamily,
    fontSize: `${settings.value.fontSize}px`,
    width: settings.value.contentWidth === 'auto' ? 'auto' : settings.value.contentWidth,
    maxWidth: settings.value.contentWidth === 'auto' ? '80%' : 'none',
  }
})

// Update settings in the store
function updateSetting(key, value) {
  readStore.updateSetting(key, value)
}

// Load chapter data
async function loadChapter() {
  if (!chapterId.value) return
  
  loading.value = true
  try {
      chapter.value = await getChapter(chapterId.value)
      chapter.value.html = chapter.value?.content.plaintext?.replace(/\n/g, '<br>') || ''
      expandedVolumeIds.value = book.value?.volumes?.map(volume => volume.id) || []
      
      // Set current chapter in store
      readStore.setCurrentChapter(chapterId.value)
      
      // Update previous and next chapter links
      updatePrevNextChapters()
      
      // Set page title
      document.title = `${chapter.value.title} - ${book.value?.title || '阅读'}`
  } catch (error) {
    console.error('Failed to load chapter:', error)
  } finally {
    loading.value = false
  }
}

function navigateToNovel() {
  router.push(`/novel/${bookSlug.value}`)
}

function toggleSortOrder(order) {
  sortOrder.value = order
}

// Handle drawer close with smooth animations
function handleTocClose(done) {
  // First collapse all volumes for a smooth animation
  expandedVolumeIds.value = []
  
  // Give some time for the animation to play before closing the drawer
  setTimeout(() => {
    done()
  }, 300)
}

// Toggle volume expansion
const toggleVolume = (volumeId) => {
  const index = expandedVolumeIds.value.indexOf(volumeId)
  if (index > -1) {
    expandedVolumeIds.value.splice(index, 1)
  } else {
    expandedVolumeIds.value.push(volumeId)
  }
  
  // Update the scrollbar visibility after animation completes
  nextTick(() => {
    updateDrawerScrollbar()
  })
}

// Check if volume is expanded
const isVolumeExpanded = (volumeId) => {
  return expandedVolumeIds.value.includes(volumeId)
}

// Update drawer scrollbar visibility based on content height
const updateDrawerScrollbar = () => {
  if (!tocContentRef.value) return
  
  const parentEl = tocContentRef.value.parentElement
  if (!parentEl) return
  
  // Let the transitions complete before checking heights
  setTimeout(() => {
    const contentHeight = tocContentRef.value.scrollHeight
    const visibleHeight = parentEl.clientHeight
    
    // If content is taller than visible area, show scrollbar
    if (contentHeight > visibleHeight) {
      parentEl.style.overflowY = 'auto'
    } else {
      // Otherwise hide it for a cleaner look
      parentEl.style.overflowY = 'hidden'
    }
  }, 350)
}

// Update previous and next chapter IDs
function updatePrevNextChapters() {
  if (!book.value?.volumes) return

  // Extract all chapters from all volumes
  const allChapters = []
  book.value.volumes.forEach(volume => {
    if (volume.chapters && Array.isArray(volume.chapters)) {
      allChapters.push(...volume.chapters)
    }
  })

  if (allChapters.length === 0) return

  // Sort chapters by ID or sort field
  allChapters.sort((a, b) => a.sort - b.sort || a.id - b.id)
  
  // Find current chapter index
  const currentIndex = allChapters.findIndex(c => c.id === parseInt(chapterId.value))
  
  if (currentIndex > 0) {
    prevChapterId.value = allChapters[currentIndex - 1].id
  } else {
    prevChapterId.value = null
  }
  
  if (currentIndex < allChapters.length - 1 && currentIndex !== -1) {
    nextChapterId.value = allChapters[currentIndex + 1].id
  } else {
    nextChapterId.value = null
  }
}

// Navigate to a different chapter
function navigateToChapter(id) {
  if (id === parseInt(chapterId.value)) return
  
  // Use page mode setting
  if (settings.value.pageMode === 'scroll') {
    router.push(`/novel/chapter/${bookSlug.value}/${id}`)
  } else {
    // For click mode, just load the chapter without changing the URL
    const newUrl = `/novel/chapter/${bookSlug.value}/${id}`
    window.history.pushState({}, '', newUrl)
    loadChapter()
  }
}

// Handle keyboard navigation
function handleKeyNavigation(e) {
  if (e.key === 'ArrowLeft' && prevChapterId.value) {
    navigateToChapter(prevChapterId.value)
  } else if (e.key === 'ArrowRight' && nextChapterId.value) {
    navigateToChapter(nextChapterId.value)
  }
}

// Watch for TOC drawer open/close
watch(showToc, (newValue) => {
  if (newValue) {
    // When drawer opens, update the scrollbar after it's fully rendered
    nextTick(() => {
      updateDrawerScrollbar()
    })
  }
})

// Watch for route changes to reload chapter
watch(() => route.params.slug, () => {
  loadChapter()
}, { immediate: true })

// Initial load and setup
onMounted(() => {
  // Add keyboard navigation
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyNavigation)
  }
})

// Clean up event listeners
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyNavigation)
  }
})
</script>

<style lang="scss" scoped>
@use './chapter.scss';
</style>
