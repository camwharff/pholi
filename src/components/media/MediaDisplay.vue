<script setup lang="ts">
import Image from './Imag.vue'

defineProps<{
    src: string
    type: string
    alt: string
    cover?: string
    label?: string
    description?: string
}>()
</script>

<template>
    <div
        class="w-full h-full flex items-center justify-center overflow-hidden border-4 border-secondary rounded-3xl">
        <div v-if="type === 'image'" class="w-full h-full">
            <img :src="src" :alt="alt" class="w-full h-full object-cover" />
        </div>
        <div v-else-if="type === 'video'" class="w-full h-full">
            <video :src="src" :alt="alt" class="w-full h-full object-cover" controls></video>
        </div>
        <div v-else-if="type === 'audio'" class="w-full h-full flex flex-col items-center justify-center gap-4">
            <Image v-if="cover" :src="cover" :alt="alt" class="w-1/2 h-1/2 object-cover rounded-2xl" />
            <audio :src="src" :alt="alt" class="w-full" controls></audio>
        </div>
        <div v-else-if="type === 'text'" class="w-full h-full p-4 overflow-auto flex flex-col gap-2 text-white items-center justify-center">
            <p v-if="label && description === ''" class="font-bold text-5xl">{{ label }}</p>
            <p v-else-if="label" class="font-bold text-3xl">{{ label }}</p>
            <p v-if="description" class="text-base">{{ description }}</p>
        </div>
        <div v-else-if="type === 'filler'" class="w-full h-full bg-secondary"></div>
        <div v-else class="w-full h-full flex items-center justify-center">
            <p class="text-white">Unsupported media type</p>
        </div>
    </div>
</template>