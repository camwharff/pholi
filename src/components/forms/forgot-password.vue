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

const { email, error, success, isLoading, handleForgotPassword } = authHandler()

</script>

<template>
    <div class="flex flex-col gap-6">
        <Card v-if="success">
            <CardHeader>
                <CardTitle class="text-2xl">Check Your Email</CardTitle>
                <CardDescription class="text-black">Password reset instructions sent</CardDescription>
            </CardHeader>
            <CardContent>
                <p class="text-sm text-muted-foreground">
                    If you registered using your email and password, you will receive a password reset email.
                </p>
            </CardContent>
        </Card>

        <Card v-else>
            <CardHeader>
                <CardTitle class="text-2xl">Reset Your Password</CardTitle>
                <CardDescription  class="text-black">
                    Type in your email and we&apos;ll send you a link to reset your password if you have an account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit="handleForgotPassword">
                    <div class="flex flex-col gap-6">
                        <div class="grid gap-2">
                            <Label for="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required v-model="email" />
                        </div>
                        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
                        <Button type="submit" class="w-full" :disabled="isLoading">
                            {{ isLoading ? "Sending..." : "Send reset email" }}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
</template>