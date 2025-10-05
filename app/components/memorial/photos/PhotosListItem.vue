<script lang="ts" setup>
import type { Memorial, MemorialUserContext, MemorialPhoto } from '~~/shared/types/app.type'

const props = defineProps<{
    memorial: Memorial
    photo: MemorialPhoto
    userContext: MemorialUserContext
}>()

const { photo, memorial, userContext } = toRefs(props)
const photoId = computed(() => photo.value.photoId)
const memorialId = computed(() => memorial.value.memorialId)

const reactions = ref(new Set(photo.value.reactions))
const hasReacted = computed(() => reactions.value.has(userContext.value.userId))

async function toggleReaction() {
    const resp = await $fetch(`/api/memorial/${memorialId.value}/toggle-reaction`, {
        method: 'PUT',
        body: {
            photoId: photoId.value,
        },
    })
    if (resp!.hasReacted) {
        reactions.value.add(userContext.value.userId)
    } else {
        reactions.value.delete(userContext.value.userId)
    }
}
</script>

<template>
    <div class="relative aspect-square overflow-hidden rounded-2xl shadow-lg">
        <NuxtLink :to="{ name: 'memorial-photo', params: { photoId: photoId } }">
            <img :src="photo.photoUrl" :alt="photo.caption || ''" class="z-0 size-full object-cover object-center" />
        </NuxtLink>

        <button
            class="absolute bottom-2 left-2 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/40 shadow hover:bg-white/60"
            @click.stop="toggleReaction"
            aria-label="Toggle reaction"
        >
            <UIcon
                :name="hasReacted ? 'i-material-symbols-favorite-rounded' : 'i-material-symbols-favorite-outline'"
                class="size-6"
                :class="hasReacted ? 'text-red-500' : 'text-gray-700'"
            />
        </button>
    </div>
</template>
