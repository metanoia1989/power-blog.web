// https://v3.nuxtjs.org/api/configuration/nuxt.config

import { svgBuilder } from './components/svg_icon/svgBuilder'
import { getEnvConfig } from './nuxt/env'

const envConfig = getEnvConfig()
export default defineNuxtConfig({
    debug: true,
    css: ['@/assets/styles/index.scss'],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/assets/styles/mixins.scss" as *;`
                }
            }
        },
    },
    modules: [
        '@pinia/nuxt', 
        '@nuxtjs/tailwindcss', 
        '@element-plus/nuxt',
        '@nuxt/icon'
    ],
    app: {
        baseURL: envConfig.baseUrl
    },
    runtimeConfig: {
        public: {
            ...envConfig
        }
    },
    ssr: !!envConfig.ssr,
    icon: {
        customCollections: [
            {
                dir: './assets/images/icons/',
                prefix: 'svg'
            }
        ]
    }
})
