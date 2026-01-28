<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authHandler } from "@/lib/authHandler"
import { ref } from 'vue'

const { handleLogin, error, isLoading, changeMode } = authHandler()

const email = ref('')
const password = ref('')

</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle className="text-2xl font-semibold">Login</CardTitle>
            <CardDescription class="text-black">Enter your email and password below to log in to your account</CardDescription>
        </CardHeader>
        <CardContent>
            <form @submit.prevent="handleLogin(email, password)">
                <div class="flex flex-col gap-6">
                    <!-- Email -->
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" required v-model="email" />
                    </div>

                    <!-- Password -->
                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <Label for="password">Password</Label>
                            <a href="#" @click.prevent="changeMode('MANAGE')"
                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                Forgot your password?
                            </a>
                        </div>
                        <Input id="password" type="password" required v-model="password" />
                    </div>

                    <!-- Error -->
                    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

                    <!-- Submit -->
                    <Button type="submit" class="w-full" :disabled="isLoading">
                        {{ isLoading ? "Logging in..." : "Log In" }}
                    </Button>
                </div>

                <div class="mt-4 text-center text-sm">
                    New to Pholi?
                    <a href="#" class="hover:underline" @click.prevent="changeMode('SIGNUP')">Sign Up!</a>
                </div>
            </form>
        </CardContent>
    </Card>
</template>
