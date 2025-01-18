import { defineStore } from 'pinia'
import { addWeibo } from '@/api/weibo'

export const useEditorStore = defineStore('editor', {
  state: () => ({
    draft: ''
  }),

  actions: {
    saveDraft(content: string) {
      this.draft = content
    },

    getDraft() {
      return this.draft
    },

    clearDraft() {
      this.draft = ''
    },

    async submitWeibo({ content, visibility }: { content: string, visibility: string }) {
      return await addWeibo({ 
        plaintext: content,
        visibility 
      })
    }
  }
}) 
