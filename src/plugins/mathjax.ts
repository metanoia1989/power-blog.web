import type { App } from 'vue'

/**
 * MathJax 走 CDN 异步加载（原来是 plugins/mathjax.client.ts）。
 * markdown 渲染器在 MathJax 未就绪时会退回原始文本，所以不阻塞首屏。
 */
export function setupMathJax(_app: App) {
    if (typeof document === 'undefined') return
    if (document.getElementById('MathJax-script')) return

    window.MathJax = {
        loader: { load: ['[tex]/ams'] },
        tex: { packages: { '[+]': ['ams'] }, tags: 'ams' },
        svg: { fontCache: 'none' }
    } as any

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js'
    script.id = 'MathJax-script'
    script.async = true
    document.head.appendChild(script)
}
