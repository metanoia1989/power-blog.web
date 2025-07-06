
import { translate } from '@/api/app'

export async function generateSlug(title: string) {
  if (!title) return ''

  // 修正英文匹配的正则，只匹配纯英文标题
  if (/^[\x00-\x7F]+$/.test(title)) {  // 或者使用 /^[a-zA-Z0-9\s\W]+$/
    return title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }

  // 对于非英文标题，使用翻译服务
  const { slug } = await translate({ title: title })
  return slug
}