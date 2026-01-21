<script setup lang="ts">
import Avatar from '@/components/blocks/self/AvatarEdit.vue'
import { infoHandler } from '@/lib/infoHandler'
import { authHandler } from '@/lib/authHandler'
import Button from '@/components/ui/button/Button.vue'

const { avatar_url, username, bio, full_name, website_title, website_url, updateProfile } = infoHandler()
const { user } = authHandler()

</script>

<template>
    <div class="flex">
        <div class="p-8 bg-secondary rounded-3xl shadow-md text-white text-sm" v-if="user">
            <form class="form-widget" @submit.prevent="updateProfile">
                <Avatar v-model:path="avatar_url" @upload="updateProfile" />

                <div class="form-group">
                    <label for="full_name">Full Name</label>
                    <input id="full_name" type="text" v-model="full_name" />
                </div>

                <div class="form-group">
                    <label for="username">Username</label>
                    <input id="username" type="text" v-model="username" />
                </div>

                <div class="form-group">
                    <label for="website_url">Website URL</label>
                    <input id="website_url" type="url" v-model="website_url" />
                </div>

                <div class="form-group">
                    <label for="website_title">Website Label</label>
                    <input id="website_title" type="text" v-model="website_title" />
                </div>
                <div class="form-group">
                    <label for="bio">Bio</label>
                    <input id="bio" type="text" v-model="bio" />
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

<style scoped>
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
</style>