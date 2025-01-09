<script lang="ts" setup>
import { ID_INJECTION_KEY, ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useAppStore } from './stores/app'

provide(ID_INJECTION_KEY, {
    prefix: 100,
    current: 0
})
const config = {
    locale: zhCn
}
const appStore = useAppStore()
// const { pc_title, pc_ico, pc_keywords, pc_desc } = appStore.getWebsiteConfig
// const headOptions: any = {
//     title: pc_title,
//     meta: [
//         { name: 'description', content: pc_desc },
//         { name: 'keywords', content: pc_keywords }
//     ],
//     link: [
//         {
//             rel: 'icon',
//             href: pc_ico
//         }
//     ],
//     script: []
// }

// if (clarity_code) {
//     headOptions.script.push({
//         type: 'text/javascript',
//         innerHTML: ``
//     })
// }
// useHead(headOptions)
</script>
<template>
    <ElConfigProvider v-bind="config">
        <NuxtLayout>
            <NuxtLoadingIndicator color="#6F7BC7" :height="2" />
            <NuxtPage />
        </NuxtLayout>
    </ElConfigProvider>
</template>
