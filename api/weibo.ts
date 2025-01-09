

/**
 * 获取微博总数
 * @returns {Promise}
 */
export function getWeiboCount() {
  return $request.get({
    url: '/weibo/count',
  })
}

/**
 * 获取微博列表
 * @param {number} page 当前页码 pageSize 每页数量
 * @returns Promise
 */
export function getWeiboList({ page = 1, pageSize = 20, filter = '' }) {
  return $request.get({
    url: `/weibo/lists?page=${page}&per_page=${pageSize}${filter}`,
  })
}

/**
 * 获取微博详情
 * @param {number} id 微博 id
 * @returns Promise
 */
export function getWeiboDetail(id: number) {
  return $request.get({
    url: `/weibo/${id}`,
  })
}


/**
 * 搜索微博，返回微博列表
 * @param {string} q 搜索关键词
 * @returns Promise
 */
export function searchWeibo({ q = '' }) {
  return $request.get({
    url: `/weibo/search?keyword=${q}`,
  })
}
