import { defineStore } from 'pinia'
import type { User, UserMemorial } from '~~/shared/types/app.type'
import { useAuthSession } from '~~/app/composables/session.composable'

export const useUserStore = defineStore('user', () => {
    const authSession = useAuthSession()
    const user = ref<User>()
    const profilePhotoUrl = computed(() => getUserPhotoUrl(user.value))
    const memorials = ref<UserMemorial[]>([])
    const requestFetch = useRequestFetch()

    async function fetchUserData() {
        const responseData = await requestFetch('/api/user/current')
        user.value = responseData.user
        memorials.value = responseData.memorials
    }

    watchImmediate(
        () => authSession.loggedIn.value,
        async (loggedIn) => {
            if (loggedIn) {
                await fetchUserData()
            }
        }
    )

    return { user, profilePhotoUrl, memorials, fetchUserData }
})
