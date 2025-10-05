<script lang="ts" setup>
const props = defineProps<{
    post: PostListItem
}>()
const { post } = toRefs(props)
const photos = computed(() => post.value.photos)
const content = computed(() => post.value.content)
const hasContent = computed(() => content.value.length > 0)
const activePhotoIndex = ref(0)
const activePhoto = computed(() => photos.value[activePhotoIndex.value])
</script>

<template>
    <div v-if="activePhoto">
        <p v-if="hasContent" class="mb-2 whitespace-pre-line text-lg sm:mb-3 sm:text-xl lg:mb-4">{{ content }}</p>

        <div class="flex w-full justify-center">
            <NuxtLink :to="{ name: 'memorial-photo', params: { photoId: activePhoto.photoId } }">
                <img
                    :src="activePhoto.photoUrl"
                    alt="Post photo"
                    class="max-h-[75vh] max-w-full object-contain shadow-lg"
                />
            </NuxtLink>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-2 pt-2 sm:gap-3 lg:gap-4">
            <button
                v-for="(photo, $index) in photos"
                :key="photo.photoId"
                @click="activePhotoIndex = $index"
                class="aspect-square size-16 overflow-hidden rounded-2xl border-2 shadow-lg sm:size-24 lg:size-32"
                :class="[activePhotoIndex === $index ? 'border-primary/75' : 'border-transparent']"
            >
                <img :src="photo.photoUrl" alt="Post photo" class="h-full w-full object-cover object-center" />
            </button>
        </div>
    </div>
</template>
