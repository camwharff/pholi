<script setup lang="ts">
import { infoHandler } from '@/lib/infoHandler'
import { authHandler } from '@/lib/authHandler'
import Button from '@/components/ui/button/Button.vue'
import { useUserStore } from '@/stores/user'
import { onMounted, computed } from 'vue'
import AvatarEdit from '@/components/blocks/self/AvatarEdit.vue'
import Label from '@/components/ui/label/Label.vue'
import Input from '@/components/ui/input/Input.vue'

const { updateProfile } = infoHandler()
const { user } = authHandler()
const userStore = useUserStore()
const bio = computed(() => userStore.info?.bio ?? '')
const avatar_url = computed(() => userStore.info?.avatar_url ?? '')
const display_name = computed(() => userStore.info?.full_name ?? '')

onMounted(async () => {
    await userStore.loadFromCache()
})

</script>

<template>
    <div class="flex w-full">
        <div class="p-4 bg-secondary rounded-2xl shadow-md text-white text-sm w-full" v-if="user">
            <form class="flex flex-col gap-4" @submit.prevent="updateProfile">
                <AvatarEdit :src="avatar_url" @upload="updateProfile" />

                <div class="flex flex-col gap-2">
                    <Label for="display_name">Display Name</Label>
                    <Input class="bg-input text-black" id="display_name" type="text" v-model="display_name" />
                </div>

                <div class="flex flex-col gap-2">
                    <Label for="bio">Bio</Label>
                    <Input class="bg-input text-black" id="bio" type="text" v-model="bio" />
                </div>

                <div class="flex flex-row justify-center">
                    <Button type="submit">
                        Save
                    </Button>
                </div>
            </form>
        </div>
    </div>

</template>

<!-- <style scoped>
.form-widget {
    display: flex;
    flex-direction: column;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
}

.form-group label {
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.form-group input[type='text'],
.form-group input[type='url'] {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    background-color: white;
    color: black
}

.avatar-group {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
}

.button {
    padding: 0.6rem 1rem;
    border: none;
    cursor: pointer;
    font-size: 1rem;
}

.button.block {
    width: 100%;
}

.button:disabled {
    background-color: #aaa;
    cursor: not-allowed;
}
</style> -->