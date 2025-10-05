export default defineNuxtRouteMiddleware(async (to, from) => {
    const authSession = useAuthSession()
    if (!authSession.loggedIn.value) {
        await authSession.fetch()
        if (!authSession.loggedIn.value) {
            return navigateTo('/')
        }
    }
})
