<script lang="ts" setup>
const props = defineProps<{
    post: PostListItem
}>()
const { post } = toRefs(props)
const memorialStore = useMemorialStore()
const reactions = computed(() => new Set(post.value.reactions))
const comments = computed(() => post.value.comments)
const userId = computed(() => memorialStore.userContext?.userId)
const hasReacted = computed(() => userId.value && reactions.value.has(userId.value))

async function toggleReaction() {
    await $fetch(`/api/memorial/${memorialStore.memorialId}/toggle-reaction`, {
        method: 'PUT',
        body: {
            postId: post.value.postId,
        },
    })
    await memorialStore.fetchPost(post.value.postId)
}
const postRoute = computed(() => ({
    name: 'memorial-post',
    params: {
        postId: post.value.postId,
    },
}))
</script>

<template>
    <div class="flex items-center gap-3">
        <span class="flex items-center gap-1">
            <button class="cursor-pointer" @click="toggleReaction">
                <UIcon
                    :name="hasReacted ? 'i-material-symbols-favorite-rounded' : 'i-material-symbols-favorite-outline'"
                    size="1.5rem" :class="hasReacted ? 'text-red-500' : ''" />
            </button>
        </span>
        <span class="flex items-center gap-1">
            <NuxtLink :to="postRoute" class="cursor-pointer">
                <UIcon name="i-material-symbols-comment-outline" size="1.5rem" />
            </NuxtLink>
            <span class="text-sm">
                {{ comments.length > 0 ? comments.length : '' }}
            </span>
        </span>
    </div>
</template>
