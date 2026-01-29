<script setup lang="ts">
import AvatarDisplay from '@/components/blocks/shared/AvatarDisplay.vue'
import HoveredPost from '@/components/blocks/shared/HoveredPost.vue'
import HoveredMedia from '@/components/blocks/shared/HoveredMedia.vue'
import { interactionHandler } from '@/lib/interactionHandler'
import { postHandler } from '@/lib/postHandler'
import Button from '@/components/ui/button/Button.vue'
import { authHandler } from '@/lib/authHandler'
import { useRoute } from 'vue-router'
import { useProfilesStore } from '@/stores/profiles'
import { onMounted, computed } from 'vue'
import logoCircleFront from '@/assets/logo-circle-front.vue'
import { pholiHelpers } from '@/lib/pholiHelpers'

const { mediaViewable } = pholiHelpers()
const route = useRoute()
const { postViewable } = postHandler()
const { follow, unfollow } = interactionHandler()
const { user, loadUser } = authHandler()
const profilesStore = useProfilesStore()
const username = computed(() => route.params.username as string)
const profile = computed(() => profilesStore.profiles[username.value])

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
            <div class="w-full bg-accent rounded-3xl shadow-sm hover:shadow-lg shadow-shadow">
                <AvatarDisplay v-if="profile?.avatar_url" :src="profile?.avatar_url" />
                <logo-circle-front v-else class="w-full h-full rounded-full mx-auto text-accent" />
            </div>
                <div class="bg-accent p-4 flex gap-2 flex-col rounded-xl shadow-sm hover:shadow-lg shadow-shadow">
                    <h2>{{ profile?.full_name }}</h2>
                    <h3>@{{ profile?.username }}</h3>
                    <p>{{ profile?.bio }}</p>
                </div>
                <div class="flex flex-row justify-between items-center gap-4">
                    <div class="bg-accent p-4 flex gap-2 flex-col rounded-xl w-full shadow-sm hover:shadow-lg shadow-shadow">
                        <p>{{ profile?.followingData.followerCount ?? '0' }} {{ profile?.followingData.followerCount === 1
                            ? 'Follower' : 'Followers' }}</p>
                        <p>{{ profile?.followingData.followingCount ?? '0' }} Following</p>
                    </div>
                    <div v-if="user">
                        <Button v-if="profile?.followingData.followers.includes(user.id)"
                            @click="unfollow(user.id, profile?.id, profile?.username)" class="hover:bg-primary">Unfollow</Button>
                        <Button v-else @click="follow(user.id, profile?.id || '', profile?.username || '')" class="hover:bg-primary">Follow</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>