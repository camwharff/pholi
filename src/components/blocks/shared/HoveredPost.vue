<script setup lang="ts">
import { postHandler } from '@/lib/postHandler'
import Image from '@/components/media/Imag.vue'

const { postViewable } = postHandler()
</script>

<template>
    <div v-if="postViewable" class="w-full rounded-3xl bg-accent border-4 border-secondary p-4 flex flex-col gap-4">
        <p v-if="postViewable?.label" class=" font-bold text-2xl w-full">{{ postViewable?.label }}</p>
        <p v-if="postViewable?.description">{{ postViewable?.description }}</p>
        <Image v-if="(postViewable).type === 'image'" :src="postViewable.url" :alt="(postViewable).label"
            class="w-fit h-full border-secondary bg-accent rounded-3xl border-4" />
        <video v-if="(postViewable).type === 'video'" :src="postViewable.url" :alt="(postViewable).label"
            class="w-fit h-full border-secondary bg-accent rounded-3xl border-4"></video>
        <Image v-if="(postViewable).type === 'audio'" :src="postViewable.url" :alt="(postViewable).label"
            class="w-fit h-full border-secondary bg-accent rounded-3xl border-4" />
    </div>
</template>