<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import PholiDisplay from '@/components/blocks/shared/PholiDisplay.vue'

const userStore = useUserStore()
const pholi = computed(() => userStore.info?.pholi ?? [])

onMounted(async () => {
    await userStore.loadFromCache()
})

</script>

<template>
    <PholiDisplay :pholi="pholi" />
</template>