<script setup lang="ts">
import {
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog'
import { authHandler } from '@/lib/authHandler'
import login from '../forms/login.vue'
import signUp from '../forms/sign-up.vue'
import forgotPassword from '../forms/forgot-password.vue'
import { VisuallyHidden } from 'reka-ui'

const { mode } = authHandler()

</script>

<template>
    <DialogContent class="w-1/4 shadow-none">
        <VisuallyHidden>
            <DialogTitle>
                Signup, login, and password management forms
            </DialogTitle>
            <DialogDescription>
                Signup, login, and password management forms
            </DialogDescription>
        </VisuallyHidden>
        <signUp v-if="mode === 'SIGNUP'" />
        <login v-if="mode === 'LOGIN'" />
        <forgotPassword v-if="mode === 'MANAGE'" />
    </DialogContent>
</template>