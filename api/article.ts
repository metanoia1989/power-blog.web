
/**
 * 获取文章总数
 * @returns {Promise}
 */
export function getArticleCount() {
  return $request.get({
    url: '/article/count',
  })
}

/**
 * 搜索文章，返回文章列表
 * @param {string} q 搜索关键词
 * @returns Promise
 */
export function searchArticle({ q = '' }) {
  return $request.get({
    url: `/article/search`,
    params: {
      keyword: q,
      page_no: 1,
      page_size: 10,
    },
  })
}

/**
 * 获取文章分类
 * @returns {Promise}
 */
export function getCategories() {
  return $request.get({
    url: `/article/cate`,
  })
}

/**
 * 获取文章标签
 * @returns {Promise}
 */
export function getTags() {
  return $request.get({
    url: `/article/tag`,
  })
}

/**
 * 获取文章列表
 * @param {number} page 当前页码 
 * @param {number} pageSize 每页数量
 * @param {string} filter 过滤条件
 * @returns Promise
 */
export function getArticleList(params: any) {
  return $request.get({
    url: `/article/lists`,
    params: {
      ...params,
    },
  })
}

/**
 * 获取文章详情
 * @param {number} id 文章 id
 * @returns Promise
 */
export function getArticleDetail(slug: string) {
  return $request.get({
    url: `/article/detail?slug=${slug}`,
  })
}

/**
 * 获取相关文章
 * @param {string} slug 文章 slug
 * @returns Promise
 */
export function getRelativePosts(slug: string) {
  return $request.get({
    url: `/article/relative?slug=${slug}`,
  })
}

/**
 * 添加文章
 * @param {any} params 文章数据
 * @returns Promise
 */
export function addArticle(params: any) {
  return $request.post({
    url: `/article/add`,
    params: params,
  })
}

/**
 * 编辑文章
 * @param {any} params 文章数据
 * @returns Promise
 */
export function editArticle(params: any) {
  return $request.post({ url: '/article/edit', params })
}
