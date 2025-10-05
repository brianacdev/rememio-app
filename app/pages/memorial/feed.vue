<script lang="ts" setup>
definePageMeta({
    name: 'memorial-feed',
    path: '/memorial/:name/:memorialId/feed',
    middleware: ['memorial'],
    layout: 'memorial',
})
import PostCard from '~/components/memorial/feed/PostCard.vue'

const memorialStore = useMemorialStore()

const memorialId = computed(() => useRoute().params.memorialId as string)
const posts = computed(() => memorialStore.posts)

async function initView() {
    await Promise.all([memorialStore.init(memorialId.value), memorialStore.fetchPosts()])
    return true
}
const memorial = computed(() => memorialStore.memorial)

callOnce('memorial-feed', () => initView(), {
    mode: 'navigation',
})
</script>

<template>
    <div v-if="memorial && posts.length > 0" class="flex flex-col gap-6">
        <PostCard v-for="post in posts" :key="post.postId" :post="post" />
    </div>
    <div v-else-if="memorial && posts.length === 0" class="flex flex-col gap-6">
        <p>No posts found</p>
        <p>Be the first to post a memory about {{ memorial.name }}</p>
    </div>
    <div v-else class="flex flex-col gap-6">
        <USkeleton class="h-12 w-full rounded-full" />
    </div>
</template>
