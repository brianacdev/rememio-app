<script lang="ts" setup>
const isOpen = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{
    postAdded: [postId: number]
}>()
const content = ref('')
const photoFiles = ref<File[]>([])
const adding = ref(false)
const memorialStore = useMemorialStore()
const toast = useToast()

function reset() {
    content.value = ''
    photoFiles.value = []
    adding.value = false
}

async function addPost() {
    const contentTrimmed = content.value.trim()
    if (contentTrimmed.length === 0 && photoFiles.value.length === 0) {
        return
    }
    adding.value = true
    try {
        const formData = new FormData()
        if (contentTrimmed.length > 0) {
            formData.append('content', contentTrimmed)
        }
        for (const photoFile of photoFiles.value) {
            formData.append('photos[]', photoFile)
        }
        const response = await $fetch(`/api/memorial/${memorialStore.memorialId}/post/add`, {
            method: 'POST',
            body: formData,
        })
        reset()
        emit('postAdded', response.postId)
    } catch (error) {
        console.error(error)
    }
}

const disableAddPost = computed(() => {
    if (photoFiles.value.length > 10) {
        return true
    }
    if (photoFiles.value.length > 0) return false
    if (content.value.trim().length === 0 && photoFiles.value.length === 0) {
        return true
    }
    return false
})
</script>

<template>
    <UModal v-model:open="isOpen" title="Add post" description="Add a new post to the memorial.">
        <template #body>
            <div class="flex flex-col gap-4">
                <UFormField label="Content" size="xl">
                    <UTextarea v-model="content" class="w-full" :rows="3" autoresize :maxrows="10" />
                </UFormField>
                <UAlert
                    v-if="photoFiles.length > 0"
                    color="warning"
                    variant="subtle"
                    title="You can only add up to 10 photos"
                    icon="i-material-symbols-error-outline-rounded"
                />
                <UFileUpload
                    v-model="photoFiles"
                    variant="area"
                    color="primary"
                    size="xl"
                    layout="grid"
                    :max-files="10"
                    accept="image/*"
                    multiple
                />
            </div>
        </template>
        <template #footer>
            <UButton size="xl" variant="outline" color="neutral" @click="isOpen = false">Cancel</UButton>
            <UButton size="xl" variant="solid" color="primary" @click="addPost" :disabled="disableAddPost"
                >Add post</UButton
            >
        </template>
    </UModal>
</template>
