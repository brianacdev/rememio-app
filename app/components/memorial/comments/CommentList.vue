<script lang="ts" setup>
import type { PostComment, PhotoComment } from '~~/shared/types/app.type'
import CommentListItem from './CommentListItem.vue'
import AddComment from './AddComment.vue'

export type CommentListProps = {
    commentData: { postId: number; memorialId: string } | { photoId: string; memorialId: string }
    comments: PostComment[] | PhotoComment[]
    memorialUsers: Map<string, MemorialUser>
}

const props = defineProps<CommentListProps>()
const { comments } = toRefs(props)
const emit = defineEmits<{
    commentAdded: []
}>()
const commentCount = computed(() => comments.value.length)
const showAddComment = ref(commentCount.value === 0)
function handleCommentAdded() {
    showAddComment.value = false
    emit('commentAdded')
}
</script>

<template>
    <div class="flex flex-col gap-2.5">
        <div class="flex items-center gap-2">
            <span v-if="commentCount > 0" class="text-base font-semibold"
                >{{ commentCount }} {{ commentCount === 1 ? 'Comment' : 'Comments' }}</span
            ><span v-else>No comments</span>
            <UButton
                v-if="!showAddComment"
                label="Add Comment"
                size="sm"
                color="neutral"
                variant="ghost"
                @click="showAddComment = true"
            />
        </div>

        <AddComment v-if="showAddComment" @commentAdded="handleCommentAdded" :commentData="commentData" />

        <CommentListItem
            v-for="comment in comments"
            :key="comment.commentId"
            :comment="comment"
            :memorialUser="memorialUsers.get(comment.createdBy)"
        />
    </div>
</template>
