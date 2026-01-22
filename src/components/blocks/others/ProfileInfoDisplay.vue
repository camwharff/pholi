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
import { onMounted, computed, ref } from 'vue'

interface Profile {
    id: string
    username: string
    full_name: string
    avatar_url: string
    bio: string
    followingData: {
        following: string[]
        followers: string[]
        followingCount: number
        followerCount: number
    }
}

const route = useRoute()
const { mediaViewable } = mediaHandler()
const { postViewable } = postHandler()
const { follow, unfollow } = interactionHandler()
const { user } = authHandler()
const profilesStore = useProfilesStore()
const profile = ref<Profile>({
    id: '',
    username: '',
    full_name: '',
    avatar_url: '',
    bio: '',
    followingData: {
        following: [],
        followers: [],
        followingCount: 0,
        followerCount: 0
    }
})

onMounted(async () => {
    const username = route.params.username as string
    await profilesStore.fetchProfile(username)
    await profilesStore.loadFromCache(username)

    profile.value = {
        id: computed(() => profilesStore.profiles[username ?? '']?.id ?? '').value,
        avatar_url: computed(() => profilesStore.profiles[username ?? '']?.avatar_url ?? '').value,
        full_name: computed(() => profilesStore.profiles[username]?.full_name ?? '').value,
        username: computed(() => profilesStore.profiles[username]?.username ?? '').value,
        bio: computed(() => profilesStore.profiles[username]?.bio ?? '').value,
        followingData: {
            followingCount: computed(() => profilesStore.profiles[username]?.followingData.followingCount ?? 0).value,
            followerCount: computed(() => profilesStore.profiles[username]?.followingData.followerCount ?? 0).value,
            following: computed(() => profilesStore.profiles[username]?.followingData.following ?? []).value,
            followers: computed(() => profilesStore.profiles[username]?.followingData.followers ?? []).value
        }
    }
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
                <Avatar :path="profile.avatar_url" />
                <div class="bg-accent p-4 shadow-md flex gap-2 flex-col rounded-xl">
                    <h2>{{ profile.full_name }}</h2>
                    <h3>@{{ profile.username }}</h3>
                    <p>{{ profile.bio }}</p>
                </div>
                <div class="flex flex-row justify-between items-center gap-4">
                    <div class="bg-accent p-4 shadow-md flex gap-2 flex-col rounded-xl w-full">
                        <p>{{ profile.followingData.followerCount ?? '0' }} Followers</p>
                        <p>{{ profile.followingData.followingCount ?? '0' }} Following</p>
                    </div>
                    <div v-if="user">
                        <Button v-if="profile.followingData.followers.includes(profile.id)" @click="follow">Follow</Button>
                        <Button v-else @click="unfollow">unfollow</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>