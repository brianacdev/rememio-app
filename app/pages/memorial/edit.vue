<script lang="ts" setup>
import EditMemorialUserList from '~/components/memorial/edit/EditMemorialUserList.vue'

definePageMeta({
    name: 'memorial-edit',
    path: '/memorial/:name/:memorialId/edit',
    middleware: ['memorial-edit'],
    layout: 'memorial',
})

const route = useRoute()
const memorialId = computed(() => route.params.memorialId as string)
const memorialStore = useMemorialStore()
const toast = useToast()

const isLoading = ref(false)

async function initView() {
    try {
        isLoading.value = true
        await memorialStore.refreshMemorial()
        resetForm()
        return true
    } finally {
        isLoading.value = false
    }
}

callOnce('memorial-edit', () => initView(), { mode: 'navigation' })

const memorial = computed(() => memorialStore.memorial)
const isReady = computed(() => Boolean(memorialStore.memorial && memorialStore.userContext && !isLoading.value))

// Local form state
const form = reactive({
    name: '',
    birthDateStr: '',
    deathDateStr: '',
    obituary: '',
    isObituaryPublic: false,
})

function toDateInputValue(value?: string | null) {
    if (!value) return ''
    // Accepts ISO or YYYY-MM-DD; returns YYYY-MM-DD
    const idx = value.indexOf('T')
    return idx > 0 ? value.slice(0, idx) : value
}

function resetForm() {
    if (!memorial.value) return
    form.name = memorial.value.name || ''
    form.birthDateStr = toDateInputValue(memorial.value.birthDateStr || '')
    form.deathDateStr = toDateInputValue(memorial.value.deathDateStr || '')
    form.obituary = memorial.value.obituary || ''
    form.isObituaryPublic = Boolean(memorial.value.isObituaryPublic)
}

whenever(
    () => memorial.value,
    () => resetForm(),
    { immediate: true }
)

const isValid = computed(() => form.name.trim().length > 0)
const isSaving = ref(false)

const { onChange: profileOnChange, open: profileOpen } = useFileDialog({ accept: 'image/*', multiple: false })
const profileFile = ref<File>()
profileOnChange((files) => {
    if (files && files[0]) {
        profileFile.value = files[0]
    } else {
        profileFile.value = undefined
    }
})
const profilePreviewUrl = ref<string>()
watch(profileFile, (file) => {
    if (file) {
        profilePreviewUrl.value = URL.createObjectURL(file)
    } else if (profilePreviewUrl.value) {
        URL.revokeObjectURL(profilePreviewUrl.value)
        profilePreviewUrl.value = undefined
    }
})

const { onChange: coverOnChange, open: coverOpen } = useFileDialog({ accept: 'image/*', multiple: false })
const coverFile = ref<File>()
coverOnChange((files) => {
    if (files && files[0]) {
        coverFile.value = files[0]
    } else {
        coverFile.value = undefined
    }
})
const coverPreviewUrl = ref<string>()
watch(coverFile, (file) => {
    if (file) {
        coverPreviewUrl.value = URL.createObjectURL(file)
    } else if (coverPreviewUrl.value) {
        URL.revokeObjectURL(coverPreviewUrl.value)
        coverPreviewUrl.value = undefined
    }
})

const isUploadingProfile = ref(false)
const isUploadingCover = ref(false)

async function saveProfilePhoto() {
    if (!profileFile.value) return
    isUploadingProfile.value = true
    try {
        const formData = new FormData()
        formData.append('profile', profileFile.value)
        await $fetch(`/api/memorial/${memorialId.value}/update-photo`, { method: 'PUT', body: formData })
        toast.add({ title: 'Profile photo updated', color: 'success', duration: 3000 })
        profileFile.value = undefined
        await memorialStore.fetchMemorial(memorialId.value)
    } catch (error) {
        console.error(error)
        toast.add({ title: 'Failed to update profile photo', color: 'error' })
    } finally {
        isUploadingProfile.value = false
    }
}

async function saveCoverPhoto() {
    if (!coverFile.value) return
    isUploadingCover.value = true
    try {
        const formData = new FormData()
        formData.append('cover', coverFile.value)
        await $fetch(`/api/memorial/${memorialId.value}/update-photo`, { method: 'PUT', body: formData })
        toast.add({ title: 'Cover photo updated', color: 'success', duration: 3000 })
        coverFile.value = undefined
        await memorialStore.fetchMemorial(memorialId.value)
    } catch (error) {
        console.error(error)
        toast.add({ title: 'Failed to update cover photo', color: 'error' })
    } finally {
        isUploadingCover.value = false
    }
}

async function save() {
    if (!isValid.value) return
    isSaving.value = true
    try {
        await $fetch(`/api/memorial/${memorialId.value}/update`, {
            method: 'PUT',
            body: {
                name: form.name.trim(),
                birthDateStr: form.birthDateStr || null,
                deathDateStr: form.deathDateStr || null,
                obituary: form.obituary,
                isObituaryPublic: form.isObituaryPublic,
            },
        })
        toast.add({ title: 'Memorial updated', color: 'success', duration: 3000 })
        await memorialStore.init(memorialId.value, true)
        resetForm()
    } catch (error) {
        console.error(error)
        toast.add({ title: 'Failed to save changes', color: 'error' })
    } finally {
        isSaving.value = false
    }
}

