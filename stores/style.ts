import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStyleStore = defineStore('style', () => {
  // state
  const theme = ref('light')
  const currentMenu = ref({})
  const currentComment = ref('utterances')

  // mutations/actions
  const setTheme = (newTheme: string) => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  const setCurrentMenu = (newMenu: object) => {
    currentMenu.value = newMenu
  }

  const setCurrentComment = (newComment: string) => {
    currentComment.value = newComment
  }

  return {
    // state
    theme,
    currentMenu,
    currentComment,
    // actions
    setTheme,
    setCurrentMenu,
    setCurrentComment
  }
})
