<script setup lang="ts">
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem
} from '@/components/ui/context-menu'
import { mediaHandler, type SizeCell, type GridMatrix, type TextCell, nullPholi } from '@/lib/mediaHandler'
import { onMounted, ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import MediaDisplay from '@/components/media/MediaDisplay.vue'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

const { pholi, onDrop, onDragStaged, onDragSize, widthConfig, heightConfig, removeItem, getSrc } = mediaHandler()

const userStore = useUserStore()
const pholi_local = ref<GridMatrix>()

onMounted(async () => {
    await userStore.loadFromCache()

    pholi_local.value = computed(() => userStore.info?.pholi ?? []).value
    if (pholi_local.value) {
        for (const row of pholi_local.value) {
            for (const cell of row) {
                if (cell && cell.kind === 'media') {
                    const source = await getSrc(cell.id)
                    cell.url = source ?? ''
                }
            }
        }
    }
    pholi.value = pholi_local.value ?? nullPholi
})

</script>

<template>
    <div class="grid grid-cols-16 rounded-3xl bg-accent border-accent border-4 p-2">
        <template v-for="(row, rowIndex) in pholi_local" :key="rowIndex">
            <div v-for="(cell, colIndex) in row" :key="`${rowIndex}-${colIndex}`"
                class="relative overflow-visible aspect-square outline-1 outline-white/30 outline-dashed m-0"
                @dragover.prevent @drop="onDrop(rowIndex, colIndex)">
                <div v-if="cell && (cell.kind === 'media' || cell.kind === 'filler' || cell.kind === 'text')" :class="[
                    widthConfig[cell.width],
                    heightConfig[cell.height],
                    'absolute top-0 left-0 flex items-center justify-center text-xs text-white overflow-hidden text-center'
                ]">
                    <ContextMenu class="w-full h-full">
                        <ContextMenuTrigger class="w-full h-full p-2 rounded-3xl">
                            <div draggable="true" @dragstart="onDragStaged(cell)"
                                class="absolute top-0 left-0 w-8 h-8 items-start justify-start cursor-move flex">
                            </div>
                            <MediaDisplay :src="cell.url ?? ''" :type="cell.type ?? ''" :alt="cell.id ?? ''"
                                :cover="cell.coverUrl" :label="cell.label" :description="cell.description"
                                class="w-full h-full rounded-3xl" />
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem @click="removeItem(cell.id)">
                                Remove
                            </ContextMenuItem>
                            <ContextMenuItem @click="editCellInfo(cell.id)">
                                Edit Item Info
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                </div>
                <div v-if="cell && cell.id && cell.id.startsWith('size-')" draggable="true"
                    @dragstart="onDragSize(cell as SizeCell)"
                    class='absolute bottom-0 right-0 w-8 h-8 flex items-end justify-end text-xs cursor-nwse-resize text-white overflow-hidden'>
                </div>
            </div>
        </template>
    </div>

</template>