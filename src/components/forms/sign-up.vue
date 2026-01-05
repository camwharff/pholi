<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authHandler } from "@/lib/authHandler"

const { success, handleSignUp, full_name, username, email, password, repeatPassword, error, isLoading, changeMode } = authHandler()

</script>

<template>
    <div class="flex flex-col gap-6 ">
        <Card v-if="success">
            <CardHeader>
                <CardTitle class="text-2xl">Thank you for signing up!</CardTitle>
                <CardDescription class="text-black">Check your email to confirm</CardDescription>
            </CardHeader>
            <CardContent>
                <p class="text-sm text-muted-foreground">
                    You've successfully signed up. Please check your email to confirm your account before
                    signing in.
                </p>
            </CardContent>
        </Card>

        <Card v-else>
            <CardHeader>
                <CardTitle className="text-2xl font-semibold">Sign up</CardTitle>
                <CardDescription class="text-black">Create a new account</CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="handleSignUp">
                    <div class="flex flex-col gap-6">
                        <div class="grid gap-2">
                            <Label for="full_name">Name</Label>
                            <Input id="full_name" type="text" placeholder="Pepper the cat" required v-model="full_name" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="username">Username</Label>
                            <Input id="username" type="text" placeholder="peppercorn" required v-model="username" />
                        </div>
                        <!-- Email -->
                        <div class="grid gap-2">
                            <Label for="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required v-model="email" />
                        </div>

                        <!-- Password -->
                        <div class="grid gap-2">
                            <div class="flex items-center">
                                <Label for="password">Password</Label>
                            </div>
                            <Input id="password" type="password" required v-model="password" />
                        </div>

                        <!-- Repeat Password -->
                        <div class="grid gap-2">
                            <div class="flex items-center">
                                <Label for="repeat-password">Repeat Password</Label>
                            </div>
                            <Input id="repeat-password" type="password" required v-model="repeatPassword" />
                        </div>

                        <!-- Error -->
                        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

                        <!-- Submit -->
                        <Button type="submit" class="w-full" :disabled="isLoading">
                            {{ isLoading ? "Creating an account..." : "Sign up" }}
                        </Button>
                    </div>

                    <div class="mt-4 text-center text-sm">
                        Already have an account?
                    <a href="#" class="hover:underline" @click.prevent="changeMode('LOGIN')">Log In!</a>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
</template>