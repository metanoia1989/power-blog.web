import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

/**
 * 路由表 = 原来 Nuxt 的 pages/ 文件约定 + definePageMeta 里的 meta。
 * meta 字段含义：
 *   title  页面标题（写入 document.title）
 *   index  页面层级，用于决定左右滑动动画的方向
 *   layout 使用哪个布局，默认 default
 */
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/pages/index.vue'),
        meta: { index: 0, title: '首页' }
    },
    {
        path: '/archives',
        name: 'archives',
        component: () => import('@/pages/archives/index.vue'),
        meta: { index: 2, title: '归档' }
    },
    {
        path: '/category/:slug',
        name: 'category',
        component: () => import('@/pages/category/[slug].vue'),
        meta: { index: 2, title: '分类' }
    },
    {
        path: '/weibo',
        name: 'weibo',
        component: () => import('@/pages/weibo/index.vue'),
        meta: { index: 3, title: '絮絮叨叨' }
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('@/pages/about/index.vue'),
        meta: { index: 5, title: '关于' }
    },

    // 小说：写死的路径必须排在 /novel/:slug 前面
    {
        path: '/novel',
        name: 'novel',
        component: () => import('@/pages/novel/index.vue'),
        meta: { index: 4, title: '小说' }
    },
    {
        path: '/novel/edit',
        name: 'novel-edit',
        component: () => import('@/pages/novel/edit.vue'),
        meta: { layout: 'blank', index: 199, title: '创建小说' }
    },
    {
        path: '/novel/write',
        name: 'novel-write',
        component: () => import('@/pages/novel/write.vue'),
        meta: { layout: 'blank', index: 199, title: '编辑小说章节' }
    },
    {
        path: '/novel/chapter/:slug(.*)*',
        name: 'novel-chapter',
        component: () => import('@/pages/novel/chapter/[...slug].vue'),
        meta: { layout: 'blank' }
    },
    {
        path: '/novel/:slug',
        name: 'novel-detail',
        component: () => import('@/pages/novel/[slug].vue')
    },

    // 文章：同上，/posts/edit 必须在 /posts/:slug 之前
    {
        path: '/posts/edit',
        name: 'post-edit',
        component: () => import('@/pages/posts/edit.vue'),
        meta: { layout: 'blank', index: 199, title: '编辑文章' }
    },
    {
        path: '/posts/:slug',
        name: 'post-detail',
        component: () => import('@/pages/posts/[slug].vue'),
        meta: { index: 99, title: '文章' }
    },

    {
        path: '/auth/login',
        name: 'login',
        component: () => import('@/pages/auth/login.vue'),
        meta: { layout: 'blank', index: 299, title: '登录' }
    },
    {
        path: '/auth/register',
        name: 'register',
        component: () => import('@/pages/auth/register.vue'),
        meta: { layout: 'blank', index: 300, title: '注册' }
    },
    {
        path: '/wechat-tip',
        name: 'wechat-tip',
        component: () => import('@/pages/wechat-tip.vue'),
        meta: { layout: 'blank', title: '禁止微信浏览器访问' }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/src/views/NotFound.vue'),
        meta: { index: 999, title: '页面不存在' }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    // 与 Nuxt 默认行为保持一致：前进后退还原位置，其余滚动到顶部
    scrollBehavior(to, _from, savedPosition) {
        if (savedPosition) return savedPosition
        if (to.hash) return { el: to.hash, behavior: 'smooth' }
        return { top: 0 }
    }
})

export default router
