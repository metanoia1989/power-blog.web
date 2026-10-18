import type { App } from 'vue'
import VueMarkdownEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import hljs from 'highlight.js'

/**
 * 文章编辑页用的 v-md-editor（原来是 plugins/editor.client.ts）。
 */
export function setupEditor(app: App) {
    VueMarkdownEditor.use(githubTheme, {
        Hljs: hljs
    })
    app.use(VueMarkdownEditor)
}
