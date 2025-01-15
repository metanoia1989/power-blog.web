/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './components/**/*.{vue,js}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}'
    ],
    darkMode: ['selector', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                white: 'var(--color-white)',
                black: 'var(--el-color-black)',
                primary: {
                    '50': '#f0f4fe',
                    '100': '#dde7fc',
                    '200': '#c3d5fa',
                    '300': '#9abbf6',
                    '400': '#6a97f0',
                    '500': '#4773ea',
                    '600': '#3255de',
                    '700': '#2942cc',
                    '800': '#2837a5',
                    '900': '#253383',
                    '950': '#1b2150',

                    DEFAULT: '#3255DE',
                    light: '#4773EA',
                    dark: '#2942CC',

                    'light-3': '#6A97F0',
                    'light-5': '#9ABBF6',
                    'light-7': '#C3D5FA',
                    'light-8': '#DDE7FC',
                    'light-9': '#F0F4FE',
                    'dark-2': '#2942CC'
                },

                success: 'var(--el-color-success)',
                warning: 'var(--el-color-warning)',
                danger: 'var(--el-color-danger)',
                error: 'var(--el-color-error)',
                info: 'var(--el-color-info)',
                body: 'var(--el-bg-color)',
                page: 'var(--el-bg-color-page)',
                'tx-primary': 'var(--el-text-color-primary)',
                'tx-regular': 'var(--el-text-color-regular)',
                'tx-secondary': 'var(--el-text-color-secondary)',
                'tx-placeholder': 'var(--el-text-color-placeholder)',
                'tx-disabled': 'var(--el-text-color-disabled)',
                br: 'var(--el-border-color)',
                'br-light': 'var(--el-border-color-light)',
                'br-extra-light': 'var(--el-border-color-extra-light)',
                'br-dark': 'var( --el-border-color-dark)',
                fill: 'var(--el-fill-color)',
                mask: 'var(--el-mask-color)',
                overlay: 'var(--el-overlay-color-light)'
            },
            fontFamily: {
                sans: [
                    'PingFang SC',
                    'Arial',
                    'Hiragino Sans GB',
                    'Microsoft YaHei',
                    'sans-serif'
                ]
            },
            boxShadow: {
                DEFAULT: 'var(--el-box-shadow)',
                light: 'var(--el-box-shadow-light)',
                lighter: 'var(--el-box-shadow-lighter)',
                dark: 'var(--el-box-shadow-dark)'
            },
            fontSize: {
                xs: 'var(--el-font-size-extra-small)',
                sm: 'var( --el-font-size-small)',
                base: 'var( --el-font-size-base)',
                lg: 'var( --el-font-size-medium)',
                xl: 'var( --el-font-size-large)',
                '2xl': 'var( --el-font-size-extra-large)',
                '3xl': '20px',
                '4xl': '24px',
                '5xl': '28px',
                '6xl': '30px',
                '7xl': '36px',
                '8xl': '48px',
                '9xl': '60px'
            }
        }
    }
}
