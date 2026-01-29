<script setup lang="ts">
import AvatarDisplay from '@/components/blocks/shared/AvatarDisplay.vue'
import HoveredPost from '@/components/blocks/shared/HoveredPost.vue'
import HoveredMedia from '@/components/blocks/shared/HoveredMedia.vue'
import { useUserStore } from '@/stores/user'
import { pholiHelpers } from '@/lib/pholiHelpers'
import { postHandler } from '@/lib/postHandler'
import { onMounted, computed } from 'vue'
import logoCircleFront from '@/assets/logo-circle-front.vue'

const { mediaViewable } = pholiHelpers()
const { postViewable } = postHandler()

const userStore = useUserStore()

onMounted(async () => {
    await userStore.loadFromCache()
})

const avatarUrl = computed(() => userStore.info?.avatar_url ?? '')
const displayName = computed(() => userStore.info?.full_name ?? '')
const username = computed(() => userStore.info?.username ?? '')
const bio = computed(() => userStore.info?.bio ?? '')
const followingCount = computed(() => userStore.followingInfo?.followingCount ?? '')
const followerCount = computed(() => userStore.followingInfo?.followerCount ?? '')

</script>

<template>
    <Transition name="fade">
        <div v-if="mediaViewable" class="w-full absolute">
            <HoveredMedia />
        </div>
        <div v-else-if="postViewable" class="w-full absolute">
            <HoveredPost />
        </div>
        <div v-else class="flex flex-col gap-2 w-full shadow-md shadow-shadow rounded-2xl absolute">
            <div class="p-4 bg-secondary rounded-2xl text-white text-sm flex flex-col gap-2">
                <div class="w-full bg-accent rounded-3xl shadow-sm hover:shadow-lg shadow-shadow">
                    <AvatarDisplay v-if="avatarUrl" :src="avatarUrl" />
                    <logo-circle-front v-else class="w-full h-full rounded-full mx-auto text-accent" />
                </div>
                <div class="bg-accent p-4 flex gap-2 flex-col rounded-xl shadow-sm hover:shadow-lg shadow-shadow">
                    <h2>{{ displayName }}</h2>
                    <h3>@{{ username }}</h3>
                    <p v-if="bio">{{ bio }}</p>
                </div>
                <div class="bg-accent p-4 shadow-sm hover:shadow-lg shadow-shadow flex gap-2 flex-col rounded-xl">
                    <p>{{ followerCount }} {{ followerCount === 1 ? 'Follower' : 'Followers' }}</p>
                    <p>{{ followingCount }} Following</p>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>