<script lang="ts" setup>
import PhotosList from '~/components/memorial/photos/PhotosList.vue'

definePageMeta({
    name: 'memorial-photos',
    path: '/memorial/:name/:memorialId/photos',
    middleware: ['memorial'],
    layout: 'memorial',
})

const isReady = useState('memorial-photos-is-ready', () => false)
const memorialStore = useMemorialStore()

const memorialId = computed(() => useRoute().params.memorialId as string)
async function initView() {
    await Promise.all([memorialStore.init(memorialId.value), memorialStore.fetchPhotos()])
    isReady.value = true
    return true
}

callOnce('memorial-photos', () => initView(), {
    mode: 'navigation',
})
</script>

<template>
    <div v-if="isReady && memorialStore.memorial && memorialStore.userContext && memorialStore.memorialUsers">
        <PhotosList
            :memorial="memorialStore.memorial"
            :photos="memorialStore.photos"
            :userContext="memorialStore.userContext"
            :memorialUsers="memorialStore.memorialUsers"
        />
    </div>
    <div v-else>
        <USkeleton class="h-full w-full" />
    </div>
</template>
