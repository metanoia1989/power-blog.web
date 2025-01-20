<!-- eslint-disable max-statements-per-line -->
<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import Clipboard from 'clipboard'
import VueEasyLightbox from 'vue-easy-lightbox'
import MarkIt from './mark_it'

const { $message } = useNuxtApp()

// Props
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  needParsed: {
    type: Boolean,
    default: false,
  },
})

// Refs
const clipboard = ref(null)
const htmlString = ref('')
const images = ref([])
const lightboxVisible = ref(false)

// Methods
const registerClipboard = (clipboardInstance) => {
  clipboardInstance.on('success', (e) => {
    // 假设 $message 是全局注入的
    $message({ content: '复制成功', type: 'success' })
    e.clearSelection()
  })
  clipboardInstance.on('error', (e) => {
    $message({ content: '复制失败', type: 'error' })
    e.clearSelection()
  })
}

const openLightbox = (imageSrc) => {
  images.value = [imageSrc]
  lightboxVisible.value = true
}

const extractImages = () => {
  const matches = props.content?.match(/<img[^>]*src="([^"]*)"[^>]*>/g)
  if (matches)
    images.value = matches.map(tag => tag.match(/src="([^"]*)"/)[1])
}

const addClickEvents = () => {
  nextTick(() => {
    // 添加图片点击事件，这里有bug，导致网页所有图片都被包括在内了(加个容器限制即可) 
    const imageElements = document.querySelectorAll('.markdown-container img')
    imageElements.forEach((img) => {
      img.addEventListener('click', () => {
        openLightbox(img.src)
      })
    })
  })
}

// Watchers
watch(() => props.content, () => {
  extractImages()
  addClickEvents()
}, { immediate: true })

// Lifecycle hooks
onMounted(() => {
  clipboard.value = new Clipboard('.icon-copy', {
    target(trigger) {
      return trigger.parentNode.nextElementSibling
    },
  })
  registerClipboard(clipboard.value)
})

onUnmounted(() => {
  $message.closeAll()
  clipboard.value?.destroy()
})

// Initial parsing if needed
if (props.needParsed) {
  const markIt = new MarkIt()
  markIt.parse(props.content)
    .then((parsedString) => {
      htmlString.value = parsedString?.content
    })
    .catch((err) => {
      $message({
        content: '解析 markdown 失败',
        type: 'error',
      })
      throw new Error(err)
    })
}
</script>

<template>
  <div class="markdown-container">
    <div class="markdown" v-html="htmlString || content" />
    <div class="markdown-images" v-if="images.length > 0">
      <VueEasyLightbox
        :visible="lightboxVisible"
        :imgs="images"
        @hide="lightboxVisible = false"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './renderer/markdown-var.css';
@use './index.scss';
</style>

