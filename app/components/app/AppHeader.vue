<script lang="ts" setup>
import AppContainer from './AppContainer.vue'
const isDev = !!import.meta.dev
const authSession = useAuthSession()
</script>

<template>
    <div class="bg-white shadow">
        <AppContainer class="flex h-14 justify-between">
            <div class="flex items-center">
                <NuxtLink class="text-xl font-medium text-primary/80" to="/">Rememio</NuxtLink>
            </div>
            <div class="flex items-center"></div>
            <div class="flex items-center space-x-4">
                <template v-if="!authSession.loggedIn.value">
                    <NuxtLink class="text-sm text-primary" to="/">Login</NuxtLink>
                    <NuxtLink v-if="isDev" class="text-base text-primary" :to="{ name: 'dev-login' }"
                        >Login (dev)</NuxtLink
                    >
                </template>
                <template v-else-if="authSession.user?.value">
                    <NuxtLink class="text-sm text-primary" to="/profile">{{
                        authSession.user.value.fullName
                    }}</NuxtLink>
                    <NuxtLink class="text-base text-primary" to="/_auth/logout" external>Logout</NuxtLink>
                </template>
                <template v-else>
                    <div class="text-muted-foreground text-sm">Loading profile…</div>
                </template>
            </div>
        </AppContainer>
    </div>
</template>
