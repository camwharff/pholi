<script setup lang="ts">

import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
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
import Button from '@/components/ui/button/Button.vue'
import { Spinner }  from '@/components/ui/spinner'
import { Clapperboard, Music, Image } from 'lucide-vue-next'

const { disableUpload, disableSave, newMedia, deleteMedia, onDragFiller, addCover, unplacedItems, stagedItems, uploadMedia, onDragUnstaged, updatePholi, selectMedia } = mediaHandler()

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
                <div
                    class="max-h-[65vh] overflow-y-auto w-inherit bg-accent rounded-3xl shadow-md text-white text-sm p-4 z-10">
                    <form @submit.prevent="uploadMedia" class="w-full flex flex-col gap-4 text-sm" name="uploadForm">
                        <Accordion type="single" collapsible class="w-full">
                            <AccordionItem v-for="media in newMedia" :value="media.file.name" :key="media.file.name">
                                <AccordionTrigger class="w-full overflow-hidden">
                                    <div class="flex items-center gap-2 w-full min-w-0">
                                        <Music v-if="media.type === 'audio'" class="shrink-0" />
                                        <Image v-if="media.type === 'image'" class="shrink-0" />
                                        <Clapperboard v-if="media.type === 'video'" class="shrink-0" />
                                        <div class="w-0 flex-1 min-w-0">
                                            <p class="truncate">
                                                {{ media.file.name }}
                                            </p>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent class="flex flex-col gap-4 w-full">
                                    <div class="w-full object-cover">
                                        <img v-if="media.type === 'image'" :src="media.url"
                                            class="aspect-square object-cover" />
                                        <video v-if="media.type === 'video'" controls
                                            class="aspect-square object-cover">
                                            <source :src="media.url" />
                                        </video>
                                        <img v-if="media.cover" :src="getUrl(media.cover)"
                                            class="aspect-square object-cover" />
                                        <audio v-if="media.type === 'audio'" controls class="w-full">
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
                                            <Input class="w-2/3" v-model="media.description" />
                                        </Label>
                                        <Label v-if="media.type === 'audio'" class="flex flex-row justify-between">
                                            <p>Cover</p>
                                            <Input class="w-2/3" type="file" accept="image/*"
                                                @change.prevent="media.cover = addCover($event)" />
                                        </Label>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <Input class="bg-white w-full text-black" type="file" multiple
                            accept="image/*, audio/*, video/*" @change.prevent="selectMedia" />
                        <Button :disabled="disableUpload" type="submit"
                            class="rounded-lg text-white p-2 w-fit bg-secondary hover:bg-primary">
                            <Spinner v-if="disableUpload" />
                            {{ disableUpload ? 'uploading...' : 'Upload' }}
                        </Button>
                    </form>
                </div>
            </TabsContent>
            <TabsContent value="all" class="w-full">
                <div
                    class="grid grid-cols-2 auto-rows-max gap-4 w-inherit items-center bg-accent max-h-[65vh] h-fit rounded-3xl shadow-md text-white text-sm p-4 overflow-y-scroll">
                    <div draggable="true" @dragstart="onDragFiller()"
                        class="cursor-move border-secondary bg-secondary border-4 text-white aspect-square rounded-3xl overflow-hidden w-full h-full">
                    </div>
                    <div v-for="item in unplacedItems" :key="item.id" draggable="true" @dragstart="onDragUnstaged(item)"
                        class="cursor-move border-secondary border-4 text-white aspect-square rounded-3xl overflow-hidden">
                        <ContextMenu>
                            <ContextMenuTrigger>
                                <img class="aspect-square object-cover border-0 w-full h-full"
                                    v-if="item.type === 'image'" :src="item.url" />
                                <div v-if="item.type === 'video'" class="relative h-full w-full aspect-square">
                                    <video class="aspect-square object-cover border-0 w-full h-full">
                                        <source :src="item.url" />
                                    </video>
                                    <div class="absolute inset-0 flex items-center justify-center bg-white/30">
                                        <Clapperboard class="h-3/4 w-3/4" />
                                    </div>
                                </div>
                                <div v-if="item.type === 'audio'" class="relative h-full w-full aspect-square">
                                    <img :src="item.coverUrl" class="absolute inset-0 h-full w-full object-cover" />
                                    <div class="absolute inset-0 flex items-center justify-center bg-white/30">
                                        <Music class="h-3/4 w-3/4" />
                                    </div>
                                </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuItem @click.prevent="deleteMedia(item.id)" inset>
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
                    class="grid grid-cols-2 gap-4 max-h-[65vh] h-fit auto-rows-max w-inherit items-center bg-accent rounded-3xl shadow-md text-white text-sm p-4 z-10 overflow-y-scroll">
                    <div v-for="item in stagedItems" :key="item.id"
                        class="cursor-move border-secondary border-4 text-white aspect-square rounded-3xl overflow-hidden">
                        <img :src="item.url" :alt="item.label" class="object-cover border-0 w-full h-full" />
                    </div>
                </div>
            </TabsContent>
        </Tabs>
        <form @submit.prevent="updatePholi">
            <div class="flex flex-row justify-center">
                <Button :disabled="disableSave" type="submit"
                    class="rounded-lg text-white p-2 w-fit bg-secondary hover:bg-primary">
                    <Spinner v-if="disableSave" />
                    {{ disableSave ? 'saving...' : 'Save Pholi' }}
                </Button>
            </div>
        </form>
    </div>
</template>
