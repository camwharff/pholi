<script setup lang="ts">
import Avatar from '@/components/blocks/AvatarDisplay.vue'
import { infoHandler } from '@/lib/infoHandler'

const { avatar_url, username, bio, full_name, website_title, website_url } = infoHandler()

</script>

<template>
    <div class="p-8 bg-secondary rounded-3xl shadow-md text-white text-sm">
        <Avatar v-model:path="avatar_url" />
        <h2 class="mt-4">{{ full_name }}</h2>
        <h3 class="mt-2">@{{ username }}</h3>
        <h3 class="mt-2"><a target="_blank" rel="noopener noreferrer" ref="webUrl" :href="website_url">{{ website_title
        }}</a></h3>
        <p class="mt-2 mb-0">{{ bio }}</p>
    </div>
</template>
