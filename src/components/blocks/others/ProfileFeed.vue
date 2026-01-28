<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProfilesStore } from '@/stores/profiles'
import { postHandler } from '@/lib/postHandler'
import MediaDialog from '../shared/MediaDialog.vue'
import logoCircleFront from '@/assets/logo-circle-front.vue'

const { viewPost } = postHandler()
const route = useRoute()
const profilesStore = useProfilesStore()
const username = route.params.username as string
const posts = computed(() => profilesStore.profiles[username ?? '']?.posts ?? [])
const loading = ref(true)

onMounted(async () => {
    await profilesStore.fetchProfile(username)
    await profilesStore.loadFromCache(username)

    loading.value = false
})

</script>

<template>
    <div class="flex items-center justify-center">
        <div v-if="posts.length === 0" class="w-full h-full flex flex-col items-center justify-center gap-4 rounded-full m-10">
            <p class="bg-accent rounded-3xl px-8 py-4">Nothing yet... Check back soon!</p>
        </div>
        <div v-else-if="loading" class="w-full h-full flex flex-col items-center justify-center gap-4 rounded-full m-10">
            <logoCircleFront width="250" height="250" class="rounded-full animate-pulse" />
        </div>
        <div v-else class="gap-2 grid grid-cols-2 lg:grid-cols-5 w-full">
            <div v-for="post in posts" :key="post.id"
                class="bg-accent border-4 border-secondary relative transition-all aspect-square rounded-3xl flex flex-col gap-4 w-full overflow-hidden"
                @mouseover="viewPost(post, true)" @mouseleave="viewPost(post, false)">
                <MediaDialog :src="post.url ?? ''" :type="post.type ?? ''" :alt="post.id ?? ''" :label="post.label"
                    :description="post.description" />
            </div>
        </div>
    </div>
</template>