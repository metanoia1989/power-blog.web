import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getArticleCount, searchArticle, getArticleList } from '@/api/article'
import { getWeiboCount, getWeiboList, searchWeibo } from '@/api/weibo'

export const useArticleStore = defineStore('article', () => {
  // state
  const allPosts = ref([])
  const allWeibo = ref([])
  const categories = ref([])
  const currentCategory = ref({})
  const currentLink = ref(0)

  // actions
  async function getPostsCount() {
    const res = await getArticleCount().catch((err) => {
      throw new Error(err)
    })
    return res?.count || 0
  }

  async function searchPosts(params: any) {
    const data = await searchArticle(params).catch((err) => {
      throw new Error(err)
    })
    
    const searchCount = data.length
    const posts = data.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      desc: post.desc,
      tags: post.tags,
      feature_image: post.feature_image,
      article_count: post.article_count,
      created_at: parseDate(post.created_at),
    }))
    return { 
      searchCount, 
      posts, 
      count: data?.count,
      page_no: data?.page_no,
      page_size: data?.page_size,
    }
  }
  async function fetchArticleList(params: any) {
    const res = await getArticleList(params).catch((err) => {
      throw new Error(err)
    })
    const posts = res?.lists.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      desc: post.desc,
      tags: post.tags,
      feature_image: post.feature_image,
      article_count: post.article_count,
      created_at: parseDate(post.created_at),
      created_at_raw: post.created_at,
    })) || []
    return { 
      searchCount: posts.length, posts, 
      count: res?.count,
      page_no: res?.page_no,
      page_size: res?.page_size,
    }
  }

  async function getWeiboListCount() {
    const res = await getWeiboCount().catch((err) => {
      throw new Error(err)
    })
    return res?.count || 0
  }

  async function fetchWeiboList(params: { page_no?: number; page_size?: number; filter?: string } = {}) {
    const res = await getWeiboList(params).catch((err) => {
      throw new Error(err)
    })
    return res?.lists || []
  }

  async function searchWeiboList(keyword: string) {
    const res = await searchWeibo({ q: keyword }).catch((err) => {
      throw new Error(err)
    })
    return res?.lists || []
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

  function setCurrentLink(link: any) {
    currentLink.value = link
  }

  function setAllWeibo(weibo: any[]) {
    allWeibo.value = weibo
  }


  return {
    // state
    allPosts,
    categories,
    currentCategory,
    currentLink,
    allWeibo,

    // actions
    getPostsCount,
    searchPosts,
    getWeiboListCount,
    fetchWeiboList,
    searchWeiboList,
    fetchArticleList,

    // mutations
    setAllPosts,
    setCategories,
    setCurrentCategory,
    setCurrentLink,
    setAllWeibo,
  }
})
