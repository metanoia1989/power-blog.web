export default defineNuxtPlugin((nuxtApp) => {
  return new Promise<void>((resolve) => {
    // 只在客户端执行
    if (import.meta.client) {
      // 配置 MathJax
      window.MathJax = {
        loader: { load: ['[tex]/ams'] },
        tex: { packages: { '[+]': ['ams'] }, tags: 'ams' },
        svg: { fontCache: 'none' },
      }

      // 创建并加载 script
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js'
      script.id = 'MathJax-script'
      script.async = true
      
      script.onload = () => {
        resolve()
      }

      document.head.appendChild(script)
    }
  })
}) 
