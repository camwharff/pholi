<script setup lang="ts">

import Input from '@/components/ui/input/Input.vue'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import { mediaHandler } from '@/lib/mediaHandler'
import Button from '../ui/button/Button.vue';

const { src, title, description, unplacedItems, stagedItems, preview, uploadMedia, onDragUnstaged, onDragFiller, updatePholi } = mediaHandler()

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
                <div class="flex w-inherit items-center bg-primary rounded-3xl shadow-md text-white text-sm p-8 z-10">
                    <form @submit.prevent="uploadMedia" class="w-full flex flex-col justify-around gap-4 text-sm"
                        name="addForm">

                        <img v-if="src" :src="src" alt="Avatar"
                            class="w-full h-full avatar image rounded-3xl border-secondary border-5 object-cover" />
                        <Input class="bg-white w-full text-black" type="file" id="single" accept="image/*"
                            @change="preview" />
                        <div>
                            <label for="title">Title</label>
                            <Input id="title" type="text" v-model="title" required />
                        </div>
                        <div>
                            <label for="description">Description</label>
                            <Input id="description" type="text" v-model="description" />
                        </div>
                        <input type="submit" class="button rounded-md text-white block max-w-fit p-2 bg-secondary"
                            value="Submit" />
                    </form>
                </div>
            </TabsContent>

            <TabsContent value="all" class="w-full">
                <div
                    class="grid grid-cols-2 auto-rows-max gap-4 w-inherit items-center bg-primary h-[65vh] rounded-3xl shadow-md text-white text-sm p-4 overflow-y-scroll">
                    <div draggable="true" @dragstart="onDragFiller()"
                        class="cursor-move border-secondary bg-secondary border-4 text-white aspect-square rounded-3xl overflow-hidden w-full h-full">
                    </div>
                    <div v-for="item in unplacedItems" :key="item.id" draggable="true" @dragstart="onDragUnstaged(item)"
                        class="cursor-move border-secondary border-4 text-white aspect-square rounded-3xl overflow-hidden">
                        <img :src="item.src" :alt="item.label" class="object-cover border-0 w-full h-full" />
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="staged" class="w-full">
                <div v-if="stagedItems.length == 0"
                    class="bg-primary rounded-3xl shadow-md text-white text-md text-center p-4">
                    Empty!
                </div>
                <div v-else
                    class="grid grid-cols-2 gap-4 h-[65vh] auto-rows-max w-inherit items-center bg-primary rounded-3xl shadow-md text-white text-sm p-4 z-10 overflow-y-scroll">
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
