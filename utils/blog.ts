import { useStyleStore } from '@/stores/style'

export function setTheme() {
    const html = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const store = useStyleStore()
    function listenThemeChange(e: any) {
        const prefersDarkMode = e.matches
        if (prefersDarkMode)
            store.setTheme('dark')
        else
            store.setTheme('light')
    }
    if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', listenThemeChange)
    } else if (typeof media.addListener === 'function') {
        media.addListener(listenThemeChange)
    }
    html.setAttribute('data-theme', store.theme.value)
}

/**
 * 解析时间为 xxx 前
 * @param {*} date 时间戳/字符串/Date对象/时间格式字符串
 * @returns string 1年前/1个月前/1天前/1小时前/1分钟前/1秒前
 */
export function parseDate(date: string | number | Date) {
    const c = new Date()
    const d = new Date(date) || c
    const diff = c.getTime() - d.getTime()
    const map = [
        { text: '年前', value: 1000 * 60 * 60 * 24 * 365 },
        { text: '个月前', value: 1000 * 60 * 60 * 24 * 30 },
        { text: '天前', value: 1000 * 60 * 60 * 24 },
        { text: '小时前', value: 1000 * 60 * 60 },
        { text: '分钟前', value: 1000 * 60 },
        { text: '秒前', value: 1000 },
    ]
    let result = ''
    for (let i = 0; i < map.length; i++) {
        const { text, value } = map[i]
        const n = Math.floor(diff / value)
        if (n > 0) {
            result = `${n} ${text}`
            break
        }
    }
    return result
}

/**
 * 格式化时间
 * @param {*} time 时间戳/字符串/Date对象/时间格式字符串
 * @returns string yyyy-mm-dd hh:mm:ss
 */
export function formatTime(time: string | number | Date) {
    const date = new Date(time)
    // 格式化时间为 yyyy-mm-dd hh:mm:ss
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const formatNumber = (n: number) => n.toString().padStart(2, '0')
    const t = [year, month, day].map(formatNumber).join('-')
    const h = [date.getHours(), date.getMinutes(), date.getSeconds()].map(formatNumber).join(':')
    return `${t} ${h}`
}

/**
 * 设置当前滚动到的目录
 * @param {*} selector 目录中 a 标签的选择器
 * @returns currentLink 当前滚动到的目录的索引
 */
export function updateCurrentLink(selector: string) {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const tocLinks = document.querySelectorAll(selector)
    const offsetTopList = [scrollTop]
    let currentLink = 0
    tocLinks.forEach((item) => {
        const id: string = item.getAttribute('href')
        const el = document.querySelector(id)
        const offsetTop = el.getBoundingClientRect().top + window.pageYOffset
        offsetTopList.push(offsetTop)
    })
    offsetTopList.sort((a, b) => {
        return a - b
    })
    currentLink = offsetTopList.findIndex((item, index) => {
        return item <= scrollTop && offsetTopList[index + 1] > scrollTop
    })
    if (scrollTop >= offsetTopList[offsetTopList.length - 1])
        currentLink = offsetTopList.length - 2
    if (scrollTop <= offsetTopList[0])
        currentLink = 0
    tocLinks.forEach((item) => {
        item.classList.remove('active')
    })
    tocLinks[currentLink]?.classList.add('active')
    return currentLink
}

/**
 * 将 hex 颜色值转换为 hsl 颜色值
 * @param {*} hex 颜色值 #ffffff
 * @returns h, s%, l%
 */
export function hexToHsl(hex: string) {
    let r = Number.parseInt(hex.substring(1, 3), 16)
    let g = Number.parseInt(hex.substring(3, 5), 16)
    let b = Number.parseInt(hex.substring(5, 7), 16)

    r /= 255
    g /= 255
    b /= 255

    const min = Math.min(r, g, b)
    const max = Math.max(r, g, b)

    let h: number = 0
    let s: number = 0
    let l: number = (max + min) / 2

    if (max === min) {
        h = 0
        s = 0
    }
    else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }

        h /= 6
    }

    h = Math.round(h * 360)
    s = Math.round(s * 100)
    l = Math.round(l * 100)

    return `${h}, ${s}%, ${l}%`
}


/**
 * 处理文章归档
 * @param {*} archives
 * @returns
 */
export function parseArchives(archives: any) {
    const map = new Map()
    archives.forEach((archive: any) => {
        const year = archive.created_at.slice(0, 4)
        const key = `${year}`
        if (!map.has(key))
            map.set(key, [])
        map.get(key).push(archive)
    })
    return Object.fromEntries(map)
}

/**
 * 对归档进行排序
 * @param {*} archiveMap
 * @returns
 */
export function sortArchiveMap(archiveMap: any) {
    Object.keys(archiveMap).forEach((key: any) => {
        // @ts-ignore
        return archiveMap[key].sort((a: any, b: any) => new Date(b.created_at) - new Date(a.created_at))
    })
    return archiveMap
}
