export default defineNuxtRouteMiddleware(async (to, from) => {
    const authSession = useAuthSession()
    if (!authSession.loggedIn.value) {
        await authSession.fetch()
        if (!authSession.loggedIn.value) {
            return navigateTo('/')
        }
    }
    const memorialId = to.params.memorialId as string
    const memorialStore = useMemorialStore()
    if (memorialId && memorialStore.memorialId !== memorialId) {
        await memorialStore.init(memorialId)
    }
})
