import { getClient } from '~~/utils/env'

// 登录
export function login(params: any) {
    return $request.post({
        url: '/login/account',
        params: { ...params, terminal: getClient() }
    })
}
// 登录
export function logout() {
    return $request.post({ url: '/login/logout' })
}

//注册
export function register(params: any) {
    return $request.post({
        url: '/login/register',
        params: { ...params, terminal: getClient() }
    })
}
// 发送激活码
export function sendActiveCode(params: any) {
    return $request.post({
        url: '/login/sendActiveCode',
        params: { ...params }
    })
}
