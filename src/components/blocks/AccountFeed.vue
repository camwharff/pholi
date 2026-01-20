<script setup lang="ts">
import { postHandler } from '@/lib/postHandler'

const { mosaic } = postHandler()

</script>

<template>
    <div class="flex flex-col p-8 gap-4 flex-wrap w-3/4">
        <div v-for="post in mosaic" :key="post.id" class="bg-sky-950 relative overflow-visible h-fit rounded-3xl p-4 flex flex-col gap-4 w-1/3">
            <p v-if="post.title" class="text-2xl">{{ post.title }}</p>
            <img v-if="post.src" :src="post.src" class="rounded-3xl"/>
            <p v-if="post.caption" class="text-base">{{ post.caption }}</p>
        </div>
    </div>
</template>