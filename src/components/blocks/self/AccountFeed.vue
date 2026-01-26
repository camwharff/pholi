<script setup lang="ts">
import { type Post } from '@/lib/postHandler'
import { onMounted, computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { postHandler } from '@/lib/postHandler'
import { mediaHandler } from '@/lib/mediaHandler'
import MediaDialog from '@/components/blocks/shared/MediaDialog.vue'

const { viewPost } = postHandler()
const userStore = useUserStore()
const posts = ref<Post[]>([])
const { getSrc } = mediaHandler()

onMounted(async () => {
    await userStore.loadFromCache()

    posts.value = computed(() => userStore.info.posts ?? []).value
    for (const post of posts.value) {
        const source = await getSrc(post.id)
        post.src = source ?? ''
    }
})

</script>

<template>
    <div class="gap-2 grid grid-cols-2 lg:grid-cols-5 w-3/4">
        <div v-for="post in posts" :key="post.id"
            class="cursor-help bg-accent border-4 border-secondary relative transition-all aspect-square rounded-3xl p-2 flex flex-col gap-4 w-full overflow-hidden"
            @mouseover="viewPost(post, true)" @mouseleave="viewPost(post, false)">
            <MediaDialog :src="post.src ?? ''" :type="post.type ?? ''" :alt="post.id ?? ''" :label="post.label" :description="post.description"/>
        </div>
    </div>
</template>