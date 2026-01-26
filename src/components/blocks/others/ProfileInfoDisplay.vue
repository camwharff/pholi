<script setup lang="ts">
import Avatar from '@/components/blocks/shared/AvatarDisplay.vue'
import HoveredPost from '@/components/blocks/shared/HoveredPost.vue'
import HoveredMedia from '@/components/blocks/shared/HoveredMedia.vue'
import { interactionHandler } from '@/lib/interactionHandler'
import { mediaHandler } from '@/lib/mediaHandler'
import { postHandler } from '@/lib/postHandler'
import Button from '@/components/ui/button/Button.vue'
import { authHandler } from '@/lib/authHandler'
import { useRoute } from 'vue-router'
import { useProfilesStore } from '@/stores/profiles'
import { onMounted, computed } from 'vue'

const route = useRoute()
const { mediaViewable } = mediaHandler()
const { postViewable } = postHandler()
const { follow, unfollow } = interactionHandler()
const { user, loadUser } = authHandler()
const profilesStore = useProfilesStore()
const username = computed(() => route.params.username as string)
const profile = computed(() => {
    return profilesStore.profiles[username.value]
})

onMounted(async () => {
    await loadUser()
    await profilesStore.loadFromCache(username.value)
    await profilesStore.fetchProfile(username.value)
})

</script>

<template>
    <div class="flex flex-col gap-4">
        <div v-if="mediaViewable" class="w-full">
            <HoveredMedia />
        </div>
        <div v-else-if="postViewable" class="w-full">
            <HoveredPost />
        </div>
        <div v-else class="flex flex-col gap-2 w-full">
            <div class="p-4 bg-secondary rounded-2xl shadow-md text-white text-sm flex flex-col gap-2">
                <Avatar :path="profile?.avatar_url" />
                <div class="bg-accent p-4 shadow-md flex gap-2 flex-col rounded-xl">
                    <h2>{{ profile?.full_name }}</h2>
                    <h3>@{{ profile?.username }}</h3>
                    <p>{{ profile?.bio }}</p>
                </div>
                <div class="flex flex-row justify-between items-center gap-4">
                    <div class="bg-accent p-4 shadow-md flex gap-2 flex-col rounded-xl w-full">
                        <p>{{ profile?.followingData.followerCount ?? '0' }} {{ profile?.followingData.followerCount === 1
                            ? 'Follower' : 'Followers' }}</p>
                        <p>{{ profile?.followingData.followingCount ?? '0' }} Following</p>
                    </div>
                    <div v-if="user">
                        <Button v-if="profile?.followingData.followers.includes(user.id)"
                            @click="unfollow(user.id, profile?.id, profile?.username)">Unfollow</Button>
                        <Button v-else @click="follow(user.id, profile?.id || '', profile?.username || '')">Follow</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>