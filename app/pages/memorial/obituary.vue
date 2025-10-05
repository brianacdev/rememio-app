<script lang="ts" setup>
definePageMeta({
    name: 'memorial-obituary',
    path: '/memorial/:name/:memorialId/obituary',
    middleware: ['memorial'],
    layout: 'memorial',
})

const memorialStore = useMemorialStore()

const memorialId = computed(() => useRoute().params.memorialId as string)

async function initView() {
    await memorialStore.init(memorialId.value)
    return true
}
const memorial = computed(() => memorialStore.memorial)

callOnce('memorial-obituary', () => initView(), {
    mode: 'navigation',
})

const obituary = computed(() => memorial.value?.obituary ?? '')
const obituaryParagraphs = computed(() => {
    if (!obituary.value) return []
    const byDoubleNewline = obituary.value
        .split(/\r?\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
    const paragraphs =
        byDoubleNewline.length > 1
            ? byDoubleNewline
            : obituary.value
                  .split(/\r?\n/)
                  .map((p) => p.trim())
                  .filter(Boolean)
    return paragraphs.slice(1)
})
const firstParagraph = computed(() => obituaryParagraphs.value[0])
</script>

<template>
    <div v-if="memorial" class="flex flex-col gap-4 px-2 pt-4">
        <p v-if="firstParagraph" class="whitespace-pre-wrap text-xl">
            <span class="text-primary-500 leading-0 text-6xl font-light tracking-wide">{{
                firstParagraph.charAt(0)
            }}</span
            >{{ firstParagraph.slice(1) }}
        </p>
        <p v-for="paragraph in obituaryParagraphs" :key="paragraph" class="whitespace-pre-wrap text-xl">
            {{ paragraph }}
        </p>
    </div>
</template>
