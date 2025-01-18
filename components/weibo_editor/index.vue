<script setup>
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useNuxtApp } from '#app'
import { VisibilityEnum, VisibilityMap } from '@/enums/visibilityEnums'
import { useLockFn } from '@/composables/useLockFn'

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
const visibility = ref(VisibilityEnum.PUBLIC)

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

  try {
    console.log('submitWeibo')
    await editorStore.submitWeibo({
      content: content.value,
      visibility: visibility.value
    })
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
  }
}

const { lockFn: lockSubmitFn, isLock } = useLockFn(handleSubmit)

// Auto save draft when content changes
watch(content, (newVal) => {
  editorStore.saveDraft(newVal)
});
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
          :disabled="isLock"
        />
        <div class="editor-footer">
          <select 
            v-model="visibility"
            class="visibility-select"
            :disabled="isLock"
          >
            <option 
              v-for="(label, value) in VisibilityMap" 
              :key="value" 
              :value="value"
            >
              {{ label }}
            </option>
          </select>
          <button 
            class="submit-btn"
            :disabled="isLock"
            @click="lockSubmitFn"
          >
            发布
          </button>
        </div>
      </div>
    </div>
    <div class="mask" @click="hideEditorWrap" />
  </div>
</template>

<style lang="scss" scoped>
@use './index.scss';

</style> 
