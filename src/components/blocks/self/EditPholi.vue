<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import MediaDisplay from '@/components/media/MediaDisplay.vue'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import type { GridMatrix, SizeCell } from '@/lib/types'
import { widthConfig, heightConfig } from '@/lib/configs'
import { pholiHelpers } from '@/lib/pholiHelpers'
// import VuePictureCropper, { cropper } from 'vue-picture-cropper'

const userStore = useUserStore()
const { onDragStaged, onDragSize, removeItem, onDrop } = pholiHelpers()
const pholi = computed<GridMatrix>(() => userStore.info?.pholi ?? [])

onMounted(async () => {
    await userStore.loadFromCache()
})

</script>

<template>
    <div class="grid grid-cols-16 rounded-3xl bg-accent border-accent border-4 p-2">
        <template v-for="(row, rowIndex) in pholi" :key="rowIndex">
            <div v-for="(cell, colIndex) in row" :key="`${rowIndex}-${colIndex}`"
                class="relative overflow-visible aspect-square outline-1 outline-white/30 outline-dashed m-0"
                @dragover.prevent @drop="onDrop(rowIndex, colIndex, pholi)">
                <div v-if="cell && (cell.kind === 'media' || cell.kind === 'filler' || cell.kind === 'text')" :class="[
                    widthConfig[cell.width],
                    heightConfig[cell.height],
                    'absolute top-0 left-0 flex items-center justify-center text-xs text-white overflow-hidden text-center'
                ]">
                    <Popover class="w-full h-full">
                        <PopoverTrigger class="w-full h-full p-2 rounded-3xl">
                            <div draggable="true" @dragstart="onDragStaged(cell)"
                                class="absolute top-0 left-0 w-8 h-8 items-start justify-start cursor-move flex">
                            </div>
                            <MediaDisplay :src="cell.url ?? ''" :type="cell.type ?? ''" :alt="cell.id ?? ''"
                                :cover="cell.coverUrl" :label="cell.label" :description="cell.description"
                                class="w-full h-full rounded-3xl" />
                            <!-- <VuePictureCropper :boxStyle="{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#f8f8f8',
                                margin: 'auto',
                            }" :img="pic" :options="{
                                viewMode: 1,
                                dragMode: 'crop',
                                aspectRatio: 16 / 9,
                            }" @ready="ready" /> -->
                        </PopoverTrigger>
                        <PopoverContent class="flex flex-col bg-secondary gap-2 text-white">
                            <Label :for="`label-${cell.id}`">Title</Label>
                            <Textarea :id="`label-${cell.id}`" v-model="cell.label" class="h-fit border-none bg-accent"
                                rows="1" />
                            <Label :for="`description-${cell.id}`">Description</Label>
                            <Textarea :id="`description-${cell.id}`" v-model="cell.description"
                                class="h-fit border-none bg-accent" rows="4" />
                            <Button @click="removeItem(cell.id, pholi)">
                                Remove from Pholi
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>
                <div v-if="cell && cell.id && cell.id.startsWith('size-')" draggable="true"
                    @dragstart="onDragSize(cell as SizeCell, pholi)"
                    class='absolute bottom-0 right-0 w-8 h-8 flex items-end justify-end text-xs cursor-nwse-resize text-white overflow-hidden'>
                </div>
            </div>
        </template>
    </div>

</template>