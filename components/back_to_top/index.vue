<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const display = ref(false)
const isFirstScreen = ref(true)
const prevScrollTop = ref(0)

watch(isFirstScreen, (val) => {
  display.value = !val
})

const backToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  if (!isFirstScreen.value)
    display.value = scrollTop < prevScrollTop.value
  isFirstScreen.value = scrollTop === 0
  prevScrollTop.value = scrollTop
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <transition name="fade">
    <div v-if="display" class="back-to-top" @click="backToTop">
      <SvgIcon name="backtop" />
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.back-to-top {
  position: fixed;
  right: .4em;
  bottom: 1em;
  padding: .4em;
  border-radius: .5em;
  background-color: var(--bg-thin);
  @include box-shadow;
  font-size: 1.4rem;
  cursor: pointer;
  svg {
    color: var(--accent);
  }
  &:hover {
    background-color: var(--bg-thin-hover);
  }
  @include xs-layout {
    & {
      bottom: 80px;
    }
  }
}
.fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(80px);
}
</style>
