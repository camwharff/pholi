<script setup lang="ts">
import MediaDialog from '@/components/blocks/shared/MediaDialog.vue'
import type { GridMatrix, SizeType } from '@/lib/types'
import { widthConfig, heightConfig } from '@/lib/configs'
import { pholiHelpers } from '@/lib/pholiHelpers'

const { viewMedia } = pholiHelpers()

const props = defineProps<{
    pholi: GridMatrix
}>()

</script>

<template>
    <div class="grid grid-cols-16 rounded-3xl bg-accent border-accent border-4 p-2">
        <template v-for="(row, rowIndex) in pholi" :key="rowIndex">
            <div v-for="(cell, colIndex) in row" :key="`${rowIndex}-${colIndex}`"
                class="relative overflow-visible aspect-square rounded-lg m-0">
                <div v-if="cell && (cell.kind === 'media' || cell.kind === 'text' || cell.kind === 'filler')" :class="[
                    widthConfig[cell.width as SizeType],
                    heightConfig[cell.height as SizeType],
                    'absolute top-0 left-0 flex items-center justify-center text-xs text-white overflow-hidden'
                ]" @mouseover="viewMedia(cell, true)" @mouseleave="viewMedia(cell, false)">
                    <div class="w-full h-full">
                        <MediaDialog :src="cell.url ?? ''" :type="cell.type ?? ''" :alt="cell.id ?? ''"
                            :label="cell.label" :description="cell.description" />
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>