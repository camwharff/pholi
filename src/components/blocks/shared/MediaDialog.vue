<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from '@/components/ui/dialog'
import Image from '@/components/media/Imag.vue'
import Card from '@/components/ui/card/Card.vue'
import { VisuallyHidden } from 'reka-ui'
defineProps<{ src: string; type: string; alt: string; label?: string; description?: string; cover?: string }>()
</script>

<template>
    <Dialog class="w-full h-full">
        <DialogTrigger class="w-full h-full">
            <Image v-if="type === 'image'" :src="src ?? ''" :alt="label"
                class="cursor-help w-full h-full border-secondary bg-accent rounded-3xl border-4 object-cover" />
            <video v-if="type === 'video'" :src="src ?? ''" :alt="label"
                class="cursor-help w-full h-full border-secondary bg-accent rounded-3xl border-4 object-cover"
                controls></video>
            <Image v-if="type === 'audio'" :src="src ?? ''" :alt="label"
                class="cursor-help w-full h-3/4 border-secondary bg-accent rounded-3xl border-4" />
            <audio v-if="type === 'audio'" :src="src ?? ''" :alt="label" class="cursor-help w-full h-full bg-accent"
                controls></audio>
        </DialogTrigger>
        <DialogContent class="h-screen w-screen">
            <VisuallyHidden asChild>
                <DialogTitle :value="label" />
                <DialogDescription :value="label" />
            </VisuallyHidden>
            <div class="h-full w-fit flex flex-row gap-4">
                <Card v-if="label || description"
                    class="bg-accent border-4 border-secondary p-4 rounded-3xl h-fit max-w-[20vw] flex flex-col gap-4">
                    <p v-if="label" class="w-full text-4xl font-bold">{{ label }}</p>
                    <p v-if="description" class="w-full text-xl ">{{ description }}</p>
                </Card>
                <div class="flex-1 h-3/4">
                    <Image v-if="type === 'image'" :src="src ?? ''" :alt="label ?? ''"
                        class="h-full border-secondary bg-accent rounded-3xl border-4 w-full" />
                    <video v-if="type === 'video'" :src="src ?? ''" :alt="label ?? ''"
                        class="w-full h-full border-secondary bg-accent rounded-3xl border-4" controls></video>
                    <Image v-if="type === 'audio'" :src="src ?? ''" :alt="label ?? ''"
                        class="w-full h-3/4 border-secondary bg-accent rounded-3xl border-4" />
                    <audio v-if="type === 'audio'" :src="src ?? ''" :alt="label ?? ''" class="w-full h-full bg-accent"
                        controls></audio>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>