<script setup>
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useNuxtApp } from '#app'

const { $message } = useNuxtApp()
const editorStore = useEditorStore()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'submit-success'])

// Refs
const content = ref('')
const editorWrap = ref(null)
const loading = ref(false)

// Methods
watch(() => props.show, (newVal) => {
  if (newVal) {
    showEditorWrap()
  } else {
    hideEditorWrap()
  }
})

const showEditorWrap = () => {
  document.documentElement.classList.add('modal-open')
  editorWrap.value?.classList.add('active')
  // Load cached content if exists
  content.value = editorStore.getDraft() || ''
}

const hideEditorWrap = () => {
  document.documentElement.classList.remove('modal-open')
  editorWrap.value?.classList.remove('active')
  emit('update:show', false)
}

const handleSubmit = async () => {
  if (!content.value.trim()) {
    $message({
      content: '请输入内容',
      type: 'warning'
    })
    return
  }

  loading.value = true
  try {
    await editorStore.submitWeibo(content.value)
    editorStore.clearDraft()
    content.value = ''
    emit('submit-success')
    hideEditorWrap()
    $message({
      content: '发布成功',
      type: 'success'
    })
  } catch (err) {
    $message({
      content: '发布失败',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

// Auto save draft when content changes
watch(content, (newVal) => {
  editorStore.saveDraft(newVal)
})
</script>

<template>
  <div class="weibo-editor">
    <div ref="editorWrap" class="editor-wrap border-gray-200">
      <div class="close-btn" @click="hideEditorWrap">
        <SvgIcon name="close" />
      </div>
      <div class="editor-box">
        <textarea
          v-model="content"
          class="editor-input"
          placeholder="写点什么..."
          :disabled="loading"
        />
        <button 
          class="submit-btn"
          :disabled="loading"
          @click="handleSubmit"
        >
          发布
        </button>
      </div>
    </div>
    <div class="mask" @click="hideEditorWrap" />
  </div>
</template>

<style lang="scss" scoped>
.weibo-editor {
  .editor-wrap {
    display: none;
    &.active {
      display: flex;
      position: fixed;
      left: 0;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      max-width: 650px;
      margin: 0 auto;
      padding: 32px;
      border-radius: 20px;
      background-color: var(--bg-thin);
      z-index: 100;
    }
  }

  .close-btn {
    position: absolute;
    top: 1em;
    right: 2em;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 50%;
    background-color: var(--bg-major);
    cursor: pointer;
    svg {
      color: var(--primary);
    }
  }

  .editor-box {
    width: 100%;
    .editor-input {
      width: 100%;
      height: 200px;
      padding: 15px 20px;
      border: none;
      border-radius: 15px;
      background-color: var(--bg-major);
      color: var(--primary);
      resize: none;
      outline: none;
      font-size: 16px;
      margin-bottom: 20px;
      
      &::placeholder {
        color: var(--weak);
      }
    }

    .submit-btn {
      float: right;
      padding: 0 2em;
      height: 40px;
      color: whitesmoke;
      font-size: 14px;
      letter-spacing: .2em;
      font-weight: bold;
      background-color: var(--primary);
      border: none;
      border-radius: 10px;
      cursor: pointer;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  .mask {
    display: none;
    &:has(+ .editor-wrap.active) {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 99;
    }
  }
}

@media (max-width: 768px) {
  .weibo-editor {
    .editor-wrap.active {
      top: 0;
      transform: none;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      padding: 2em;
      
      .close-btn {
        top: calc(2em + 14px);
        right: 2em;
      }
    }
  }
}
</style> 
