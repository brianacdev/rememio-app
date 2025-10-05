<script lang="ts" setup>
const props = defineProps<{
    post: PostListItem
}>()
const { post } = toRefs(props)
const postId = computed(() => post.value.postId)
const photos = computed(() => post.value.photos.sort((a, b) => a.photoId.localeCompare(b.photoId)))
const content = computed(() => post.value.content)
const postRoute = computed(() => ({
    name: 'memorial-post',
    params: {
        postId: postId.value,
    },
}))
</script>

<template>
    <div class="flex flex-col gap-2 sm:gap-3 lg:gap-4">
        <NuxtLink :to="postRoute" v-if="content.length > 0" class="cursor-pointer whitespace-pre-line text-lg">{{
            content
        }}</NuxtLink>
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            <NuxtLink
                :to="postRoute"
                v-for="photo in photos"
                :key="photo.photoId"
                class="aspect-square cursor-pointer overflow-hidden rounded-xl"
            >
                <img :src="photo.photoUrl" alt="Memorial post photo" class="h-full w-full object-cover object-center" />
            </NuxtLink>
        </div>
    </div>
</template>
