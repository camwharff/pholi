<script setup lang="ts">
import Avatar from '@/components/blocks/AvatarDisplay.vue'
import HoveredPost from '@/components/blocks/HoveredPost.vue'
import HoveredMedia from '@/components/blocks/HoveredMedia.vue'
import { infoHandler } from '@/lib/infoHandler'
import { mediaHandler } from '@/lib/mediaHandler'
import { postHandler } from '@/lib/postHandler'

const { avatar_url, username, bio, full_name, website_title, website_url } = infoHandler()
const { mediaViewable } = mediaHandler()
const { postViewable } = postHandler()

</script>

<template>
    <div v-if="mediaViewable" class="w-full">
        <HoveredMedia />
    </div>
    <div v-else-if="postViewable" class="w-full">
        <HoveredPost />
    </div>
    <div v-else class="p-8 bg-secondary rounded-3xl shadow-md text-white text-sm">
        <Avatar v-model:path="avatar_url" />
        <h2 class="mt-4">{{ full_name }}</h2>
        <h3 class="mt-2">@{{ username }}</h3>
        <h3 class="mt-2"><a target="_blank" rel="noopener noreferrer" ref="webUrl" :href="website_url">{{ website_title
        }}</a></h3>
        <p class="mt-2 mb-0">{{ bio }}</p>
    </div>
</template>
