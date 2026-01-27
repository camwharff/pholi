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
import { onMounted } from 'vue'
const props = defineProps<{
    src: string
    type: string
    alt: string
    label?: string
    description?: string
    cover?: string
}>()
onMounted(() => {
    if (props.src)
        console.log(props.src)
})
</script>

<template>
    <Dialog class="w-full h-full">
        <DialogTrigger class="w-full h-full p-2">
            <div class="w-full h-full relative">
                <div class="w-full h-full bg-linear-to-t from-sky-800 to-sky-600 animate-pulse absolute z-10 rounded-3xl"></div>
                <Image v-if="type === 'image'" :src="src ?? ''" :alt="src"
                    class="text-transparent animate-none cursor-help w-full h-full border-secondary rounded-3xl border-4 object-cover absolute z-20" />
                <video v-if="type === 'video'" :src="src ?? ''" :alt="src"
                    class="cursor-help w-full h-full border-secondary rounded-3xl border-4 object-cover absolute z-20"
                    controls></video>
                <Image v-if="type === 'audio'" :src="src ?? ''" :alt="src"
                    class="cursor-help w-full h-3/4 border-secondary rounded-3xl border-4 absolute z-20" />
                <audio v-if="type === 'audio'" :src="src ?? ''" :alt="src" class="cursor-help w-full h-full absolute z-20"
                    controls></audio>
                <div v-if="type === 'text'">
                    <p>{{ label }}</p>
                    <p>{{ description }}</p>
                </div>
            </div>
        </DialogTrigger>
        <DialogContent class="h-screen w-screen">
            <VisuallyHidden asChild>
                <DialogTitle :value="label" />
                <DialogDescription :value="label" />
            </VisuallyHidden>
            <div class="h-full w-fit flex flex-row gap-4">
                <Card v-if="(label || description) && type !== 'text'"
                    class="bg-accent border-4 border-secondary p-4 rounded-3xl h-fit max-w-[20vw] flex flex-col gap-4">
                    <p v-if="label" class="w-full text-4xl font-bold">{{ label }}</p>
                    <p v-if="description" class="w-full text-xl ">{{ description }}</p>
                </Card>
                <div class="flex-1 h-3/4">
                    <Image v-if="type === 'image'" :src="src ?? ''" :alt="src ?? ''"
                        class="h-full border-secondary bg-accent rounded-3xl border-4 w-full" />
                    <video v-if="type === 'video'" :src="src ?? ''" :alt="src ?? ''"
                        class="w-full h-full border-secondary bg-accent rounded-3xl border-4" controls></video>
                    <Image v-if="type === 'audio'" :src="src ?? ''" :alt="src ?? ''"
                        class="w-full h-3/4 border-secondary bg-accent rounded-3xl border-4" />
                    <audio v-if="type === 'audio'" :src="src ?? ''" :alt="src ?? ''" class="w-full h-full bg-accent"
                        controls></audio>
                    <div v-if="type === 'text'">
                        <p>{{ label }}</p>
                        <p>{{ description }}</p>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>