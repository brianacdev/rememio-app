<script lang="ts" setup>
const props = defineProps<{
    post: PostListItem
}>()
const { post } = toRefs(props)
const postId = computed(() => post.value.postId)
const content = computed(() => post.value.content)
</script>

<template>
    <NuxtLink :to="{ name: 'memorial-post', params: { postId } }" class="cursor-pointer whitespace-pre-line text-lg">{{
        content
    }}</NuxtLink>
</template>
