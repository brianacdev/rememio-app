export default defineNuxtRouteMiddleware((to, from) => {
    if (!import.meta.dev) {
        return abortNavigation('dev only route')
    }
})
