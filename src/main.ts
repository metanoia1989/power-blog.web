import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { Icon, addCollection } from '@iconify/vue'

import '@/assets/styles/tailwind.css'
import '@/assets/styles/index.scss'

import App from './App.vue'
import router from './router'
import { setupPlugins } from './plugins'
import iconCollections from './icons/collections'

const app = createApp(App)

// 图标走本地打包数据（见 scripts/gen-icons.mjs），不请求 iconify 线上接口
iconCollections.forEach((collection) => addCollection(collection))
app.component('Icon', Icon)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

setupPlugins(app)

app.mount('#root')
