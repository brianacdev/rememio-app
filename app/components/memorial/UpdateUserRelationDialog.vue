<script lang="ts" setup>
import { whenever } from '@vueuse/core'
const toast = useToast()
const isOpen = defineModel<boolean>('open', { required: true })

const memorialStore = useMemorialStore()
const userContext = computed(() => memorialStore.userContext)
const memorial = computed(() => memorialStore.memorial)
const memorialName = computed(() => memorial.value?.name || '')

const relation = ref('')
const saving = ref(false)

const emit = defineEmits<{
    'relation:updated': []
}>()

whenever(() => isOpen.value, reset, { immediate: true })

function reset() {
    relation.value = userContext.value?.relation || ''
    saving.value = false
}

const relationOptions = ref([
    'Grandson',
    'Granddaughter',
    'Son',
    'Daughter',
    'Brother',
    'Sister',
    'Father',
    'Mother',
    'Uncle',
    'Aunt',
    'Nephew',
    'Niece',
    'Cousin',
    'Friend',
    'Coworker',
    'Neighbor',
])

async function saveRelation() {
    saving.value = true
    const _relation = relation.value.trim()
    if (!_relation) {
        toast.add({
            title: 'Relation is required',
            icon: 'i-material-symbols-error-circle-rounded-outline-sharp',
            color: 'warning',
        })
        return
    }
    try {
        await $fetch(`/api/memorial/${memorialStore.memorialId}/user/relation`, {
            method: 'PUT',
            body: { relation: _relation },
        })
        emit('relation:updated')
    } finally {
        saving.value = false
    }
}
</script>

<template>
    <UModal v-model:open="isOpen" title="Update relation" :description="`Tell others how you knew ${memorialName}.`">
        <template #body>
            <div class="px-2">
                <UFormField label="Relation" size="xl">
                    <UInputMenu
                        v-model="relation"
                        :items="relationOptions"
                        class="w-full"
                        @keydown.enter="saveRelation"
                    />
                </UFormField>
            </div>
        </template>
        <template #footer>
            <UButton size="xl" variant="outline" color="neutral" @click="isOpen = false" label="Cancel" />
            <UButton
                size="xl"
                variant="solid"
                color="primary"
                :disabled="saving || !relation.trim()"
                @click="saveRelation"
                :label="saving ? 'Saving...' : 'Save'"
            />
        </template>
    </UModal>
</template>
