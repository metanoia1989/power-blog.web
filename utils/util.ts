/**
 * @description 添加单位
 * @param {String | Number} value 值 100
 * @param {String} unit 单位 px em rem
 */
export const addUnit = (value: string | number, unit = 'px') => {
    return !Object.is(Number(value), NaN) ? `${value}${unit}` : value
}

/**
 * @description 树转数组，队列实现广度优先遍历
 * @param {Array} data  数据
 * @param {Object} props `{ children: 'children' }`
 */

export const treeToArray = (data: any[], props = { children: 'children' }) => {
    data = JSON.parse(JSON.stringify(data))
    const { children } = props
    const newData = []
    const queue: any[] = []
    data.forEach((child: any) => queue.push(child))
    while (queue.length) {
        const item: any = queue.shift()
        if (item[children]) {
            item[children].forEach((child: any) => queue.push(child))
            delete item[children]
        }
        newData.push(item)
    }
    return newData
}

/**
 * @description 获取正确的路经
 * @param {String} path  数据
 */
export function getNormalPath(path: string) {
    if (path.length === 0 || !path || path == 'undefined') {
        return path
    }
    const newPath = path.replace('//', '/')
    const length = newPath.length
    if (newPath[length - 1] === '/') {
        return newPath.slice(0, length - 1)
    }
    return newPath
}

/**
 * @description对象格式化为Query语法
 * @param { Object } params
 * @return {string} Query语法
 */
export function objectToQuery(params: Record<string, any>): string {
    let query = ''
    for (const props of Object.keys(params)) {
        const value = params[props]
        if (!isEmpty(value)) {
            query += props + '=' + value + '&'
        }
    }
    return query.slice(0, -1)
}

/**
 * @description 判断是否是微信浏览器
 * @return {Boolean}
 */
export function isWeixin() {
    let ua;
    if (import.meta.client) {
        ua = navigator.userAgent.toLowerCase()
    } else {
        const headers = useRequestHeaders(['user-agent'])
        ua = headers['user-agent']?.toLowerCase() ?? ''
    }
    if (ua.match(/MicroMessenger/i)?.[0]?.toLowerCase() === "micromessenger") {
        return true;
    }
    return false
}  

/**
 * @description 判断是否是手机访问
 * @return {Boolean}
 */
export function isMobile() {
    let ua;
    if (import.meta.client) {
        ua = navigator.userAgent.toLowerCase()
    } else {
        const headers = useRequestHeaders(['user-agent'])
        ua = headers['user-agent']?.toLowerCase() ?? ''
    }
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
}

/**
 * @description 格式化数字，千、万 
 * @param {Number} value 值
 * @return {String} 格式化后的字符串
 */
export function formatNumber(value: number) {
    if (value >= 10000) {
        return `${Math.floor(value / 10000)}万`
    }
    if (value >= 1000) {
        return `${Math.floor(value / 1000)}千`
    }
    return value.toString()
}