<script lang="ts" setup>
definePageMeta({
    name: 'dev-login',
    layout: false,
    middleware: ['dev'],
})

const { data: users } = await useFetch('/api/_dev/users', {
    key: 'dev-login-users',
    transform: (data) => data.users.map((u) => ({ label: u.fullName, value: u.userId })),
    lazy: true,
})

const selectedUser = ref<string>()
watch(selectedUser, () => {
    navigateTo(`/_dev/login?userId=${selectedUser.value}`, { external: true })
})
</script>

<template>
    <div class="bg-linear-to-t flex h-full min-h-screen items-center justify-center from-blue-500/80 to-blue-300/80">
        <UCard class="w-[350px]" title="Dev login">
            <form>
                <div class="grid w-full items-center gap-4">
                    <div class="flex flex-col space-y-1.5">
                        <USelect v-model="selectedUser" :items="users" class="w-full" color="primary" />
                    </div>
                </div>
            </form>
        </UCard>
    </div>
</template>
