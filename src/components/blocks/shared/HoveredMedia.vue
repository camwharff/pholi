<script setup lang="ts">
import Image from '@/components/media/Imag.vue'
import { pholiHelpers } from '@/lib/pholiHelpers'

const { mediaViewable } = pholiHelpers()

</script>

<template>
    <div v-if="mediaViewable"
        class="w-full bg-accent border-4 border-secondary p-4 flex flex-col gap-4 shadow-md shadow-shadow rounded-2xl">
        <p v-if="mediaViewable.label && mediaViewable?.label !== ''" class=" font-bold text-2xl w-full">{{ mediaViewable?.label }}</p>
        <p v-if="mediaViewable.description && mediaViewable?.description !== ''">{{ mediaViewable?.description }}</p>
        <div class=" shadow-md shadow-shadow rounded-3xl">
            <Image v-if="(mediaViewable).type === 'image'" :src="(mediaViewable.url ?? '')" :alt="(mediaViewable).label"
                class="w-fit h-full border-secondary bg-accent rounded-3xl border-4" />
            <video v-if="(mediaViewable).type === 'video'" :src="(mediaViewable.url ?? '')" :alt="(mediaViewable).label"
                class="w-fit h-full border-secondary bg-accent rounded-3xl border-4"></video>
            <Image v-if="(mediaViewable).type === 'audio'" :src="(mediaViewable.url ?? '')" :alt="(mediaViewable).label"
                class="w-fit h-full border-secondary bg-accent rounded-3xl border-4" />
        </div>
    </div>
</template>