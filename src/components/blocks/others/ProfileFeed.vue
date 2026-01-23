<script setup lang="ts">
import { type Post } from '@/lib/postHandler'
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProfilesStore } from '@/stores/profiles'
import { postHandler } from '@/lib/postHandler'
import { mediaHandler } from '@/lib/mediaHandler'

const { viewPost } = postHandler()
const route = useRoute()
const profilesStore = useProfilesStore()
const posts = ref<Post[]>([])
const { getSrc } = mediaHandler()

onMounted(async () => {
    const username = route.params.username as string
    await profilesStore.fetchProfile(username)
    await profilesStore.loadFromCache(username)

    posts.value = computed(() => profilesStore.profiles[username ?? '']?.posts ?? []).value
    for (const post of posts.value) {
        const source = await getSrc(post.id)
        post.src = source ?? ''
    }
})

</script>

<template>
    <div class="gap-4 grid grid-cols-4 w-3/4">
        <div v-for="post in posts" :key="post.id"
            class="bg-accent border-4 border-secondary relative transition-all aspect-square rounded-3xl p-4 flex flex-col gap-4 w-full overflow-hidden"
            @mouseover="viewPost(post, true)" @mouseleave="viewPost(post, false)">
            <img :src="post.src" class="border-4 border-secondary rounded-3xl object-cover h-full w-full" />
        </div>
    </div>
</template>