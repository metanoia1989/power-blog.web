/* eslint-disable max-statements-per-line */
import { Marked } from 'marked'
import { initRenderer } from './renderer/renderer'
import { css2json, customCssWithTemplate, customizeTheme } from './renderer/style'
import { themeMap, themeOptions } from './renderer/theme'
import { colorOptions, cssContentConfig, fontFamilyOptions, fontSizeOptions } from './renderer/options'

const marked = new Marked()

const getCurrentTab = () => cssContentConfig.tabs.find((tab) => {
  return tab.name === cssContentConfig.active
})!

class MarkIt {
  renderer: ReturnType<typeof initRenderer>

  isMacCodeBlock: boolean = true
  theme: string = themeOptions[0].value
  fontFamily: string = fontFamilyOptions[0].value
  fontSize: string = fontSizeOptions[2].value
  primaryColor: string = colorOptions[0].value
  isUseIndent: boolean = false

  get fontSizeNumber() {
    return Number(this.fontSize.replace(`px`, ``))
  }


  constructor() {

    this.renderer = initRenderer({
      theme: customCssWithTemplate(
        css2json(getCurrentTab().content), 
        this.primaryColor, 
        customizeTheme(themeMap[this.theme], 
          { fontSize: this.fontSizeNumber, color: this.primaryColor }
        )
      ),
      fonts: this.fontFamily,
      size: this.fontSize,
      isUseIndent: this.isUseIndent,
    })
  }


  async parse(data: string) {
    if (data) {
      // 处理零宽字符
      // eslint-disable-next-line no-misleading-character-class
      data = data.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, '')
      const { markdownContent } = this.renderer.parseFrontMatterAndContent(data)
      let content = await marked.parse(markdownContent)
      content.replace(/(style=".*?)"/, `$1;margin-top: 0"`)  // 去除第一行的 margin-top
      content += this.renderer.buildFootnotes() // 引用脚注
      content += this.renderer.buildAddition() // 附加的一些 style

      if (this.isMacCodeBlock) {
        content += `
          <style>
            .hljs.code__pre > .mac-sign {
              display: flex;
            }
          </style>
        ` 
      }

      content +=  `
        <style>
          .code__pre {
            padding: 0 !important;
          }

          .hljs.code__pre code {
            display: -webkit-box;
            padding: 0.5em 1em 1em;
            overflow-x: auto;
            text-indent: 0;
          }
        </style>
      `

      const toc = this.renderer.getTocHtml()
      return { content, toc }
    }
    else {
      return null
    }
  }
}

export default MarkIt
