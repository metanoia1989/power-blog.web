import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Novel } from '@/typings/request'

// Reader settings interface
interface ReaderSettings {
  theme: string
  fontFamily: string
  fontSize: number
  contentWidth: string
  pageMode: string
}

export const useReadStore = defineStore('read', () => {
  // Current book and chapter tracking
  const currentBook = ref<Novel | null>(null)
  const currentChapter = ref(0)
  
  // Reading history tracking
  const readingHistory = ref<Record<number, number[]>>({}) // bookId -> chapterIds[]
  
  // Reader settings with default values
  const settings = ref<ReaderSettings>({
    theme: 'default',
    fontFamily: 'system',
    fontSize: 18,
    contentWidth: 'auto',
    pageMode: 'scroll'
  })

  // Set current book
  function setCurrentBook(book: Novel) {
    currentBook.value = book
  }

  // Set current chapter and record in reading history
  function setCurrentChapter(chapterId: number) {
    currentChapter.value = chapterId
    
    // Record in reading history if we have a current book
    if (currentBook.value) {
      if (!readingHistory.value[currentBook.value.id]) {
        readingHistory.value[currentBook.value.id] = []
      }
      
      // Add to history if not already there
      if (!readingHistory.value[currentBook.value.id].includes(chapterId)) {
        readingHistory.value[currentBook.value.id].push(chapterId)
      }
    }
  }

  // Update a specific setting
  function updateSetting<K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) {
    settings.value[key] = value
  }

  return {
    currentBook,
    currentChapter,
    readingHistory,
    settings,
    setCurrentBook,
    setCurrentChapter,
    updateSetting,
  }
}, {
    persist: true,
})
