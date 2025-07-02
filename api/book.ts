/**
 * 获取书籍总数
 * @returns {Promise}
 */
export function getBookCount() {
  return $request.get({
    url: '/book/count',
  })
}

/**
 * 获取书籍列表
 * @returns {Promise}
 */
export function getBookList(params: any) {
  return $request.get({
    url: '/book/lists',
    params: {
      ...params,
    },
  })
}

/**
 * 搜索书籍
 * @returns {Promise}
 */
export function searchBook() {
  return $request.get({
    url: '/book/search',
  })
}

/**
 * 获取书籍详情
 * @param {Object} params - 请求参数
 * @param {string} [params.slug] - 书籍别名
 * @param {number} [params.id] - 书籍ID
 * @returns {Promise}
 */
export function getBookDetails(slug: string) {
  return $request.get({
    url: `/book/detail?slug=${slug}`,
  })
}

/**
 * 获取书籍详情
 * @param {number} id - 书籍ID
 * @returns {Promise}
 */
export function getBookDetailsById(id: number) {
  return $request.get({
    url: `/book/detail?id=${id}`,
  })
}

/**
 * 添加书籍
 * @param {Object} params - 书籍数据
 * @returns {Promise}
 */
export function addBook(params: any) {
  return $request.post({
    url: '/book/add',
    params,
  })
}

/**
 * 编辑书籍
 * @param {Object} params - 书籍数据
 * @returns {Promise}
 */
export function editBook(params: any) {
  return $request.post({
    url: '/book/edit',
    params,
  })
}

/**
 * 删除书籍
 * @param {number} id - 书籍ID
 * @returns {Promise}
 */
export function deleteBook(id: number) {
  return $request.post({
    url: '/book/delete',
    params: { id },
  })
}

/**
 * 添加卷
 * @param {Object} params - 卷数据
 * @returns {Promise}
 */
export function addVolume(params: any) {
  return $request.post({
    url: '/book/add_volume',
    params,
  })
}

/**
 * 编辑卷
 * @param {Object} params - 卷数据
 * @returns {Promise}
 */
export function editVolume(params: any) {
  return $request.post({
    url: '/book/edit_volume',
    params,
  })
}

/**
 * 删除卷
 * @param {number} id - 卷ID
 * @returns {Promise}
 */
export function deleteVolume(id: number) {
  return $request.post({
    url: '/book/delete_volume',
    params: { id },
  })
}

/**
 * 添加章节
 * @param {Object} params - 章节数据
 * @returns {Promise}
 */
export function addChapter(params: any) {
  return $request.post({
    url: '/book/add_chapter',
    params,
  })
}

/**
 * 编辑章节
 * @param {Object} params - 章节数据
 * @returns {Promise}
 */
export function editChapter(params: any) {
  return $request.post({
    url: '/book/edit_chapter',
    params,
  })
}

/**
 * 删除章节
 * @param {number} id - 章节ID
 * @returns {Promise}
 */
export function deleteChapter(id: number) {
  return $request.post({
    url: '/book/delete_chapter',
    params: { id },
  })
}

/**
 * 获取章节详情
 * @param {number} id - 章节ID
 * @returns {Promise}
 */
export function getChapter(id: number) {
  return $request.get({
    url: '/book/get_chapter',
    params: { id },
  })
}

/**
 * 获取章节列表
 * @returns {Promise}
 */
export function getChapterList(params: any) {
  return $request.get({
    url: '/book/chapter_list',
    params,
  })
}

/**
 * 获取章节数量
 * @returns {Promise}
 */
export function getChapterCount() {
  return $request.get({
    url: '/book/chapter_count',
  })
}

/**
 * 获取所有章节
 * @returns {Promise}
 */
export function getAllChapters() {
  return $request.get({
    url: '/book/chapter_all',
  })
}
