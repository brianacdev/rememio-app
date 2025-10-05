<script lang="ts" setup>
import { useFileDialog } from '@vueuse/core'

definePageMeta({
    name: 'user-profile',
    path: '/profile',
    middleware: ['auth'],
})

const userStore = useUserStore()
const user = computed(() => userStore.user)
const memorials = computed(() => userStore.memorials)
const toast = useToast()

const isLoading = ref(false)
const isSaving = ref(false)

async function initView() {
    try {
        isLoading.value = true
        await userStore.fetchUserData()
        resetEditState()
    } finally {
        isLoading.value = false
    }
}

const {
    open: openProfilePhotoDialog,
    onChange: onProfilePhotoChange,
    reset: resetProfilePhotoDialog,
} = useFileDialog({
    accept: 'image/*',
    multiple: false,
})

callOnce('user', async () => initView(), { mode: 'navigation' })

// Local form state
const editState = reactive({
    firstName: '',
    lastName: '',
    selectedPhotoFile: null as File | null,
    selectedPhotoPreviewUrl: null as string | null,
    removeExistingPhoto: false,
})

async function resetEditState() {
    if (!user.value) return
    editState.firstName = user.value.firstName
    editState.lastName = user.value.lastName
    editState.selectedPhotoFile = null
    clearSelectedPhoto()
}

// Initialize form when user loads
whenever(
    () => user.value,
    (u) => {
        if (!u) return
        resetEditState()
    },
    { immediate: true }
)

// Derived state
const isValid = computed(() => editState.firstName.trim().length > 0 && editState.lastName.trim().length > 0)
const isDirty = computed(() => {
    if (!user.value) return false
    const nameChanged = editState.firstName !== user.value.firstName || editState.lastName !== user.value.lastName
    return nameChanged || !!editState.selectedPhotoFile || editState.removeExistingPhoto
})

// File dialog handler
onProfilePhotoChange((files) => {
    const file = files ? files[0] : undefined
    if (!file) return
    if (!file.type.startsWith('image/')) {
        toast.add({ title: 'Please select an image file.', color: 'error' })
        return
    }
    editState.selectedPhotoFile = file
    const reader = new FileReader()
    reader.onload = (e) => {
        if (!e.target) return
        editState.selectedPhotoPreviewUrl = e.target.result as string
    }
    reader.readAsDataURL(file)
})

const profilePhotoUrl = computed(() => editState.selectedPhotoPreviewUrl || user.value?.photoUrl || undefined)

function clearSelectedPhoto() {
    editState.removeExistingPhoto = false
    if (editState.selectedPhotoPreviewUrl) URL.revokeObjectURL(editState.selectedPhotoPreviewUrl)
    editState.selectedPhotoPreviewUrl = null
    resetProfilePhotoDialog()
}

async function saveNames() {
    isSaving.value = true
    try {
        await $fetch('/api/user/profile', {
            method: 'PUT',
            body: {
                firstName: editState.firstName,
                lastName: editState.lastName,
            },
        })
        toast.add({ title: 'Profile saved', duration: 3500, color: 'success' })
        await initView()
    } finally {
        isSaving.value = false
    }
}

async function savePhoto() {
    if (!editState.selectedPhotoFile) return
    isSaving.value = true
    try {
        const formData = new FormData()
        formData.append('photo', editState.selectedPhotoFile)
        await $fetch('/api/user/photo', {
            method: 'POST',
            body: formData,
        })
        toast.add({ title: 'Profile photo saved', duration: 3500, color: 'success' })
        await initView()
    } finally {
        isSaving.value = false
    }
}
</script>

