<script lang="ts" setup>
const props = defineProps<{
    post: PostListItem
}>()
const { post } = toRefs(props)
const postId = computed(() => post.value.postId)
const singlePhoto = computed(() => post.value.photos[0]!)
const hasContent = computed(() => post.value.content.length > 0)
const postRoute = computed(() => ({
    name: 'memorial-post',
    params: {
        memorialId: post.value.memorialId,
        postId: postId.value,
    },
}))
const content = computed(() => post.value.content)
</script>

<template>
    <div>
        <NuxtLink
            :to="postRoute"
            class="cursor-pointer overflow-hidden rounded-2xl"
            :class="singlePhoto.orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-[16/9]'"
        >
            <img
                :src="singlePhoto.photoUrl"
                alt="Memorial post photo"
                class="h-auto w-full object-cover object-center"
            />
        </NuxtLink>
        <NuxtLink :to="postRoute" class="cursor-pointer whitespace-pre-line text-lg" v-if="hasContent">{{
            content
        }}</NuxtLink>
    </div>
</template>
