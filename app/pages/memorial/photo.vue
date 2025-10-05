<script lang="ts" setup>
import CommentList from '~/components/memorial/comments/CommentList.vue'

definePageMeta({
    name: 'memorial-photo',
    path: '/memorial/:name/:memorialId/photo/:photoId',
    middleware: ['memorial'],
    layout: 'memorial',
})
const route = useRoute()
const requestFetch = useRequestFetch()

const memorialId = computed(() => route.params.memorialId as string)
const photoId = computed(() => route.params.photoId as string)

const { data: photoData, refresh: refreshPhoto } = useAsyncData('memorial-photo', () =>
    requestFetch(`/api/memorial/${memorialId.value}/photo/${photoId.value}/details`)
)
const photo = computed(() => photoData.value?.photo)

const userContext = computed(() => photoData.value?.userContext)
const memorialUsers = computed(() => new Map(photoData.value?.memorialUsers.map((user) => [user.userId, user]) ?? []))

const reactions = computed(() => new Set(photo.value?.reactions ?? []))
const hasReacted = computed(() => {
    if (!userContext.value?.userId) {
        return false
    }
    return reactions.value.has(userContext.value?.userId)
})

async function toggleReaction() {
    if (!photo.value) {
        return
    }
    await $fetch(`/api/memorial/${memorialId.value}/toggle-reaction`, {
        method: 'PUT',
        body: {
            photoId: photo.value.photoId,
        },
    })
    await refreshPhoto()
}

async function handleCommentAdded() {
    await refreshPhoto()
}

const createdBy = computed(() => memorialUsers.value.get(photo.value?.createdBy ?? ''))
const createdAtRelative = computed(() => photo.value?.createdAtRelative)
</script>

<template>
    <UCard v-if="photo">
        <template #header>
            <div v-if="createdBy" class="flex justify-between gap-2">
                <div class="flex flex-1 items-center gap-2">
                    <UAvatar :src="createdBy.photoUrl" :alt="createdBy.fullName" />
                    <div class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <span>{{ createdBy.fullName }}</span>
                            <span class="text-sm text-gray-500" v-if="createdBy.relation">
                                {{ createdBy.relation }}
                            </span>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500"> {{ createdAtRelative }} </span>
                        </div>
                    </div>
                </div>
                <div class="flex-none"></div>
            </div>
        </template>

        <div v-if="photo" class="flex w-full flex-col items-center justify-center">
            <img :src="photo.photoUrl" alt="Photo" class="max-h-[80vh] max-w-full object-contain shadow-lg" />
            <div class="mt-3 flex w-full">
                <button class="cursor-pointer" @click="toggleReaction">
                    <UIcon
                        :name="
                            hasReacted ? 'i-material-symbols-favorite-rounded' : 'i-material-symbols-favorite-outline'
                        "
                        class="size-6"
                        :class="{ 'text-red-500': hasReacted }"
                    />
                </button>
            </div>
        </div>
        <div>
            <CommentList
                :commentData="{ photoId: photo.photoId, memorialId: memorialId }"
                :comments="photo.comments"
                :memorialUsers="memorialUsers"
                class="mt-3"
                @commentAdded="handleCommentAdded"
            />
        </div>
    </UCard>
</template>
