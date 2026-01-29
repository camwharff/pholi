<script setup lang="ts">
import { infoHandler } from '@/lib/infoHandler'
import { authHandler } from '@/lib/authHandler'
import Button from '@/components/ui/button/Button.vue'
import { useUserStore } from '@/stores/user'
import { onMounted, computed, ref } from 'vue'
import AvatarEdit from '@/components/blocks/self/AvatarEdit.vue'
import Label from '@/components/ui/label/Label.vue'
import Input from '@/components/ui/input/Input.vue'

const { updateProfile } = infoHandler()
const { user } = authHandler()
const userStore = useUserStore()
const bio = ref(userStore.info?.bio ?? '')
const avatar_url = computed(() => userStore.info?.avatar_url ?? '')
const full_name = ref(userStore.info?.full_name ?? '')
const avatar_src = ref(userStore.info?.avatar_src ?? '')
const savingInfo = ref(false)

onMounted(async () => {
    await userStore.loadFromCache()
})

const handleAvatarUpdate = (newSrc: string) => {
    avatar_src.value = newSrc
}

const setSaveState = (value: boolean) => {
    savingInfo.value = value
}

async function updateWrapper(bio: string, avatar_src: string, full_name: string) {
    savingInfo.value = true
    await updateProfile(bio, avatar_src, full_name)
    savingInfo.value = false
}

</script>

<template>
    <div class="flex w-full">
        <div class="p-4 bg-secondary rounded-2xl shadow-md text-white text-sm w-full" v-if="user">
            <form class="flex flex-col gap-4" @submit.prevent="updateWrapper(bio, avatar_src, full_name)">
                <div class="w-full">
                    <AvatarEdit :avatar_url="avatar_url" @update:avatar_src="handleAvatarUpdate"
                        @disableSave="setSaveState" />
                </div>
                <div class="flex flex-col gap-2">
                    <Label for="display_name">Display Name</Label>
                    <Input class="bg-input text-black" id="display_name" type="text" v-model="full_name" />
                </div>

                <div class="flex flex-col gap-2">
                    <Label for="bio">Bio</Label>
                    <Input class="bg-input text-black" id="bio" type="text" v-model="bio" />
                </div>

                <div class="flex flex-row justify-center">
                    <Button type="submit" :disabled="savingInfo" class="hover-transition hover:bg-primary">
                        {{ savingInfo ? 'uploading...' : 'Save Updates' }}
                    </Button>
                </div>
            </form>
        </div>
    </div>

</template>
