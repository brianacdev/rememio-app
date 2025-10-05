<script lang="ts" setup>
const props = defineProps<{
    post: PostListItem
}>()
const { post } = toRefs(props)
const memorialStore = useMemorialStore()
const createdBy = computed(() => memorialStore.memorialUsersMap.get(post.value.createdBy))
const createdAtRelative = computed(() => post.value.createdAtRelative)
</script>

<template>
    <div v-if="createdBy" class="flex justify-between gap-2">
        <div class="flex flex-1 items-center gap-2">
            <UAvatar :src="createdBy.photoUrl" :alt="createdBy.fullName" size="3xl" />
            <div class="flex flex-col">
                <div class="flex items-center gap-2">
                    <span>{{ createdBy.fullName }}</span>
                    <span class="text-sm text-gray-500" v-if="createdBy.relation"> {{ createdBy.relation }} </span>
                </div>
                <div>
                    <span class="text-sm text-gray-500"> {{ createdAtRelative }} </span>
                </div>
            </div>
        </div>
        <div class="flex-none"></div>
    </div>
</template>
