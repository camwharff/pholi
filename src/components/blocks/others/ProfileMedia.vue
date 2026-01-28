<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProfilesStore } from '@/stores/profiles'
import PholiDisplay from '@/components/blocks/shared/PholiDisplay.vue'
const route = useRoute()
const profilesStore = useProfilesStore()
const username = route.params.username as string
const pholi = computed(() => profilesStore.profiles[username]?.pholi ?? [])

onMounted(async () => {
    await profilesStore.fetchProfile(username)
    await profilesStore.loadFromCache(username)
})

</script>

<template>
    <PholiDisplay :pholi="pholi" />
</template>