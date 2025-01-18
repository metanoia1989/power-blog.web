

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
 * @param {number} page_no 当前页码 page_size 每页数量
 * @returns Promise
 */
export function getWeiboList(params: any) {
  return $request.get({
    url: `/weibo/lists`,
    params: {
      ...params,
    },
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

/**
 * 添加微博
 * @param {any} params 微博数据
 * @returns Promise
 */
export function addWeibo(params: any) {
  return $request.post({ url: '/weibo/add', params })
}
