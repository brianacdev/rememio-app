<script lang="ts" setup>
import { encodeQueryItem } from 'ufo'
import AppContainer from './AppContainer.vue'
const isDev = !!import.meta.dev
const authSession = useAuthSession()
const route = useRoute()

function handleLogin() {
    navigateTo('/_auth/login?' + encodeQueryItem('returnUrl', route.path), { external: true })
}
</script>

<template>
    <div class="bg-white shadow">
        <AppContainer class="flex h-14 justify-between">
            <div class="flex items-center">
                <NuxtLink class="text-primary/80 text-xl font-medium" to="/">Rememio</NuxtLink>
            </div>
            <div class="flex items-center"></div>
            <div class="flex items-center space-x-4">
                <template v-if="!authSession.loggedIn.value">
                    <UButton variant="link" color="neutral" type="button" @click="handleLogin" label="Login" />
                    <NuxtLink v-if="isDev" class="text-primary text-base" :to="{ name: 'dev-login' }"
                        >Login (dev)</NuxtLink
                    >
                </template>
                <template v-else-if="authSession.user?.value">
                    <NuxtLink class="text-primary text-sm" to="/profile">{{
                        authSession.user.value.fullName
                    }}</NuxtLink>
                    <NuxtLink class="text-primary text-base" to="/_auth/logout" external>Logout</NuxtLink>
                </template>
                <template v-else>
                    <div class="text-muted-foreground text-sm">Loading profile…</div>
                </template>
            </div>
        </AppContainer>
    </div>
</template>
