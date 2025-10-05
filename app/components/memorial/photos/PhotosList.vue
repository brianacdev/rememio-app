<script lang="ts" setup>
import PhotosListItem from './PhotosListItem.vue'
import type { Memorial, MemorialUserContext, MemorialUser } from '~~/shared/types/app.type'

const props = defineProps<{
    memorial: Memorial
    photos: MemorialPhoto[]
    userContext: MemorialUserContext
    memorialUsers: MemorialUser[]
}>()
const { photos, memorial, userContext, memorialUsers } = toRefs(props)
</script>

<template>
    <div v-if="memorial && photos.length > 0" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <PhotosListItem
            v-for="photo in photos"
            :key="photo.photoId"
            :photo="photo"
            :memorial="memorial"
            :userContext="userContext"
            :memorialUsers="memorialUsers"
        />
    </div>
</template>
