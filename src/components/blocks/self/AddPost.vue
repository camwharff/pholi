<script setup lang="ts">

import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import { postHandler } from '@/lib/postHandler'
import Button from '@/components/ui/button/Button.vue'
import { Spinner } from '@/components/ui/spinner'
import { Clapperboard, Music, Image } from 'lucide-vue-next'

const { disablePost, newPost, addPost, selectPost } = postHandler()

</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="max-h-[65vh] overflow-y-auto w-inherit bg-accent rounded-3xl shadow-md text-white text-sm p-4 z-10">
            <form @submit.prevent="addPost" class="w-full flex flex-col gap-4 text-sm" name="uploadForm">
                <div class="flex items-center gap-2 w-full min-w-0">
                    <Music v-if="newPost?.type === 'audio'" class="shrink-0" />
                    <Image v-if="newPost?.type === 'image'" class="shrink-0" />
                    <Clapperboard v-if="newPost?.type === 'video'" class="shrink-0" />
                    <div class="w-0 flex-1 min-w-0">
                        <p class="truncate">
                            {{ newPost?.file.name }}
                        </p>
                    </div>
                </div>
                <div class="w-full object-cover">
                    <img v-if="newPost?.type === 'image'" :src="newPost?.url" class="aspect-square object-cover" />
                    <video v-if="newPost?.type === 'video'" controls class="aspect-square object-cover">
                        <source :src="newPost?.url" />
                    </video>
                    <audio v-if="newPost?.type === 'audio'" controls class="w-full">
                        <source :src="newPost?.url" />
                    </audio>
                </div>
                <div v-if="newPost" class="w-full flex flex-col gap-1">
                    <Label class="flex flex-row justify-between">
                        <p>Title</p>
                        <Input class="w-2/3" v-model="newPost.title" />
                    </Label>
                    <Label class="flex flex-row justify-between">
                        <p>Caption</p>
                        <Input class="w-2/3" v-model="newPost.caption" />
                    </Label>
                </div>
                <Input class="bg-white w-full text-black" type="file" accept="image/*, audio/*, video/*"
                    @change.prevent="selectPost" v-if="!newPost" />
                <Button :disabled="disablePost" type="submit"
                    class="rounded-lg text-white p-2 w-fit bg-secondary hover:bg-primary">
                    <Spinner v-if="disablePost" />
                    {{ disablePost ? 'uploading...' : 'Post' }}
                </Button>
            </form>
        </div>
    </div>
</template>