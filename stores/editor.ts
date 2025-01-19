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
      is_show: true,
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
        is_show: true,
        category_id: null
      }
    },

    async generateSlug(title: string) {
      if (!title) return ''
      
      // For English titles
      if (/^[a-zA-Z\s\W]+$/.test(title)) {
        return title.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
      }
      
      // For non-English titles, translate first
      const { text } = await translate({ q: title })
      return text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
    }
  }
}) 
