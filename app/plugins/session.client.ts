// TODO: https://github.com/nuxt/module-builder/issues/141
import {} from 'nuxt/app'
import { defineNuxtPlugin } from '#imports'
import { useAuthSession } from '~/composables/session.composable'

export default defineNuxtPlugin(async (nuxtApp) => {
    if (!nuxtApp.payload.serverRendered) {
        await useAuthSession().fetch()
    } else if (Boolean(nuxtApp.payload.prerenderedAt) || Boolean(nuxtApp.payload.isCached)) {
        // To avoid hydration mismatch
        nuxtApp.hook('app:mounted', async () => {
            await useAuthSession().fetch()
        })
    }
})
