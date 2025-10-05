import { defineStore } from 'pinia'
import type { Memorial, MemorialUserContext, MemorialUser, PostListItem } from '~~/shared/types/app.type'

export const useMemorialStore = defineStore('Memorial', () => {
    const requestFetch = useRequestFetch()
    const loading = ref(false)
    const memorial = ref<Memorial>()
    const userContext = ref<MemorialUserContext>()
    const memorialUsers = ref<MemorialUser[]>([])
    const posts = ref<PostListItem[]>([])
    const memorialUsersMap = computed(() => new Map(memorialUsers.value.map((user) => [user.userId, user])))
    const memorialId = computed(() => memorial.value?.memorialId)
    const photos = ref<MemorialPhoto[]>([])

    async function fetchMemorial(_memorialId: string) {
        const response = await requestFetch(`/api/memorial/${_memorialId}`)
        memorial.value = response.memorial
        userContext.value = response.userContext
        memorialUsers.value = response.memorialUsers
    }

    async function refreshMemorial() {
        if (!memorialId.value) {
            return
        }
        await fetchMemorial(memorialId.value)
    }

    async function fetchPosts() {
        if (!memorialId.value) {
            return
        }
        const response = await requestFetch(`/api/memorial/${memorialId.value}/posts/list`)
        posts.value = response.posts
        memorialUsers.value = response.memorialUsers
    }

    async function fetchPhotos() {
        if (!memorialId.value) {
            return
        }
        const response = await requestFetch(`/api/memorial/${memorialId.value}/photos/list`)
        photos.value = response.photos
        memorialUsers.value = response.memorialUsers
    }

    async function fetchPost(postId: number) {
        if (!memorialId.value || !postId) {
            return
        }
        const response = await requestFetch(`/api/memorial/${memorialId.value}/post/${postId}/details`)
        memorialUsers.value = response.memorialUsers
        userContext.value = response.userContext
        const postIndex = posts.value.findIndex((post) => post.postId === postId)
        if (postIndex !== -1) {
            posts.value[postIndex] = response.post
        }
    }

    async function fetchUserContext() {
        if (!memorialId.value) {
            return
        }
        const response = await requestFetch(`/api/memorial/${memorialId.value}/user-context`)
        userContext.value = response.userContext
    }

    async function init(_memorialId: string, force = false) {
        if (!force && memorialId.value === _memorialId) {
            return
        }

        loading.value = true
        try {
            await fetchMemorial(_memorialId)
        } catch (error) {
            console.error(error)
            memorial.value = undefined
            userContext.value = undefined
            memorialUsers.value = []
        } finally {
            loading.value = false
        }
    }

    return {
        memorial,
        userContext,
        memorialUsers,
        memorialUsersMap,
        memorialId,
        loading,
        posts,
        photos,
        routeParams: computed(() => ({
            name: memorial.value?.nameSlug ?? '',
            memorialId: memorial.value?.memorialId ?? '',
        })),
        init,
        fetchMemorial,
        fetchPosts,
        fetchPhotos,
        fetchPost,
        fetchUserContext,
        refreshMemorial,
    }
})
