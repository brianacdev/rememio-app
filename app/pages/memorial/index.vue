<script lang="ts" setup>
definePageMeta({
    name: 'memorial-index',
    path: '/memorial/:name/:memorialId',
    layout: false,
})
navigateTo({ name: 'memorial-feed' })
</script>

<template>
    <div>
        <p>Memorial index</p>
    </div>
</template>
