<template>
  <div class="novel-page"> 
    <div class="novel-list">
      <div class="novels-wrap">
        <Loading v-if="loading" />
        <transition name="from-bottom">
          <div v-if="!loading" class="novels">
            <RouterLink
              v-for="novel in novels"
              :key="novel.id"
              :to="`/novel/${novel.slug}`"
            >
              <NovelCard
                :novel="novel"
              />
            </RouterLink>
          </div>
        </transition>
      </div>
      <Pagination
        v-model:current-page="currentPage"
        :total="totalCount"
        :page-size="pageSize"
        @pageChange="pageChangeFn"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Loading from '@/components/loading/index.vue'
import Pagination from '@/components/pagination/index.vue'

import NovelCard from '@/components/novel_card/index.vue'
import { useNovelStore } from '@/stores/novel'
import type { Novel } from '@/typings/request'
import $message from '@/components/message/plugin'



const route = useRoute()
const store = useNovelStore()

// 状态
const novels = ref<Novel[]>([])
const totalCount = ref(0)
const loading = ref(true)
const { currentPage, pageSize } = usePagination()

// 方法
const pageChangeFn = () => {
  novels.value = []
  loading.value = true
  getNovelsFn()
}

const getNovelsFn = async () => {
  loading.value = true
  try {
    const novelList = await store.fetchBookList({
      page_no: currentPage.value,
      page_size: pageSize.value,
    })

    novels.value = novelList.lists || []
    totalCount.value = novelList.count || 0
  } catch (err) {
    $message({
      content: '获取小说列表失败',
      type: 'error',
    })
    throw new Error(err instanceof Error ? err.message : String(err))
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  getNovelsFn()
})
</script>

<style lang="scss" scoped>
.from-bottom-enter-active {
  transition: all 0.3s ease;
}
.from-bottom-enter {
  opacity: 0;
  transform: translateY(30px);
}
.novel-page {
  margin-top: 1em;
}
.novel-list {
  .novels-wrap {
    position: relative;
    width: 100%;
    min-height: 200px;
    margin: 0 auto;
    margin-top: 1em;

    .novels {
      width: 100%;
      display: flex;
      gap: 1em;
      flex-wrap: wrap;
      & > a {
        margin: 0;
        width: calc(100% / 3 - 10.7px);
        > div {
          width: 100%;
          height: 100%;
        }
      }
    }
    @media screen and (min-width: 876px) {
      max-width: 876px;
    }
    @media screen and (max-width: 876px) {
      .novels {
        padding-left: 9px;
      }
    }
    @include sm-layout {
      .novels {
        padding: 0 calc(1em - 9px) 0 1em;
        & > a {
          width: calc(100% / 2 - 8px);
        }
      }
    }
    @include xs-layout {
      .novels {
        & > a {
          width: 100%;
        }
      }
    }
  }
}
</style>
