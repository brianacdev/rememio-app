<script lang="ts" setup>
import PostHeader from '~/components/memorial/feed/PostHeader.vue'
import CommentList from '~/components/memorial/comments/CommentList.vue'
import MultiplePhotos from '~/components/memorial/post/MultiplePhotos.vue'
import SinglePhoto from '~/components/memorial/post/SinglePhoto.vue'

definePageMeta({
    name: 'memorial-post',
    path: '/memorial/:name/:memorialId/post/:postId',
    middleware: ['memorial'],
    layout: 'memorial',
})
const route = useRoute()
const requestFetch = useRequestFetch()

const memorialId = computed(() => route.params.memorialId as string)
const postId = computed(() => route.params.postId as string)

const { data: postData, refresh: refreshPost } = useAsyncData('memorial-post', () =>
    requestFetch(`/api/memorial/${memorialId.value}/post/${postId.value}/details`)
)
const post = computed(() => postData.value?.post)

const userContext = computed(() => postData.value?.userContext)
const memorialUsers = computed(() => new Map(postData.value?.memorialUsers.map((user) => [user.userId, user]) ?? []))

const reactions = computed(() => new Set(post.value?.reactions ?? []))
const postType = computed(() => {
    if (!post.value) {
        return 'loading'
    }
    const photoCount = post.value.photos.length
    if (photoCount === 1) {
        return 'single-photo'
    }
    if (photoCount > 1) {
        return 'multiple-photos'
    }
    return 'just-content'
})
const hasReacted = computed(() => {
    if (!userContext.value?.userId) {
        return false
    }
    return reactions.value.has(userContext.value?.userId)
})

async function toggleReaction() {
    if (!post.value) {
        return
    }
    await $fetch(`/api/memorial/${memorialId.value}/toggle-reaction`, {
        method: 'PUT',
        body: {
            postId: post.value.postId,
        },
    })
    await refreshPost()
}

async function handleCommentAdded() {
    await refreshPost()
}
</script>

<template>
    <UCard v-if="post">
        <template #header>
            <PostHeader :post="post" />
        </template>
        <div class="flex w-full flex-col">
            <MultiplePhotos v-if="postType === 'multiple-photos'" :post="post" />
            <SinglePhoto v-else-if="postType === 'single-photo'" :post="post" />
            <p v-else-if="postType === 'just-content'" class="whitespace-pre-line text-xl">{{ post.content }}</p>
            <div class="flex items-center gap-1">
                <button class="cursor-pointer" @click="toggleReaction">
                    <UIcon
                        :name="
                            hasReacted ? 'i-material-symbols-favorite-rounded' : 'i-material-symbols-favorite-outline'
                        "
                        size="1.5rem"
                        :class="hasReacted ? 'text-red-500' : ''"
                    />
                </button>
            </div>

            <CommentList
                :commentData="{ postId: post.postId, memorialId: memorialId }"
                :comments="post.comments"
                :memorialUsers="memorialUsers"
                class="mt-3"
                @commentAdded="handleCommentAdded"
            />
        </div>
    </UCard>
</template>
