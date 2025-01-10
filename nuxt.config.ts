// https://v3.nuxtjs.org/api/configuration/nuxt.config

import { getEnvConfig } from './nuxt/env'
import { fileURLToPath, URL } from 'url'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const envConfig = getEnvConfig()
console.log('ssr', !!envConfig.ssr)
export default defineNuxtConfig({
    // debug: true,
    css: ['@/assets/styles/index.scss'],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/assets/styles/mixins.scss" as *;`
                }
            }
        },
        server: {
            hmr: {
                overlay: false
            }
        },
        plugins: [
        ]
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
})
