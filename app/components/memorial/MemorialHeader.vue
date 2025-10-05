<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui'

import UpdateUserRelationDialog from './UpdateUserRelationDialog.vue'
import AddPostModal from './AddPostModal.vue'

const userStore = useUserStore()
const route = useRoute()
const toast = useToast()
const memorialStore = useMemorialStore()
const memorial = computed(() => memorialStore.memorial)
const userContext = computed(() => memorialStore.userContext)
const relation = computed(() => (userContext.value?.relation ?? '').trim())
const profilePhotoUrl = computed(() => memorial.value?.profilePhotoUrl || undefined)
const coverPhotoUrl = computed(() => memorial.value?.coverPhotoUrl || undefined)
const name = computed(() => memorial.value?.name || '')
const routeName = computed(() => route.name as string)
const memorialRouteParams = computed(() => memorialStore.routeParams)

const relationOpen = ref(false)
const addPostOpen = ref(false)

function handlePostAdded() {
    addPostOpen.value = false
    memorialStore.fetchPosts()
    toast.add({ title: 'Post added', duration: 3500, color: 'success' })
}

function handleRelationUpdated() {
    toast.add({ title: 'Relation updated', duration: 3500, color: 'success' })
    relationOpen.value = false
    memorialStore.fetchUserContext()
}

const items = ref<DropdownMenuItem[]>([
    {
        label: 'Profile',
        type: 'link',
        icon: 'i-material-symbols-person-outline',
        to: { name: 'user-profile' },
    },
    {
        label: 'Logout',
        type: 'link',
        icon: 'i-material-symbols-logout',
        to: '/_auth/logout',
        external: true,
    },
])
</script>

<template>
    <div class="w-full border-b border-gray-200 bg-white py-2">
        <AppContainer class="flex justify-between">
            <div class="flex items-center">
                <NuxtLink to="/" class="text-lg text-neutral-500">Rememio</NuxtLink>
            </div>
            <div class="flex items-center">
                <UDropdownMenu :items="items" size="lg" :content="{ align: 'end', alignOffset: -10 }">
                    <button class="rounded-full p-1">
                        <img
                            v-if="userStore.profilePhotoUrl"
                            :src="userStore.profilePhotoUrl"
                            alt="Menu"
                            class="size-9 rounded-full object-cover object-center shadow"
                        />
                        <span v-else class="flex size-9 items-center justify-center rounded-full bg-gray-100"
                            ><UIcon name="i-material-symbols-person-outline" class="size-6 text-gray-500"
                        /></span>
                    </button>
                </UDropdownMenu>
            </div>
        </AppContainer>
    </div>
    <div v-if="memorial && userContext" class="w-full pt-1 sm:pt-3 lg:pt-5">
        <AppContainer class="flex flex-col">
            <div
                class="overflow-hidden rounded-sm bg-gray-100 sm:rounded-md lg:rounded-lg"
                :class="[coverPhotoUrl ? 'h-32 sm:h-48 lg:h-64' : 'h-16 sm:h-20']"
            >
                <img
                    v-if="coverPhotoUrl"
                    :src="coverPhotoUrl"
                    alt="Cover photo"
                    class="size-full object-cover object-center"
                />
            </div>
            <div class="flex flex-col bg-white">
                <div class="flex justify-start">
                    <div class="relative w-24 sm:w-32 lg:w-44">
                        <span
                            class="absolute -top-10 left-4 flex size-16 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-200 shadow sm:-top-10 sm:left-6 sm:size-24 lg:-top-12 lg:left-8 lg:size-32"
                        >
                            <img
                                v-if="profilePhotoUrl"
                                :src="profilePhotoUrl"
                                :alt="name"
                                class="size-full object-cover object-center"
                            />
                            <UIcon v-else name="i-material-symbols-person-outline" class="size-12 text-gray-400" />
                        </span>
                    </div>

                    <div class="flex flex-1 flex-col">
                        <div>
                            <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl">
                                {{ name }}
                            </h1>
                            <p v-if="memorial.datesText" class="mt-1 text-sm text-gray-500">
                                {{ memorial.datesText }}
                            </p>
                        </div>
                    </div>

                    <div class="flex flex-none items-start">
                        <div v-if="relation" class="flex items-center">
                            <span class="text-sm text-gray-500"> Relation: </span>
                            <UButton
                                color="neutral"
                                variant="link"
                                size="sm"
                                class="underline hover:no-underline"
                                @click="relationOpen = true"
                                :label="relation"
                            />
                        </div>
                        <template v-else>
                            <UButton color="neutral" variant="link" size="sm" @click="relationOpen = true"
                                >Add relation
                            </UButton>
                        </template>
                    </div>
                </div>

                <nav class="flex w-full border-b border-gray-200 px-2 pt-4 sm:pt-6 lg:pt-8">
                    <ul class="flex flex-1 gap-2">
                        <li>
                            <NuxtLink
                                :to="{
                                    name: 'memorial-feed',
                                    params: memorialRouteParams,
                                }"
                                class="inline-block border-b px-4 py-2 text-base font-medium"
                                :class="[
                                    ['memorial-feed', 'memorial-post'].includes(routeName)
                                        ? 'border-primary-500/80 text-primary-500/80'
                                        : 'hover:border-primary-500/80 hover:text-primary-500/80 border-transparent text-gray-600',
                                ]"
                            >
                                Feed
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                :to="{
                                    name: 'memorial-photos',
                                    params: memorialRouteParams,
                                }"
                                class="inline-block border-b px-4 py-2 text-base font-medium"
                                :class="[
                                    ['memorial-photos', 'memorial-photo'].includes(routeName)
                                        ? 'border-primary-500/80 text-primary-500/80'
                                        : 'hover:border-primary-500/80 hover:text-primary-500/80 border-transparent text-gray-600',
                                ]"
                            >
                                Photos
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                :to="{
                                    name: 'memorial-obituary',
                                    params: memorialRouteParams,
                                }"
                                class="inline-block border-b px-4 py-2 text-base font-medium"
                                :class="[
                                    routeName === 'memorial-obituary'
                                        ? 'border-primary-500/80 text-primary-500/80'
                                        : 'hover:border-primary-500/80 hover:text-primary-500/80 border-transparent text-gray-600',
                                ]"
                            >
                                Obituary
                            </NuxtLink>
                        </li>
                    </ul>
                    <div class="flex flex-none items-center justify-end">
                        <UButton
                            v-if="userContext.role === 'admin'"
                            :to="{ name: 'memorial-edit', params: memorialRouteParams }"
                            color="primary"
                            variant="ghost"
                            size="lg"
                            label="Edit"
                        />
                    </div>
                    <div class="flex flex-none items-center justify-end">
                        <UButton
                            color="primary"
                            variant="ghost"
                            size="lg"
                            label="Add post"
                            @click="addPostOpen = true"
                        />
                    </div>
                </nav>
            </div>
        </AppContainer>
        <UpdateUserRelationDialog v-model:open="relationOpen" @relation:updated="() => handleRelationUpdated()" />
        <AddPostModal v-model:open="addPostOpen" @postAdded="handlePostAdded" />
    </div>
</template>
