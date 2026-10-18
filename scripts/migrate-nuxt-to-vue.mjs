#!/usr/bin/env node
/**
 * Nuxt -> Vue3 迁移的一次性脚本（已执行，保留下来方便 review 与回滚）。
 *
 * 处理：
 *  1. NuxtLink -> RouterLink
 *  2. 删除 definePageMeta(...)（meta 已挪到 src/router/index.ts）
 *  3. `from '#app'` 的导入：useRoute/useRouter -> vue-router，useNuxtApp -> 删除
 *  4. `const { $message } = useNuxtApp()` -> 改为直接 import $message
 *  5. navigateTo(...) -> router.push(...)
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const files = execSync(
    "find pages components layouts -name '*.vue' -not -path '*/node_modules/*'",
    { encoding: 'utf8' }
)
    .trim()
    .split('\n')
    .filter(Boolean)

const MESSAGE_IMPORT = "import $message from '@/components/message/plugin'"

/** 删除 definePageMeta({...})，支持嵌套括号 */
function stripDefinePageMeta(src) {
    let out = src
    for (;;) {
        const idx = out.indexOf('definePageMeta(')
        if (idx === -1) return out
        let depth = 0
        let end = -1
        for (let i = idx + 'definePageMeta'.length; i < out.length; i++) {
            const ch = out[i]
            if (ch === '(') depth++
            else if (ch === ')') {
                depth--
                if (depth === 0) {
                    end = i
                    break
                }
            }
        }
        if (end === -1) return out
        let start = idx
        let stop = end + 1
        // 连同行尾分号、前后空行一起去掉
        while (out[stop] === ';') stop++
        while (out[start - 1] === ' ' || out[start - 1] === '\t') start--
        if (out[start - 1] === '\n') start--
        out = out.slice(0, start) + out.slice(stop)
    }
}

/** 在 script 块最后一个 import 之后插入一行 */
function insertAfterImports(src, line) {
    const scriptStart = src.indexOf('<script')
    if (scriptStart === -1) return src
    const bodyStart = src.indexOf('>', scriptStart) + 1
    const scriptEnd = src.indexOf('</script>', bodyStart)
    const body = src.slice(bodyStart, scriptEnd)

    const importRe = /^[ \t]*import[\s\S]*?from\s*['"][^'"]+['"];?[ \t]*$|^[ \t]*import\s*['"][^'"]+['"];?[ \t]*$/gm
    let last = null
    let m
    while ((m = importRe.exec(body))) last = m

    if (!last) {
        return src.slice(0, bodyStart) + '\n' + line + '\n' + src.slice(bodyStart)
    }
    const at = bodyStart + last.index + last[0].length
    return src.slice(0, at) + '\n' + line + src.slice(at)
}

const report = []

for (const file of files) {
    const before = readFileSync(file, 'utf8')
    let src = before
    const notes = []

    // 1. NuxtLink -> RouterLink
    if (/<NuxtLink\b|<\/NuxtLink>/.test(src)) {
        src = src.replace(/<NuxtLink\b/g, '<RouterLink').replace(/<\/NuxtLink>/g, '</RouterLink>')
        notes.push('NuxtLink->RouterLink')
    }

    // 2. definePageMeta
    if (src.includes('definePageMeta(')) {
        src = stripDefinePageMeta(src)
        notes.push('removed definePageMeta')
    }

    // 3. #app imports
    src = src.replace(
        /^[ \t]*import\s*\{([^}]*)\}\s*from\s*['"]#app['"];?[ \t]*$/gm,
        (_line, names) => {
            const list = names
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            const kept = list.filter((n) => n === 'useRoute' || n === 'useRouter')
            const dropped = list.filter((n) => !kept.includes(n))
            if (dropped.length) notes.push(`dropped ${dropped.join('+')} from #app`)
            if (!kept.length) return ''
            return `import { ${kept.join(', ')} } from 'vue-router'`
        }
    )

    // 4. useNuxtApp 取 $message
    if (/const\s*\{\s*\$message\s*\}\s*=\s*useNuxtApp\(\)/.test(src)) {
        src = src.replace(/^[ \t]*const\s*\{\s*\$message\s*\}\s*=\s*useNuxtApp\(\)\s*;?[ \t]*\n?/gm, '')
        notes.push('useNuxtApp->$message import')
    }
    if (/\buseNuxtApp\(/.test(src)) {
        notes.push('!! 仍然残留 useNuxtApp')
    }

    // 5. navigateTo -> router.push
    if (/\bnavigateTo\(/.test(src)) {
        src = src.replace(/\bnavigateTo\(/g, 'router.push(')
        if (!/from\s*['"]vue-router['"]/.test(src) || !/\buseRouter\b/.test(src)) {
            const m = src.match(/^[ \t]*import\s*\{([^}]*)\}\s*from\s*['"]vue-router['"];?[ \t]*$/m)
            if (m) {
                const names = m[1].split(',').map((s) => s.trim()).filter(Boolean)
                if (!names.includes('useRouter')) names.push('useRouter')
                src = src.replace(m[0], `import { ${names.join(', ')} } from 'vue-router'`)
            } else {
                src = insertAfterImports(src, "import { useRouter } from 'vue-router'")
            }
        }
        if (!/const\s+router\s*=\s*useRouter\(\)/.test(src)) {
            src = insertAfterImports(src, 'const router = useRouter()')
        }
        notes.push('navigateTo->router.push')
    }

    // 需要 $message 但没导入时补上
    if (/\$message\s*\(/.test(src) && !src.includes(MESSAGE_IMPORT)) {
        src = insertAfterImports(src, MESSAGE_IMPORT)
        notes.push('added $message import')
    }

    if (src !== before) {
        writeFileSync(file, src, 'utf8')
        report.push(`${file}: ${notes.join(', ')}`)
    }
}

console.log(report.join('\n'))
console.log(`\n共处理 ${report.length} 个文件`)
