<script setup lang="ts">
import { postHandler } from '@/lib/postHandler'
const { postViewable } = postHandler()
</script>

<template>
    <div class="rounded-3xl bg-accent border-4 border-secondary p-4 flex flex-col gap-4">
        <p v-if="postViewable?.title" class=" font-bold text-2xl">{{ postViewable?.title }}</p>
        <p v-if="postViewable?.caption" >{{ postViewable?.caption }}</p>
        <img v-if="postViewable?.src" :src="postViewable?.src" class="rounded-3xl bg-accent border-4 border-secondary "/>
    </div>
</template>