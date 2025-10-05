<script lang="ts" setup>
const props = defineProps<{
    commentData: { postId: number; memorialId: string } | { photoId: string; memorialId: string }
}>()
const emit = defineEmits<{
    (e: 'commentAdded'): void
}>()
const userStore = useUserStore()
const contentText = ref('')

async function addComment() {
    const content = contentText.value.trim()
    if (content.length === 0) {
        return
    }
    await $fetch(`/api/memorial/${props.commentData.memorialId}/add-comment`, {
        method: 'POST',
        body: {
            content,
            postId: 'postId' in props.commentData ? props.commentData.postId : undefined,
            photoId: 'photoId' in props.commentData ? props.commentData.photoId : undefined,
        },
    })
    contentText.value = ''
    emit('commentAdded')
}
</script>

<template>
    <div class="flex gap-2">
        <div class="flex-none">
            <AppAvatar :user="userStore.user" size="sm" />
        </div>
        <div class="flex-1">
            <UInput
                v-model="contentText"
                class="w-full"
                size="xl"
                placeholder="Add a comment..."
                @keyup.enter="addComment"
            />
        </div>
        <div class="flex flex-none items-center">
            <UButton
                square
                size="xl"
                icon="i-material-symbols-send-outline-rounded"
                variant="subtle"
                color="secondary"
                @click="addComment"
            />
        </div>
    </div>
</template>
