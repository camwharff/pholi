<script setup lang="ts">
import { postHandler } from '@/lib/postHandler'
import Image from '@/components/media/Imag.vue'

const { postViewable } = postHandler()
</script>

<template>
    <div v-if="postViewable" class="w-full rounded-3xl bg-accent border-4 border-secondary p-4 flex flex-col gap-4">
        <p v-if="postViewable?.title" class=" font-bold text-2xl w-full">{{ postViewable?.title }}</p>
        <p v-if="postViewable?.caption">{{ postViewable?.caption }}</p>
        <Image v-if="(postViewable).type === 'image'" :src="postViewable.src" :alt="(postViewable).title"
            class="w-fit h-full border-secondary bg-accent rounded-3xl border-4" />
        <video v-if="(postViewable).type === 'video'" :src="postViewable.src" :alt="(postViewable).title"
            class="w-fit h-full border-secondary bg-accent rounded-3xl border-4"></video>
        <Image v-if="(postViewable).type === 'audio'" :src="postViewable.src" :alt="(postViewable).title"
            class="w-fit h-full border-secondary bg-accent rounded-3xl border-4" />
    </div>
</template>