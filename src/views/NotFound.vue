<template>
    <div class="not-found">
        <h1>404</h1>
        <p>页面不存在或已被移除</p>
        <RouterLink to="/">返回首页</RouterLink>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 60vh;
    text-align: center;

    h1 {
        font-size: 64px;
        font-weight: 600;
        color: var(--primary);
        margin: 0;
    }

    p {
        color: var(--minor);
        margin: 0;
    }
}
</style>
