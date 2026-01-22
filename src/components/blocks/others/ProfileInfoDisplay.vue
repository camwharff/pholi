<script setup lang="ts">
import Avatar from '@/components/blocks/shared/AvatarDisplay.vue'
import HoveredPost from '@/components/blocks/shared/HoveredPost.vue'
import HoveredMedia from '@/components/blocks/shared/HoveredMedia.vue'
import { interactionHandler } from '@/lib/interactionHandler'
import { infoHandler } from '@/lib/infoHandler'
import { mediaHandler } from '@/lib/mediaHandler'
import { postHandler } from '@/lib/postHandler'
import Button from '@/components/ui/button/Button.vue'

const { avatar_url, username, bio, full_name, website_title, website_url } = infoHandler()
const { mediaViewable } = mediaHandler()
const { postViewable } = postHandler()
const { follow } = interactionHandler()

</script>

<template>
    <div class="flex flex-col gap-4">
        <div v-if="mediaViewable" class="w-full">
            <HoveredMedia />
        </div>
        <div v-else-if="postViewable" class="w-full">
            <HoveredPost />
        </div>
        <div v-else class="p-4 bg-secondary rounded-3xl shadow-md text-white text-sm">
            <Avatar v-model:path="avatar_url" />
            <div class="mt-4 items-center align-middle flex flex-row justify-between">
                <h2>{{ full_name }}</h2>
                <Button @click="follow">Follow</Button>
            </div>
            <h3 class="mt-2">@{{ username }}</h3>
            <h3 class="mt-2"><a target="_blank" rel="noopener noreferrer" ref="webUrl" :href="website_url">{{
                website_title
                    }}</a></h3>
            <p class="mt-2 mb-0">{{ bio }}</p>
        </div>
    </div>
</template>