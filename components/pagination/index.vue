<script setup>
import { ref, computed, watch, onCreated } from 'vue'

// Props 定义
const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 12,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
})

// Emits 定义
const emit = defineEmits(['update:currentPage', 'pageChange'])

const pageList = ref([])

// Computed
const totalPage = computed(() => {
  return Math.ceil(props.total / props.pageSize)
})

const current = computed({
  get: () => props.currentPage,
  set: (val) => emit('update:currentPage', val)
})

const showPrevDot = computed(() => {
  return pageList.value[2] - 2 > 1
})

const showNextDot = computed(() => {
  return totalPage.value - pageList.value[2] > 1
})

// Methods
const initData = () => {
  pageList.value = []
  let i = 1
  do {
    pageList.value.push(i)
    i++
  } while (i <= totalPage.value)
  pageList.value.length > 4 && pageList.value.splice(4)
}

const calcPage = (val) => {
  if (totalPage.value <= 4)
    return
  if (val < 4) {
    pageList.value = []
    let i = 1
    do {
      pageList.value.push(i)
      i++
    } while (i <= totalPage.value)
    pageList.value.length > 4 && (pageList.value = pageList.value.slice(0, 4))
  }
  else if (val === totalPage.value) {
    pageList.value = [val - 3, val - 2, val - 1, val]
  }
  else if (val === totalPage.value - 1) {
    pageList.value = [val - 2, val - 1, val, val + 1]
  }
  else {
    pageList.value = [val - 2, val - 1, val, val + 1]
  }
}

const pageChange = (e) => {
  if (e.target.classList.contains('prev') || e.target.classList.contains('btn-prev')) {
    if (props.currentPage === 1)
      return
    current.value--
  }
  else if (e.target.classList.contains('next') || e.target.classList.contains('btn-next')) {
    if (props.currentPage === totalPage.value)
      return
    current.value++
  }
  else if (e.target.classList.contains('btn-num')) {
    if (props.currentPage === Number(e.target.innerText))
      return
    current.value = Number(e.target.innerText)
  }
  else {
    return
  }
  emit('pageChange', current.value)
}

// Watchers
watch(() => props.currentPage, (val) => {
  calcPage(val)
})

watch(totalPage, () => {
  initData()
  calcPage(props.currentPage)
})

// Lifecycle
onCreated(() => {
  initData()
  calcPage(props.currentPage)
})
</script>

<template>
  <div class="pagination" @click="pageChange">
    <p v-if="currentPage === totalPage">
      已经是最后一篇文章了~
    </p>
    <div v-if="totalPage > 1" class="btn-wrap">
      <button class="btn btn-prev" :disabled="currentPage === 1">
        <i class="prev" />
      </button>
      <span v-if="showPrevDot">...</span>
      <button v-for="n in pageList" :key="n" class="btn btn-num" :class="currentPage === n ? 'active' : ''">
        {{ n }}
      </button>
      <span v-if="showNextDot">...</span>
      <button class="btn btn-next" :disabled="currentPage === totalPage">
        <i class="next" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  user-select: none;
  transition: .3s;
  p {
    font-size: 1em;
    color: var(--minor);
    margin-bottom: 2em;
  }
  .btn-wrap {
    display: flex;
    gap: 1em;
    justify-content: center;
    align-items: center;
    .btn {
      position: relative;
      font-size: 1.3rem;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      text-align: center;
      background-color: var(--bg-thin);
      border: 1px solid var(--thin);
      color: var(--minor);
      cursor: pointer;
      transition: .3s;
      i {
        position: absolute;
        top: 18px;
        left: 20px;
        display: inline-block;
        border: solid var(--minor);
        border-width: 0 2px 2px 0;
        padding: 5px;
      }
      .next {
        left: 17px;
        transform: rotate(-45deg);
        vertical-align: middle;
      }
      .prev {
        transform: rotate(135deg);
      }
      &:hover {
        background-color: var(--primary);
        color: white;
        i {
          border-color: white;
        }
      }
      &.active {
        border-color: var(--primary);
        color: var(--primary);
        &:hover {
          background-color: var(--bg-thin);
        }
      }
      &:disabled {
        cursor: not-allowed;
        background-color: var(--bg-major);
        &:hover {
          i {
            border-color: var(--minor);
          }
        }
      }
    }
  }
  @include xs-layout {
    & {
      transform: scale(.7);
    }
  }
}
</style>
