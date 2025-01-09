export function getUserCenter(headers?: any) {
    return $request.get({ url: '/user/center', headers })
}

// 个人信息
export function getUserInfo() {
    return $request.get({ url: '/user/info' })
}

// 个人编辑
export function userEdit(params: any) {
    return $request.post({ url: '/user/setInfo', params })
}

/**
 * 获取关于我
 * @returns Promise
 */
export function getAboutSelf() {
  return $request.get({
    url: `/user/about`,
  })
}
