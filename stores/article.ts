import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getArticleCount, searchArticle } from '@/api/article'
import { getWeiboCount, getWeiboList, searchWeibo } from '@/api/weibo'

export const useArticleStore = defineStore('article', () => {
  // state
  const allPosts = ref([])
  const allWeibo = ref([])
  const categories = ref([])
  const currentCategory = ref({})
  const currentPage = ref(1)
  const currentLink = ref(0)
  const weiboCurrentPage = ref(1)
  const weiboPageSize = ref(20)

  // actions
  async function getPostsCount() {
    const res = await getArticleCount().catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    return res.data.data?.repository?.issues.totalCount || 0
  }

  async function searchPosts(params: any) {
    const res = await searchArticle(params).catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    
    const searchCount = res.data.total_count
    const posts = res.data.items.map((post: any) => ({
      id: post.id,
      number: post.number,
      title: post.title,
      url: post.url,
    }))
    return { searchCount, posts }
  }

  async function getWeiboListCount() {
    const res = await getWeiboCount().catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    return res.data.total || 0
  }

  async function fetchWeiboList(params: { page?: number; pageSize?: number; filter?: string } = {}) {
    const res = await getWeiboList(params).catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    return res.data.items || []
  }

  async function searchWeiboList(keyword: string) {
    const res = await searchWeibo({ q: keyword }).catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    return res.data.items || []
  }

  // mutations become simple assignments
  function setAllPosts(posts: any) {
    allPosts.value = posts
  }

  function setCategories(newCategories: any) {
    categories.value = newCategories
  }

  function setCurrentCategory(category: any) {
    currentCategory.value = category
  }

  function setCurrentPage(page: any) {
    currentPage.value = page
  }

  function setCurrentLink(link: any) {
    currentLink.value = link
  }

  function setAllWeibo(weibo: any[]) {
    allWeibo.value = weibo
  }

  function setWeiboCurrentPage(page: number) {
    weiboCurrentPage.value = page
  }

  return {
    // state
    allPosts,
    categories,
    currentCategory,
    currentPage,
    currentLink,
    allWeibo,
    weiboCurrentPage,
    weiboPageSize,

    // actions
    getPostsCount,
    searchPosts,
    getWeiboListCount,
    fetchWeiboList,
    searchWeiboList,

    // mutations
    setAllPosts,
    setCategories,
    setCurrentCategory,
    setCurrentPage,
    setCurrentLink,
    setAllWeibo,
    setWeiboCurrentPage,
  }
})
