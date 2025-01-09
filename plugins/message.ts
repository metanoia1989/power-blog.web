import MessagePlugin from '~/components/message/plugin'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('message', MessagePlugin)
})
