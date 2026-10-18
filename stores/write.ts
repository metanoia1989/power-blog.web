import { defineStore } from 'pinia'
import type { NovelVolume, NovelChapter } from '@/typings/request'

export const useWriteStore = defineStore('write', () => {
}, {
    persist: true
})
