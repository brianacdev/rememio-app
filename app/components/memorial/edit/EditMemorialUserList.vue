<script lang="ts" setup>
const props = defineProps<{
    memorial: Memorial
    memorialUsers: MemorialUser[]
    userContext: MemorialUserContext
}>()
const { memorial, userContext } = toRefs(props)

const memorialStore = useMemorialStore()
const toast = useToast()
const memorialId = computed(() => memorial.value.memorialId)
const currentUserId = computed(() => userContext.value.userId)
const ownerUserId = computed(() => memorial.value.owner)

function sortByRole(a: MemorialUserLocal, b: MemorialUserLocal) {
    if (a.isSelfUser) return -1
    if (b.isSelfUser) return 1
    if (a.isOwnerUser) return -1
    if (b.isOwnerUser) return 1
    if (a.role === b.role) return a.fullName.localeCompare(b.fullName)
    if (a.role === 'admin') return -1
    if (b.role === 'admin') return 1
    return 0
}

function mapMemorialUser(mu: MemorialUser) {
    return {
        ...mu,
        isOwnerUser: mu.userId === ownerUserId.value,
        isSelfUser: mu.userId === currentUserId.value,
    }
}

type MemorialUserLocal = ReturnType<typeof mapMemorialUser>

const memorialUsers = computed(() => props.memorialUsers.map(mapMemorialUser).sort(sortByRole))

// Roles management
type MemorialUserRole = MemorialUser['role']
const roleItems: { label: string; value: MemorialUserRole }[] = [
    { label: 'Admin', value: 'admin' as const },
    { label: 'User', value: 'user' as const },
]

async function updateUserRole(userId: string, role: MemorialUserRole) {
    try {
        await $fetch(`/api/memorial/${memorialId.value}/users/update-role`, {
            method: 'PUT',
            body: { userId, role },
        })
        toast.add({ title: 'Role updated', color: 'success', duration: 2500 })
        memorialStore.refreshMemorial()
    } catch (error) {
        console.error(error)
        toast.add({ title: 'Failed to update role', color: 'error' })
    }
}

async function toggleBan(mu: MemorialUserLocal) {
    try {
        await $fetch(`/api/memorial/${memorialId.value}/users/toggle-ban`, {
            method: 'PUT',
            body: { userId: mu.userId },
        })
        memorialStore.refreshMemorial()
    } catch (error) {
        console.error(error)
        toast.add({ title: 'Failed to ban user', color: 'error' })
    }
}
</script>

<template>
    <UCard>
        <template #header>
            <h2 class="text-xl">People with access</h2>
            <p class="text-gray-600">Users who can view or contribute to this memorial.</p>
        </template>
        <div v-if="memorialUsers.length > 0" class="divide-y divide-gray-200">
            <div v-for="mu in memorialUsers" :key="mu.userId" class="flex items-center gap-3 py-3">
                <UAvatar :src="mu.photoUrl" :alt="mu.fullName" size="2xl" class="flex-none" />
                <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                        <span class="truncate">{{ mu.fullName }}</span>
                        <UBadge v-if="mu.isOwnerUser" variant="outline" color="primary" size="sm" label="owner" />
                        <UBadge
                            v-else-if="mu.role === 'admin'"
                            variant="outline"
                            color="info"
                            size="sm"
                            label="admin"
                        />

                        <UBadge v-if="mu.isBanned" variant="outline" color="error" size="sm" label="banned" />
                        <UBadge v-if="mu.isSelfUser" variant="outline" color="info" size="sm" label="self" />
                    </div>
                    <div class="text-sm text-gray-600" v-if="mu.relation">{{ mu.relation }}</div>
                </div>

                <div class="flex-none" v-if="!mu.isOwnerUser || !mu.isSelfUser">
                    <USelect
                        v-model="mu.role"
                        :items="roleItems"
                        size="sm"
                        color="neutral"
                        @update:modelValue="(newRole: MemorialUserRole) => updateUserRole(mu.userId, newRole)"
                    />
                </div>
                <div class="flex-none" v-if="!mu.isOwnerUser && mu.role !== 'admin' && !mu.isSelfUser">
                    <UButton
                        size="sm"
                        variant="ghost"
                        color="neutral"
                        :label="mu.isBanned ? 'Unban' : 'Ban'"
                        @click="() => toggleBan(mu)"
                    />
                </div>
            </div>
        </div>
        <div v-else class="text-gray-600">No users found.</div>
    </UCard>
</template>
