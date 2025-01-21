// https://v3.nuxtjs.org/api/configuration/nuxt.config

import { getEnvConfig } from './nuxt/env'
import { fileURLToPath } from 'url'

const envConfig = getEnvConfig()

export default defineNuxtConfig({
    compatibilityDate: '2024-11-19',
    // debug: true,
    devtools: { enabled: true },
    // nitro: {
    //     debug: true
    // },
    sourcemap: {
        server: true,
        client: true
    },
    css: ['~/assets/styles/index.scss'],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler', 
                    additionalData: `
                        @use "~/assets/styles/mixins.scss" as *;
                    `,
                }
            }
        },
        server: {
            hmr: {
                overlay: false
            }
        },
        plugins: [

        ],
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
    experimental: { appManifest: false },
})
