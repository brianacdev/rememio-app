<script lang="ts" setup>
import type { PostComment, PhotoComment } from '~~/shared/types/app.type'
defineProps<{
    comment: PhotoComment | PostComment
    memorialUser: MemorialUser | undefined
}>()
</script>

<template>
    <div class="flex items-start gap-3" v-if="memorialUser">
        <div class="flex-none">
            <AppAvatar :user="memorialUser" size="sm" />
        </div>
        <div class="flex flex-1 flex-col">
            <div class="flex flex-1 items-center gap-2">
                <span class="text-sm font-semibold">{{ memorialUser.fullName }}</span>
                <span class="text-xs text-gray-500">{{ comment.createdAtRelative }}</span>
            </div>
            <p class="mt-1 text-sm">{{ comment.content }}</p>
        </div>
    </div>
</template>
