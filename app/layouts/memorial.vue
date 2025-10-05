<script lang="ts" setup>
import MemorialHeader from '~/components/memorial/MemorialHeader.vue'
import AppContainer from '~/components/app/AppContainer.vue'
</script>

<template>
    <div class="flex h-full min-h-screen flex-col">
        <MemorialHeader class="flex-none" />
        <UMain class="flex-1 py-6">
            <AppContainer class="h-full">
                <slot />
            </AppContainer>
        </UMain>

        <UFooter class="mt-10 border-t border-gray-400/50">
            <span class="text-sm text-gray-500">Rememio</span>
        </UFooter>
    </div>
</template>
