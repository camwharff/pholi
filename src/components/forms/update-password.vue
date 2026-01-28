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
import { ref } from "vue"

const { error, isLoading, handleUpdatePassword } = authHandler()

const password = ref('')
const repeatPassword = ref('')

</script>

<template>
    <div class="flex flex-col gap-6">
        <Card>
            <CardHeader>
                <CardTitle class="text-2xl">Reset Your Password</CardTitle>
                <CardDescription class="text-black">Please enter your new password below.</CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="handleUpdatePassword">
                    <div class="flex flex-col gap-6">
                        <div class="grid gap-2">
                            <Label for="password">New password</Label>
                            <Input id="password" type="password" name="password" placeholder="New password" required
                                v-model="password" />
                            <Label for="repeatPassword">Retype password</Label>
                            <Input id="repeatPassword" type="password" name="repeatPassword" placeholder="New password" required
                                v-model="repeatPassword" />
                        </div>
                        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
                        <Button type="submit" class="w-full" :disabled="isLoading">
                            {{ isLoading ? "Saving..." : "Save new password" }}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
</template>