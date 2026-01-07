<script setup lang="ts">
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem
} from '@/components/ui/context-menu'
import { mediaHandler, type SizeType, type GridItem, type SizeCell } from '@/lib/mediaHandler'

const { pholi, onDrop, onDragStaged, onDragSize, widthConfig, heightConfig, getSrc, removeItem } = mediaHandler()

</script>

<template>
    <div class="grid grid-cols-16 rounded-3xl bg-accent border-accent border-4 p-2">
        <template v-for="(row, rowIndex) in pholi" :key="rowIndex">
            <div v-for="(cell, colIndex) in row" :key="`${rowIndex}-${colIndex}`"
                class="relative overflow-visible aspect-square outline-1 outline-white/30 outline-dashed m-0"
                @dragover.prevent @drop="onDrop(rowIndex, colIndex)">
                <div v-if="cell && 'id' in cell && cell.id !== 'block' && !cell.id.startsWith('size-')" :class="[
                    widthConfig[(cell as GridItem).width as SizeType],
                    heightConfig[(cell as GridItem).height as SizeType],
                    'absolute top-0 left-0 flex items-center justify-center text-xs text-white overflow-hidden'
                ]">
                    <div draggable="true" @dragstart="onDragStaged(cell as GridItem)"
                        class="absolute top-0 left-0 w-8 h-8 items-start justify-start cursor-move flex">
                    </div>
                    <ContextMenu class="w-full h-full">
                        <ContextMenuTrigger class="w-full h-full p-2 rounded-3xl">
                            <img :src="getSrc((cell as GridItem).id)" :alt="(cell as GridItem).label"
                                class="object-cover w-full h-full border-4 border-secondary bg-secondary rounded-3xl" />
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem @click="removeItem(cell.id)" inset>
                                Remove
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                </div>
                <div v-if="cell && 'id' in cell && cell.id.startsWith('size-')" draggable="true"
                    @dragstart="onDragSize(cell as SizeCell)"
                    class='absolute bottom-0 right-0 w-8 h-8 flex items-end justify-end text-xs cursor-nwse-resize text-white overflow-hidden'>
                </div>
            </div>
        </template>
    </div>
</template>