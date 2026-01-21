<script setup lang="ts">
import { postHandler } from '@/lib/postHandler'
import { mediaHandler } from '@/lib/mediaHandler'
import Image from '@/components/media/Imag.vue'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { VisuallyHidden } from 'reka-ui'

const { posts, viewPost } = postHandler()
const { getSrc, getCover } = mediaHandler()

</script>

<template>
    <div class="gap-2 grid grid-cols-2 lg:grid-cols-5 w-3/4">
        <div v-for="post in posts" :key="post.id"
            class="cursor-help bg-accent border-4 border-secondary relative transition-all aspect-square rounded-3xl p-2 flex flex-col gap-4 w-full overflow-hidden"
            @mouseover="viewPost(post, true)" @mouseleave="viewPost(post, false)">
            <Dialog class="w-full h-full">
                <DialogTrigger class="w-full h-full">
                    <Image v-if="post.type === 'image'" :src="post.src" :alt="post.title"
                        class="cursor-help w-full h-full border-secondary bg-accent rounded-3xl border-4 object-cover" />
                    <video v-if="post.type === 'video'" :src="post.src" :alt="post.title"
                        class="cursor-help w-full h-full border-secondary bg-accent rounded-3xl border-4 object-cover"
                        controls></video>
                    <Image v-if="post.type === 'audio'" :src="(getCover(post.src) ?? '')" :alt="post.title"
                        class="cursor-help w-full h-3/4 border-secondary bg-accent rounded-3xl border-4" />
                    <audio v-if="post.type === 'audio'" :src="(getSrc(post.src) ?? '')" :alt="post.title"
                        class="cursor-help w-full h-full bg-accent" controls></audio>
                </DialogTrigger>
                <DialogContent class="h-3/4 w-auto">
                    <VisuallyHidden asChild>
                        <DialogTitle :value="post.title" />
                    </VisuallyHidden>
                    <div class="h-[70vh] w-fit flex flex-row gap-8">
                        <Card v-if="post.title || post.caption" class="bg-accent border-4 border-secondary p-8 rounded-3xl h-fit max-w-[20vw] flex flex-col gap-4">
                            <p v-if="post.title" class="w-full text-4xl font-bold">{{ post.title }}</p>
                            <p v-if="post.caption" class="w-full text-xl ">{{ post.caption }}</p>
                        </Card>
                        <div class="flex-1 w-full">
                            <Image v-if="post.type === 'image'" :src="post.src" :alt="post.title"
                                class="h-full border-secondary bg-accent rounded-3xl border-4 object-cover" />
                            <video v-if="post.type === 'video'" :src="post.src" :alt="post.title"
                                class="w-full h-full border-secondary bg-accent rounded-3xl border-4 object-cover"
                                controls></video>
                            <Image v-if="post.type === 'audio'" :src="(getCover(post.src) ?? '')" :alt="post.title"
                                class="w-full h-3/4 border-secondary bg-accent rounded-3xl border-4" />
                            <audio v-if="post.type === 'audio'" :src="(getSrc(post.src) ?? '')" :alt="post.title"
                                class="w-full h-full bg-accent" controls></audio>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>