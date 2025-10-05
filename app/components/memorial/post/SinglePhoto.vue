<script lang="ts" setup>
const props = defineProps<{
    post: PostListItem
}>()
const content = computed(() => props.post.content)
const hasContent = computed(() => content.value.length > 0)
const singlePhoto = computed(() => props.post.photos[0])
</script>

<template>
    <div v-if="singlePhoto">
        <p v-if="hasContent" class="mb-2 whitespace-pre-line text-lg sm:mb-3 sm:text-xl lg:mb-4">{{ content }}</p>

        <div class="flex w-full justify-center">
            <NuxtLink :to="{ name: 'memorial-photo', params: { photoId: singlePhoto.photoId } }">
                <img
                    :src="singlePhoto.photoUrl"
                    alt="Post photo"
                    class="max-h-[80vh] max-w-full object-contain shadow-lg"
                />
            </NuxtLink>
        </div>
    </div>
</template>
