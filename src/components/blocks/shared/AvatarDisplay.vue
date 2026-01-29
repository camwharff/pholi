<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { mediaHandler } from '@/lib/mediaHandler'
import logoCircleFront from '@/assets/logo-circle-front.vue'

const prop = defineProps(['src'])
const { preloadMedia } = mediaHandler()
const imageLoaded = ref(false)

onMounted(async () => {
    await preloadMedia(prop.src, 'image')
    imageLoaded.value = true
})
</script>

<template>
    <div class="flex flex-col items-center w-full h-full">
        <div class="aspect-square overflow-hidden w-full rounded-3xl">
            <img v-if="imageLoaded" :src="src" alt="Avatar"
                class="w-full h-full avatar image rounded-3xl border-accent border-4 object-cover" />
            <logo-circle-front v-else class="animate-pulse w-full h-full rounded-full mx-auto text-accent" />
        </div>
    </div>
</template>