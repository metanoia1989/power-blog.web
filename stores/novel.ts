import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  getBookCount, searchBook, 
  getBookList,
  getBookDetails, 
} from '@/api/book'
import type { BookListResponse, Novel } from '@/typings/request'

export const useNovelStore = defineStore('novel', () => {
  const novels = ref<Novel[]>([])
  const totalCount = ref(0)
  const loading = ref(true)

  const getNovelsCount = async () => {
    const res = await getBookCount()
    totalCount.value = res.count
    return res.count
  }

  const fetchBookList = async (params: { page_no: number; page_size: number }) => {
    const res = await getBookList(params)
    return res as BookListResponse
  }

  const setAllNovels = (novelsList: Novel[]) => {
    novels.value = novelsList
  }

  const fetchNovel = async (slug: string) => {
    const res = await getBookDetails(slug)
    return res as Novel
  }

  return {
    novels,
    totalCount,
    loading,

    getNovelsCount,
    fetchBookList,
    setAllNovels,
    fetchNovel,
  }
  
})
