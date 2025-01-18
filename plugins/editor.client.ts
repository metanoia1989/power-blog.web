
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';

export default defineNuxtPlugin((nuxtApp) => {
  VueMarkdownEditor.use(githubTheme, {
    Hljs: hljs,
  });
  nuxtApp.vueApp.use(VueMarkdownEditor)
})