function cancel() {
    resetForm()
}

const profileUrl = computed(() => profilePreviewUrl.value || memorial.value?.profilePhotoUrl || undefined)
const coverUrl = computed(() => coverPreviewUrl.value || memorial.value?.coverPhotoUrl || undefined)
</script>

<template>
    <div v-if="!isReady">
        <USkeleton class="h-24 w-full" />
    </div>
    <div v-else class="space-y-8">
        <UCard>
            <template #header>
                <h2 class="text-xl">Photos</h2>
                <p class="text-gray-600">Update the profile and cover photos.</p>
            </template>
            <div class="grid gap-6 lg:grid-cols-2">
                <!-- Profile Photo -->
                <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-3">
                        <button
                            tooltip="Edit profile photo"
                            @click="() => profileOpen()"
                            class="relative flex size-24 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full bg-gray-100 shadow"
                        >
                            <img
                                v-if="profileUrl"
                                :src="profileUrl"
                                :alt="memorial!.name"
                                class="size-full object-cover object-center"
                            />
                            <UIcon v-else name="i-material-symbols-person-outline" class="size-12 text-gray-600/80" />
                        </button>

                        <div class="min-w-0">
                            <div class="font-medium">Profile photo</div>
                            <div class="text-sm text-gray-600">Square image recommended.</div>
                        </div>
                    </div>
                    <div class="flex justify-start gap-2" v-if="profileFile">
                        <UButton
                            size="sm"
                            variant="solid"
                            color="primary"
                            :disabled="Boolean(!profileFile || isUploadingProfile)"
                            @click="saveProfilePhoto"
                            :label="isUploadingProfile ? 'Uploading…' : 'Save profile photo'"
                        />
                        <UButton
                            size="sm"
                            variant="ghost"
                            color="neutral"
                            @click="() => (profileFile = undefined)"
                            label="Cancel"
                        />
                    </div>
                </div>

                <!-- Cover Photo -->
                <div class="flex flex-col gap-4">
                    <button tooltip="Edit cover photo" @click="() => coverOpen()" class="cursor-pointer">
                        <div class="h-28 w-full overflow-hidden rounded-lg bg-gray-100">
                            <img
                                v-if="coverUrl"
                                :src="coverUrl"
                                :alt="memorial!.name"
                                class="h-full w-full object-cover object-center"
                            />
                        </div>
                        <div class="mt-2 font-medium">Cover photo</div>
                        <div class="text-sm text-gray-600">Wide image recommended.</div>
                    </button>
                    <div class="flex justify-end gap-2" v-if="coverFile">
                        <UButton
                            size="sm"
                            variant="solid"
                            color="primary"
                            :disabled="Boolean(!coverFile || isUploadingCover)"
                            @click="saveCoverPhoto"
                            :label="isUploadingCover ? 'Uploading…' : 'Save cover photo'"
                        />
                        <UButton
                            size="sm"
                            variant="ghost"
                            color="neutral"
                            @click="() => (coverFile = undefined)"
                            label="Cancel"
                        />
                    </div>
                </div>
            </div>
        </UCard>
        <UCard>
            <template #header>
                <div class="flex items-center">
                    <div>
                        <h2 class="text-xl">Basic info</h2>
                        <p class="text-gray-600">Update the memorial's core details.</p>
                    </div>
                </div>
            </template>

            <div class="grid gap-4 md:grid-cols-2">
                <UFormField label="Name" size="xl">
                    <UInput v-model="form.name" placeholder="Full name" class="w-full" />
                </UFormField>

                <div class="grid grid-cols-2 gap-4">
                    <UFormField label="Birth date" size="xl">
                        <UInput v-model="form.birthDateStr" type="date" class="w-full" />
                    </UFormField>
                    <UFormField label="Death date" size="xl">
                        <UInput v-model="form.deathDateStr" type="date" class="w-full" />
                    </UFormField>
                </div>
            </div>

            <div class="mt-6 flex flex-col gap-2.5">
                <div>
                    <h2 class="text-xl">Obituary</h2>
                    <p class="text-gray-600">Write or update the obituary and choose its visibility.</p>
                </div>
                <UFormField size="xl">
                    <UTextarea v-model="form.obituary" class="w-full" :rows="4" autoresize :maxrows="18" />
                </UFormField>
                <div class="flex items-center pl-3">
                    <UCheckbox
                        size="xl"
                        v-model="form.isObituaryPublic"
                        label="Make obituary public"
                        description="If enabled, anyone with the link can read it."
                    />
                </div>
            </div>
            <template #footer>
                <UButton size="xl" variant="outline" color="neutral" @click="cancel">Cancel</UButton>
                <UButton
                    size="xl"
                    variant="solid"
                    color="primary"
                    :disabled="!isValid || isSaving"
                    :label="isSaving ? 'Saving…' : 'Save changes'"
                    @click="save"
                />
            </template>
        </UCard>
        <EditMemorialUserList
            :memorial="memorial!"
            :memorialUsers="memorialStore.memorialUsers"
            :userContext="memorialStore.userContext!"
        />
    </div>
</template>
