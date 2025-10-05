<script lang="ts" setup>
const props = defineProps<{
    user:
        | { userId: string; photoId: string | null; fullName?: string }
        | { photoUrl: string | undefined; fullName?: string }
        | null
        | undefined
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
}>()
function getPhotoUrl() {
    const user = props.user
    if (!user) return undefined
    if ('photoUrl' in user && user.photoUrl) {
        return user.photoUrl
    }
    if ('userId' in user && user.userId && user.photoId) {
        return getUserPhotoUrl(user)
    }
    return undefined
}
const photoUrl = getPhotoUrl()
const fullName = props.user?.fullName ?? ''

function getSizeClasses() {
    const size = props.size ?? 'md'
    switch (size) {
        case 'xs':
            return ['size-6', 'size-7']
        case 'sm':
            return ['size-8', 'size-9']
        case 'md':
            return ['size-10', 'size-11']
        case 'lg':
            return ['size-12', 'size-13']
        case 'xl':
            return ['size-14', 'size-15']
        case '2xl':
            return ['size-16', 'size-17']
        case '3xl':
            return ['size-20', 'size-21']
        case '4xl':
            return ['size-24', 'size-25']
        case '5xl':
            return ['size-28', 'size-29']
        default:
            return ['size-10', 'size-11']
    }
}
const sizeClass = getSizeClasses()
</script>

<template>
    <div v-if="photoUrl">
        <img
            :src="photoUrl"
            :alt="fullName"
            :class="sizeClass[1]"
            class="rounded-full object-cover object-center shadow"
        />
    </div>
    <div v-else class="flex items-center justify-center bg-gray-100" :class="sizeClass[1]">
        <UIcon name="i-material-symbols-person-outline" class="text-gray-400" :class="sizeClass[0]" />
    </div>
</template>
