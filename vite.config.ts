import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ command }) => ({
    plugins: [
        vue(),
        // 等价于 Nuxt 的自动导入：utils/ composables/ stores/ 下的东西不用手写 import
        AutoImport({
            imports: ['vue', 'vue-router', 'pinia'],
            dirs: ['utils/**', 'composables/**', 'stores/**'],
            dts: 'typings/auto-imports.d.ts',
            eslintrc: { enabled: false }
        }),
        // 等价于 Nuxt 的组件自动注册：components/**/index.vue -> PascalCase 组件名
        Components({
            dirs: ['components'],
            extensions: ['vue'],
            deep: true,
            dts: 'typings/components.d.ts'
        })
    ],
    define: {
        // Nuxt 的编译期常量。SPA 里永远是客户端，直接固化成常量，
        // 顺带让 `if (import.meta.client)` 的分支被摇树优化掉。
        'import.meta.client': 'true',
        'import.meta.server': 'false',
        'import.meta.dev': 'import.meta.env.DEV'
    },
    resolve: {
        alias: [
            // Nuxt 里的 ~/ ~~/ @@/ @/ 全部指向项目根目录，这里保持一致
            { find: /^~~\//, replacement: root },
            { find: /^@@\//, replacement: root },
            { find: /^~\//, replacement: root },
            { find: /^@\//, replacement: root }
        ]
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                additionalData: `@use "@/assets/styles/mixins.scss" as *;`
            }
        }
    },
    server: {
        port: 3000,
        host: true
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        chunkSizeWarningLimit: 2000,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['vue', 'vue-router', 'pinia'],
                    element: ['element-plus']
                }
            }
        }
    }
}))
