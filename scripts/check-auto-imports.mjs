#!/usr/bin/env node
/**
 * 迁移校验脚本：找出"用了但既没 import、也没本地定义"的标识符。
 *
 * 这类问题在 Nuxt 里被 自动导入 (utils/ composables/ stores/ components/) 掩盖，
 * 换到 Vite 之后必须由 unplugin-auto-import 提供同样的能力，
 * 这个脚本用来确认没有漏网之鱼。
 *
 * 只检查 utils / composables / stores 里导出的名字，
 * 其他未定义标识符（浏览器全局、Vue 宏等）一律忽略。
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const EXPORT_RE =
    /export\s+(?:async\s+)?(?:function|const|let|var|class)\s+([A-Za-z_$][\w$]*)|export\s*\{([^}]*)\}/g

function collectExports(dir) {
    const names = new Set()
    if (!existsSync(dir)) return names
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name)
        if (entry.isDirectory()) {
            for (const n of collectExports(path)) names.add(n)
            continue
        }
        if (!/\.(ts|js)$/.test(entry.name)) continue
        const src = readFileSync(path, 'utf8')
        for (const m of src.matchAll(EXPORT_RE)) {
            if (m[1]) names.add(m[1])
            if (m[2]) {
                for (const part of m[2].split(',')) {
                    const name = part.split(/\s+as\s+/).pop().trim()
                    if (name) names.add(name)
                }
            }
        }
    }
    return names
}

const exported = new Set([
    ...collectExports('utils'),
    ...collectExports('composables'),
    ...collectExports('stores')
])

const files = execSync(
    "find pages components layouts stores composables utils api src -name '*.vue' -o -name '*.ts' -o -name '*.js'",
    { encoding: 'utf8' }
)
    .trim()
    .split('\n')
    .filter(Boolean)

const problems = []

for (const file of files) {
    let src = readFileSync(file, 'utf8')

    // 去掉 import / export 语句本身，避免把"导入的名字"当成使用
    const withoutImports = src.replace(/^\s*import[\s\S]*?from\s*['"][^'"]+['"];?/gm, '')

    for (const name of exported) {
        // 使用处（排除定义处）
        const used = new RegExp(`(?<![\\w.$'"])${name}\\s*[({]`, 'g')
        if (!used.test(withoutImports)) continue

        // 本地已声明 / 已导入？
        const declared =
            new RegExp(`import\\s*\\{[^}]*\\b${name}\\b[^}]*\\}\\s*from`).test(src) ||
            new RegExp(`import\\s+${name}\\b`).test(src) ||
            new RegExp(`(?:const|let|var|function|class)\\s+${name}\\b`).test(src) ||
            new RegExp(`export\\s+(?:async\\s+)?(?:function|const|class)\\s+${name}\\b`).test(src) ||
            new RegExp(`(?:const|let|var)\\s*\\{[^}]*\\b${name}\\b[^}]*\\}\\s*=`).test(src)

        if (!declared) problems.push(`${file}: 使用了未导入的 ${name}`)
    }
}

if (problems.length) {
    console.log('发现问题：')
    console.log(problems.join('\n'))
    process.exitCode = 1
} else {
    console.log('OK：没有"用了但未导入"的 utils/composables/stores 成员')
}
