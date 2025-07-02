// 定义 Novel 相关 接口
export interface NovelAuthor {
  id: number
  name: string
  profile_image: string
  bio?: string
  slug?: string
  status?: number
  last_seen_at?: string
}

export interface NovelContent {
  id: number
  chapter_id: number
  content_type: string
  plain_text: string
  html: string
  sort: number
  created_at: string
  updated_at: string
}

export interface NovelChapter {
  id: number
  book_id: number
  volume_id: number
  title: string
  slug: string
  words_num: number
  is_show: boolean
  sort: number
  visit: number
  created_at: string
  updated_at: string
  content?: NovelContent
}

export interface NovelVolume {
  id: number
  book_id: number
  title: string
  slug: string
  is_show: boolean
  sort: number
  chapters?: NovelChapter[]
}

export interface Novel {
  id: number
  slug: string
  title: string
  description?: string
  visibility_desc?: string
  uuid: string
  visit?: number
  created_at: string
  updated_at: string
  feature_image?: string
  published_at?: string
  tags?: {
    id: number
    name: string
    color: string
  }[]
  volumes?: NovelVolume[]
  author?: NovelAuthor
  [key: string]: any
}

// 定义 API 响应接口
export interface BookListResponse {
  lists: Novel[]
  count: number
}
