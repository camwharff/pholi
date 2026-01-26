<script setup lang="ts">
import Image from '@/components/media/Imag.vue'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from '@/components/ui/dialog'
import Card from '@/components/ui/card/Card.vue'
import { VisuallyHidden } from 'reka-ui'
import { type Post } from '@/lib/postHandler'
import { onMounted, computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { postHandler } from '@/lib/postHandler'
import { mediaHandler } from '@/lib/mediaHandler'

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
        console.log(post)
    }
})

</script>

<template>
    <div class="gap-2 grid grid-cols-2 lg:grid-cols-5 w-3/4">
        <div v-for="post in posts" :key="post.id"
            class="cursor-help bg-accent border-4 border-secondary relative transition-all aspect-square rounded-3xl p-2 flex flex-col gap-4 w-full overflow-hidden"
            @mouseover="viewPost(post, true)" @mouseleave="viewPost(post, false)">
            <Dialog class="w-full h-full">
                <DialogTrigger class="w-full h-full">
                    <Image v-if="post.type === 'image'" :src="post.src ?? ''" :alt="post.label"
                        class="cursor-help w-full h-full border-secondary bg-accent rounded-3xl border-4 object-cover" />
                    <video v-if="post.type === 'video'" :src="post.src ?? ''" :alt="post.label"
                        class="cursor-help w-full h-full border-secondary bg-accent rounded-3xl border-4 object-cover"
                        controls></video>
                    <Image v-if="post.type === 'audio'" :src="post.src ?? ''" :alt="post.label"
                        class="cursor-help w-full h-3/4 border-secondary bg-accent rounded-3xl border-4" />
                    <audio v-if="post.type === 'audio'" :src="post.src ?? ''" :alt="post.label"
                        class="cursor-help w-full h-full bg-accent" controls></audio>
                </DialogTrigger>
                <DialogContent class="h-screen w-screen">
                    <VisuallyHidden asChild>
                        <DialogTitle :value="post.label" />
                        <DialogDescription :value="post.label" />
                    </VisuallyHidden>
                    <div class="h-full w-fit flex flex-row gap-4">
                        <Card v-if="post.label || post.description"
                            class="bg-accent border-4 border-secondary p-4 rounded-3xl h-fit max-w-[20vw] flex flex-col gap-4">
                            <p v-if="post.label" class="w-full text-4xl font-bold">{{ post.label }}</p>
                            <p v-if="post.description" class="w-full text-xl ">{{ post.description }}</p>
                        </Card>
                        <div class="flex-1 h-3/4">
                            <Image v-if="post.type === 'image'" :src="post.src ?? ''" :alt="post.label ?? ''"
                                class="h-full border-secondary bg-accent rounded-3xl border-4 w-full" />
                            <video v-if="post.type === 'video'" :src="post.src ?? ''" :alt="post.label ?? ''"
                                class="w-full h-full border-secondary bg-accent rounded-3xl border-4"
                                controls></video>
                            <Image v-if="post.type === 'audio'" :src="post.src ?? ''" :alt="post.label ?? ''"
                                class="w-full h-3/4 border-secondary bg-accent rounded-3xl border-4" />
                            <audio v-if="post.type === 'audio'" :src="post.src ?? ''" :alt="post.label ?? ''"
                                class="w-full h-full bg-accent" controls></audio>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>