import { defineStore } from 'pinia'
import { addWeibo } from '@/api/weibo'
import { translate } from '@/api/app'

export const useEditorStore = defineStore('editor', {
  state: () => ({
    draft: '',
    articleDraft: {
      plaintext: '',
      title: '',
      feature_image: '',
      slug: '',
      visibility: 'public',
      is_show: 1,
      category_id: null
    }
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
    },

    saveArticleDraft(content: Partial<typeof this.articleDraft>) {
      this.articleDraft = { ...this.articleDraft, ...content }
    },

    getArticleDraft() {
      return this.articleDraft
    },

    clearArticleDraft() {
      this.articleDraft = {
        plaintext: '',
        title: '',
        feature_image: '',
        slug: '',
        visibility: 'public',
        is_show: 1,
        category_id: null
      }
    },
  }
}) 