<template>
    <div v-if="!isLoading && user" class="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8">
        <!-- Profile Card -->
        <UCard>
            <template #header>
                <h2 class="text-xl">Your profile</h2>
                <p>Update your name and profile photo.</p>
            </template>
            <div class="grid gap-8 md:grid-cols-[auto,1fr] md:items-start">
                <!-- Avatar + actions -->
                <div class="flex flex-col items-center gap-4">
                    <div class="relative">
                        <div
                            class="flex size-28 items-center justify-center overflow-hidden rounded-full bg-gray-100 shadow-md"
                        >
                            <img
                                v-if="profilePhotoUrl"
                                :src="profilePhotoUrl"
                                :alt="user.fullName"
                                class="h-full w-full object-cover"
                            />
                            <UIcon v-else name="i-material-symbols-person-outline" class="size-12 text-gray-400" />
                        </div>
                        <UButton
                            size="lg"
                            icon="i-material-symbols-edit"
                            variant="outline"
                            color="neutral"
                            class="absolute bottom-0 right-0 rounded-full opacity-50 hover:opacity-80"
                            :disabled="isSaving"
                            @click="() => openProfilePhotoDialog()"
                        />
                    </div>
                    <div v-if="editState.selectedPhotoPreviewUrl" class="flex items-center gap-2">
                        <UButton variant="solid" color="primary" @click="savePhoto">Save photo</UButton>
                        <UButton variant="ghost" color="neutral" @click="clearSelectedPhoto">Cancel photo</UButton>
                    </div>
                </div>

                <!-- Name form -->
                <form class="flex flex-col gap-4" @submit.prevent="saveNames">
                    <div class="flex gap-2">
                        <UFormField label="First name" size="xl" class="flex-1">
                            <UInput
                                v-model="editState.firstName"
                                autocomplete="given-name"
                                placeholder="First name"
                                class="w-full"
                            />
                        </UFormField>

                        <UFormField label="Last name" size="xl" class="flex-1">
                            <UInput
                                v-model="editState.lastName"
                                autocomplete="family-name"
                                placeholder="Last name"
                                class="w-full"
                            />
                        </UFormField>
                    </div>
                    <div class="flex justify-end">
                        <UButton
                            type="submit"
                            variant="solid"
                            color="primary"
                            size="xl"
                            :disabled="!isValid || !isDirty || isSaving"
                            :label="isSaving ? 'Saving…' : 'Save changes'"
                        />
                    </div>
                </form>
            </div>
        </UCard>

        <!-- Memorials Card -->
        <UCard>
            <template #header>
                <h2 class="text-xl">Your memorials</h2>
                <p>Pages you can access.</p>
            </template>

            <div v-if="memorials.length > 0" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <NuxtLink
                    v-for="m in memorials"
                    :key="m.memorialId"
                    :to="{ name: 'memorial-feed', params: { name: m.nameSlug, memorialId: m.memorialId } }"
                    class="overflow-hidden rounded-lg border border-gray-200 shadow"
                >
                    <div class="h-28 w-full bg-gray-100">
                        <img
                            v-if="m.coverPhotoUrl"
                            :src="m.coverPhotoUrl"
                            :alt="m.name"
                            class="size-full object-cover object-center"
                        />
                    </div>
                    <div class="flex items-center gap-3 p-4">
                        <img
                            v-if="m.profilePhotoUrl"
                            :src="m.profilePhotoUrl"
                            :alt="m.name"
                            class="size-20 shrink-0 grow-0 rounded-full object-cover object-center"
                        />
                        <div
                            v-else
                            class="flex size-20 shrink-0 grow-0 items-center justify-center rounded-full bg-gray-100"
                        >
                            <UIcon name="i-material-symbols-person-outline" class="size-12 text-gray-400" />
                        </div>
                        <div class="flex flex-1 flex-col">
                            <div class="truncate text-lg font-medium">{{ m.name }}</div>
                            <div class="min-h-8">
                                <UBadge v-if="m.isOwner" variant="outline" size="sm" label="owner" />
                                <UBadge
                                    v-else-if="m.role === 'admin'"
                                    variant="outline"
                                    size="sm"
                                    class="bg-sky-50 text-sky-600"
                                    label="admin"
                                />
                            </div>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <div v-else class="text-sm text-gray-500">You don't have access to any memorials yet.</div>
        </UCard>
    </div>
</template>
