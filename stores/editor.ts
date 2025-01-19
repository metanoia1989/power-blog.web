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

    async generateSlug(title: string) {
      if (!title) return ''
      
      // 修正英文匹配的正则，只匹配纯英文标题
      if (/^[\x00-\x7F]+$/.test(title)) {  // 或者使用 /^[a-zA-Z0-9\s\W]+$/
        return title.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
      }
      
      // 对于非英文标题，使用翻译服务
      const { slug } = await translate({ title: title })
      return slug
    }
  }
}) 
