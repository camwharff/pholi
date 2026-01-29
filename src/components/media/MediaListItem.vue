<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { mediaHandler } from '@/lib/mediaHandler'
import type { MediaType } from '@/lib/types'
import { Clapperboard, Music } from 'lucide-vue-next'

const props = defineProps<{
    src: string
    type: MediaType
    alt: string
    cover?: string
    label?: string
    description?: string
}>()

const { preloadMedia } = mediaHandler()
const mediaLoaded = ref(false)

onMounted(async () => {
    await preloadMedia(props.src, props.type)
    mediaLoaded.value = true
})
</script>

<template>
    <img class="aspect-square object-cover border-0 w-full h-full" v-if="type === 'image'" :src="src" />
    <div v-if="type === 'video'" class="relative h-full w-full aspect-square">
        <video class="aspect-square object-cover border-0 w-full h-full">
            <source :src="src" />
        </video>
        <div class="absolute inset-0 flex items-center justify-center bg-white/30">
            <Clapperboard class="h-3/4 w-3/4" />
        </div>
    </div>
    <div v-if="type === 'audio'" class="relative h-full w-full aspect-square">
        <img :src="cover" class="absolute inset-0 h-full w-full object-cover" />
        <div class="absolute inset-0 flex items-center justify-center bg-white/30">
            <Music class="h-3/4 w-3/4" />
        </div>
    </div>
</template>