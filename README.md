# Power Blog Web

个人博客前端。**Vue 3 + Vite 纯客户端渲染（SPA）**，构建产物是一堆静态文件，部署时只需要 nginx 托管，
不再需要 Node 进程。

> 2026-10 由 Nuxt 3 重构而来。原 Nuxt 版本同时带有 SSR 服务端渲染 + Node 运行时，
> 既是被扫描攻击的入口，也带来了一堆服务端依赖漏洞；改成 SPA 后运行时攻击面从
> "Node 服务 + nginx" 收敛成 "nginx 静态文件"。

## 环境要求

- Node.js >= 18.12（推荐 22，见 `.nvmrc`）
- yarn 1.x（仓库使用 `yarn.lock`）

## 开发

```bash
nvm use            # 或自行切换到 Node 22
yarn install
yarn dev           # http://localhost:3000
```

## 构建与部署

```bash
yarn build         # 产出 dist/，直接整目录同步到 nginx 站点根目录即可
yarn preview       # 本地预览构建产物
```

部署流程（把 `dist/` 同步到服务器，nginx 直接托管静态目录）：

```bash
# 1. 构建
yarn build

# 2. 同步（示例：生产机 hostwinds）
rsync -az --delete dist/ hostwinds:/www/wwwroot/www.mysticalpower.uk/

# 3. 无需重启任何进程 —— nginx 直接从磁盘读文件
```

因为前端是 SPA，所有前端路由（`/posts/xxx`、`/novel/xxx` 等）都必须在 nginx 里
回退到 `index.html`：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 目录结构

```
index.html            # Vite 入口
vite.config.ts        # 构建配置（别名、自动导入、SCSS 注入）
src/
  main.ts             # 应用入口
  App.vue             # 根组件（布局切换 + 页面转场）
  router/             # 路由表 + 全局守卫（原 Nuxt middleware）
  plugins/            # 原 Nuxt plugins，改成普通 Vue 插件
  icons/collections.ts# 图标数据，由 scripts/gen-icons.mjs 生成（不入库）
  views/NotFound.vue  # 404
pages/                # 页面（对应原 Nuxt pages/，路由手写在 src/router）
components/           # 组件（unplugin-vue-components 自动注册）
composables/          # 组合式函数（unplugin-auto-import 自动导入）
stores/               # Pinia
utils/                # 工具函数（unplugin-auto-import 自动导入）
api/                  # 接口定义
layouts/              # 布局（default / blank）
assets/styles/        # 全局样式，tailwind.css 是 Tailwind 入口
typings/              # 类型声明
scripts/
  gen-icons.mjs             # 扫描源码里用到的图标，生成 src/icons/collections.ts
  check-auto-imports.mjs    # 校验"用了但没导入"的 utils/composables/stores 成员
  migrate-nuxt-to-vue.mjs   # Nuxt -> Vue3 的一次性迁移脚本（保留供回溯）
```

## 几个和 Nuxt 不一样的点

- **没有 SSR**：所有数据都在浏览器端请求。搜索引擎需要能执行 JS 才能收录文章内容；
  后续要做 SEO 的话，建议加构建期预渲染（`vite-ssg`），不需要回到 Nuxt。
- **手写路由**：`pages/` 只是目录约定，真正的路由表在 `src/router/index.ts`，
  原来 `definePageMeta` 里的 `title` / `index` / `layout` 都写进了路由 `meta`。
- **自动导入**：`composables/`、`utils/`、`stores/` 以及 `components/` 的全部组件
  仍然是自动导入的（配置见 `vite.config.ts`），写法上和 Nuxt 一致。
- **图标**：不再走 `@nuxt/icon` + Iconify 线上接口，改为构建期把用到的那几个图标
  抽成本地数据（`scripts/gen-icons.mjs`），离线可用且体积极小。
- **二维码**：`nuxt-qrcode` 换成 `uqr` 直接渲染 SVG。
- **环境变量**：`NUXT_API_URL` → `VITE_API_URL`，其余同理，见 `.env.example`。

## 本地校验

```bash
yarn typecheck                    # vue-tsc 类型检查
node scripts/check-auto-imports.mjs   # 确认没有漏掉的自动导入
```
