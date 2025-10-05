<script lang="ts" setup>
import AppHeader from '~/components/app/AppHeader.vue'
import AppContainer from '~/components/app/AppContainer.vue'
</script>

<template>
    <div class="flex h-full min-h-screen flex-col">
        <AppHeader class="flex-none" />
        <UMain class="flex-1 pt-6">
            <AppContainer class="h-full">
                <slot />
            </AppContainer>
        </UMain>
    </div>
</template>
