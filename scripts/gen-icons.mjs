#!/usr/bin/env node
/**
 * 扫描源码里用到的 iconify 图标名（如 `solar:pen-2-outline`），
 * 只把真正用到的那几个图标抽出来，生成 src/icons/collections.ts。
 *
 * 这样做的原因：
 *  - @iconify/vue 默认走 Iconify 线上 API 取图标，国内网络下会随机挂掉；
 *  - 整个 @iconify-json/solar 有 6.4MB / 7400+ 图标，全量打进包里太重。
 * 生成文件是构建产物，已在 .gitignore 中忽略。
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const SCAN_DIRS = [
    'pages',
    'components',
    'layouts',
    'stores',
    'composables',
    'utils',
    'api',
    'constants',
    'enums',
    'src',
    'index.html'
]
const SCAN_EXT = new Set(['.vue', '.ts', '.js', '.mjs', '.html'])
const SKIP_DIRS = new Set(['node_modules', '.git', '.nuxt', '.output', 'dist', 'src/icons'])

/** 匹配 `collection:icon-name`，例如 solar:pen-2-outline */
const ICON_RE = /\b([a-z0-9][a-z0-9-]*):([a-z0-9]+(?:-[a-z0-9]+)*)\b/g

function walk(target, out = []) {
    if (!existsSync(target)) return out
    const st = statSync(target)
    if (st.isFile()) {
        if (SCAN_EXT.has(target.slice(target.lastIndexOf('.')))) out.push(target)
        return out
    }
    for (const entry of readdirSync(target, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            if (SKIP_DIRS.has(entry.name)) continue
            walk(join(target, entry.name), out)
        } else if (SCAN_EXT.has(entry.name.slice(entry.name.lastIndexOf('.')))) {
            out.push(join(target, entry.name))
        }
    }
    return out
}

const files = SCAN_DIRS.flatMap((d) => walk(resolve(root, d)))

/** collection -> Set<iconName> */
const used = new Map()
for (const file of files) {
    const text = readFileSync(file, 'utf8')
    for (const [, collection, icon] of text.matchAll(ICON_RE)) {
        if (!used.has(collection)) used.set(collection, new Set())
        used.get(collection).add(icon)
    }
}

const collections = []
const missing = []

for (const [collection, names] of [...used.entries()].sort()) {
    let data
    try {
        data = require(`@iconify-json/${collection}/icons.json`)
    } catch {
        // 不是 iconify 集合（比如 https:// 里的冒号），跳过
        continue
    }
    if (!data || !data.icons) continue

    const icons = {}
    const aliases = {}
    for (const name of [...names].sort()) {
        if (data.icons[name]) {
            icons[name] = data.icons[name]
        } else if (data.aliases && data.aliases[name]) {
            aliases[name] = data.aliases[name]
        } else {
            missing.push(`${collection}:${name}`)
        }
    }

    collections.push({
        prefix: data.prefix,
        width: data.width,
        height: data.height,
        icons,
        ...(Object.keys(aliases).length ? { aliases } : {})
    })
}

const outFile = resolve(root, 'src/icons/collections.ts')
mkdirSync(dirname(outFile), { recursive: true })

const body = collections
    .map(
        (c) =>
            `    ${JSON.stringify(c, null, 0).replace(/\n/g, '')} as IconifyJSON`
    )
    .join(',\n')

writeFileSync(
    outFile,
    `// 该文件由 scripts/gen-icons.mjs 自动生成，请勿手动修改。
/* eslint-disable */
import type { IconifyJSON } from '@iconify/vue'

export default [
${body}
] as IconifyJSON[]

export const iconCount = ${collections.reduce((n, c) => n + Object.keys(c.icons).length, 0)}
`,
    'utf8'
)

const total = collections.reduce((n, c) => n + Object.keys(c.icons).length, 0)
console.log(
    `[icons] 已生成 ${outFile.replace(root + sep, '')}：` +
        `${collections.length} 个集合 / ${total} 个图标` +
        (missing.length ? `\n[icons] 警告：未找到 ${missing.join(', ')}` : '')
)
