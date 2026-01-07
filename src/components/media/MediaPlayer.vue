<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Play, Pause, Volume2, VolumeX } from 'lucide-vue-next'

defineProps<{ src: string; type: string; cover?: string }>()

const mediaRef = ref<HTMLAudioElement | HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const duration = ref(0)

function togglePlay() {
    if (!mediaRef.value) return
    if (mediaRef.value.paused) mediaRef.value.play()
    else mediaRef.value.pause()
}

function toggleMute() {
    if (!mediaRef.value) return
    mediaRef.value.muted = !mediaRef.value.muted
    isMuted.value = mediaRef.value.muted
}

onMounted(() => {
    if (!mediaRef.value) return
    duration.value = mediaRef.value.duration || 0
    mediaRef.value.addEventListener('play', () => (isPlaying.value = true))
    mediaRef.value.addEventListener('pause', () => (isPlaying.value = false))
    mediaRef.value.addEventListener('volumechange', () => {
        if (mediaRef.value) isMuted.value = mediaRef.value.muted
    })
})
</script>

<template>
    <div class="relative w-full overflow-hidden">
        <div v-if="type === 'audio'">
            <img :src="cover" alt="Audio Cover"
                class="absolute inset-0 w-full h-full object-cover" />
            <audio ref="mediaRef" :src="src" class="w-full" preload="metadata"></audio>
        </div>
        <video v-if="type === 'video'" ref="mediaRef" :src="src" class="w-full h-full object-cover"
            preload="metadata"></video>
        <div
            class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-fit bg-black/30 hover:bg-black/70 rounded-md flex items-center gap-4 p-2 justify-center">
            <button @click="togglePlay" class="text-white p-2 rounded hover:bg-gray-700">
                <component :is="isPlaying ? Pause : Play" class="w-6 h-6" />
            </button>

            <button @click="toggleMute" class="text-white p-2 rounded hover:bg-gray-700">
                <component :is="isMuted ? VolumeX : Volume2" class="w-6 h-6" />
            </button>
        </div>
    </div>
</template>