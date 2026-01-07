<script setup lang="ts">

import Input from '@/components/ui/input/Input.vue'
import Label from '../ui/label/Label.vue'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem
} from '@/components/ui/context-menu'
import { mediaHandler } from '@/lib/mediaHandler'
import Button from '../ui/button/Button.vue'
import { Clapperboard, Music, Image } from 'lucide-vue-next'

const { newMedia, deleteMedia, addCover, unplacedItems, stagedItems, uploadMedia, onDragUnstaged, onDragFiller, updatePholi, selectMedia } = mediaHandler()

function getUrl(file: File) {
    return URL.createObjectURL(file)
}

</script>

<template>
    <div class="flex flex-col gap-4">
        <Tabs class="flex-col flex w-full gap-4 items-center" default-value="all">
            <TabsList>
                <TabsTrigger value="upload">
                    Add
                </TabsTrigger>
                <TabsTrigger value="all">
                    Unstaged
                </TabsTrigger>
                <TabsTrigger value="staged">
                    Staged
                </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" class="w-full">
                <div class="flex w-inherit items-center bg-accent rounded-3xl shadow-md text-white text-sm p-8 z-10">
                    <form @submit.prevent="uploadMedia" class="w-full flex flex-col justify-around gap-4 text-sm"
                        name="addForm">
                        <Accordion type="single">
                            <AccordionItem v-for="media in newMedia" :value="media.file.name" :key="media.file.name">
                                <AccordionTrigger class="flex flex-row justify-start">
                                    <Music v-if="media.type === 'audio'" />
                                    <Image v-if="media.type === 'image'" />
                                    <Clapperboard v-if="media.type === 'video'" />
                                    <p>{{ media.file.name }}</p>
                                </AccordionTrigger>
                                <AccordionContent class="flex flex-col gap-4 w-full">
                                    <div class="w-full object-cover">
                                        <img class="aspect-square object-cover" v-if="media.type === 'image'"
                                            :src="media.url" />
                                        <video controls v-if="media.type === 'video'">
                                            <source :src="media.url" />
                                        </video>
                                        <img class="aspect-square object-cover" v-if="media.cover"
                                            :src="getUrl(media.cover)" />
                                        <audio controls v-if="media.type === 'audio'" class="w-full">
                                            <source :src="media.url" />
                                        </audio>
                                    </div>
                                    <div class="w-full flex flex-col gap-1">
                                        <Label class="flex flex-row justify-between">
                                            <p>Title</p>
                                            <Input class="w-2/3" v-model="media.title" type="text" />
                                        </Label>
                                        <Label class="flex flex-row justify-between">
                                            <p>Date</p>
                                            <Input class="w-2/3" v-model="media.date" type="date" />
                                        </Label>
                                        <Label class="flex flex-row justify-between">
                                            <p>Description</p>
                                            <Input class="w-2/3" v-model="media.description" type="description" />
                                        </Label>
                                        <Label v-if="media.type === 'audio'" class="flex flex-row justify-between">
                                            <p>Cover</p>
                                            <Input class="w-2/3" @change.prevent="media.cover = addCover($event)"
                                                type="file" accept="image/*" />
                                        </Label>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <Input class="bg-white w-full text-black" type="file" multiple
                            accept="image/*, audio/*, video/*" @change.prevent="selectMedia" />
                        <Button type="submit" class=" rounded-lg text-white block p-2 w-fit bg-primary">Upload</Button>
                    </form>
                </div>
            </TabsContent>

            <TabsContent value="all" class="w-full">
                <div
                    class="grid grid-cols-2 auto-rows-max gap-4 w-inherit items-center bg-accent h-[65vh] rounded-3xl shadow-md text-white text-sm p-4 overflow-y-scroll">
                    <div draggable="true" @dragstart="onDragFiller()"
                        class="cursor-move border-secondary bg-secondary border-4 text-white aspect-square rounded-3xl overflow-hidden w-full h-full">
                    </div>
                    <div v-for="item in unplacedItems" :key="item.id" draggable="true" @dragstart="onDragUnstaged(item)"
                        class="cursor-move border-secondary border-4 text-white aspect-square rounded-3xl overflow-hidden">
                        <ContextMenu>
                            <ContextMenuTrigger>
                                <img class="aspect-square object-cover border-0 w-full h-full"
                                    v-if="item.type === 'image'" :src="item.src" />
                                <video class="aspect-square object-cover border-0 w-full h-full" controls
                                    v-if="item.type === 'video'">
                                    <source :src="item.src" />
                                </video>
                                <div v-if="item.type === 'audio'" class="h-full w-full">
                                    <img class="aspect-square object-cover border-0 w-auto h-auto relative m-auto inset-0 opacity-50" :src="item.cover" />
                                    <Music class="aspect-square object-cover border-0 w-auto h-auto relative m-auto inset-0" />
                                </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuItem @click="deleteMedia(item.id)" inset>
                                    Delete
                                </ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="staged" class="w-full">
                <div v-if="stagedItems.length == 0"
                    class="bg-accent rounded-3xl shadow-md text-white text-md text-center p-4">
                    Empty!
                </div>
                <div v-else
                    class="grid grid-cols-2 gap-4 h-[65vh] auto-rows-max w-inherit items-center bg-accent rounded-3xl shadow-md text-white text-sm p-4 z-10 overflow-y-scroll">
                    <div v-for="item in stagedItems" :key="item.id"
                        class="cursor-move border-secondary border-4 text-white aspect-square rounded-3xl overflow-hidden">
                        <img :src="item.src" :alt="item.label" class="object-cover border-0 w-full h-full" />
                    </div>
                </div>
            </TabsContent>
        </Tabs>
        <form @submit.prevent="updatePholi">
            <div class="flex flex-row justify-center">
                <Button type="submit">
                    Save Pholi
                </Button>
            </div>
        </form>
    </div>
</template>
