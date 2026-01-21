<script setup lang="ts">
import { mediaHandler } from '@/lib/mediaHandler'
import Image from '@/components/media/Imag.vue'

const { mediaViewable, getSrc, getCover } = mediaHandler()
</script>

<template>
    <div v-if="mediaViewable" class="w-full rounded-3xl bg-accent border-4 border-secondary p-4 flex flex-col gap-4">
        <p v-if="mediaViewable?.label !== 'undefined'" class=" font-bold text-2xl w-full">{{ mediaViewable?.label }}</p>
        <p v-if="mediaViewable?.description !== 'undefined'">{{ mediaViewable?.description }}</p>
        <Image v-if="(mediaViewable).type === 'image'" :src="(getSrc((mediaViewable).id) ?? '')"
            :alt="(mediaViewable).label" class="w-fit h-full border-secondary bg-accent rounded-3xl border-4" />
        <video v-if="(mediaViewable).type === 'video'" :src="(getSrc((mediaViewable).id) ?? '')"
            :alt="(mediaViewable).label" class="w-fit h-full border-secondary bg-accent rounded-3xl border-4"></video>
        <Image v-if="(mediaViewable).type === 'audio' && getCover(mediaViewable.id)" :src="(getCover((mediaViewable).id) ?? '')"
            :alt="(mediaViewable).label" class="w-fit h-full border-secondary bg-accent rounded-3xl border-4" />
    </div>
</template>