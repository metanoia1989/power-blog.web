
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
    url: `/article/search?keyword=${q}`,
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
 * @param {number} page 当前页码 pageSize 每页数量
 * @returns Promise
 */
export function getArticleList({ page = 1, pageSize = 20, filter = '' }) {
  return $request.get({
    url: `/article/lists?page=${page}&per_page=${pageSize}${filter}`,
  })
}

/**
 * 获取文章详情
 * @param {number} id 文章 id
 * @returns Promise
 */
export function getArticleDetail(id: number) {
  return $request.get({
    url: `/article/${id}`,
  })
}
