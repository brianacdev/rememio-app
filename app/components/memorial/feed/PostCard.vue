<script lang="ts" setup>
import PostHeader from './PostHeader.vue'
import PostJustContent from './PostJustContent.vue'
import PostMultiplePhotos from './PostMultiplePhotos.vue'
import PostSinglePhoto from './PostSinglePhoto.vue'
import PostFooter from './PostFooter.vue'

const props = defineProps<{
    post: PostListItem
}>()

const { post } = toRefs(props)
const postType = computed(() => {
    const photoCount = props.post.photos.length
    if (photoCount === 1) {
        return 'single-photo'
    }
    if (photoCount > 1) {
        return 'multiple-photos'
    }
    return 'just-content'
})
</script>

<template>
    <UCard>
        <template #header>
            <PostHeader :post="post" />
        </template>
        <PostJustContent v-if="postType === 'just-content'" :post="post" />
        <PostMultiplePhotos v-else-if="postType === 'multiple-photos'" :post="post" />
        <PostSinglePhoto v-else-if="postType === 'single-photo'" :post="post" />
        <template #footer>
            <PostFooter :post="post" />
        </template>
    </UCard>
</template>
