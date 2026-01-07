<script setup lang="ts">
import { mediaHandler, type SizeType, type GridItem } from '@/lib/mediaHandler'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import {
    Card,
    CardContent,
    CardHeader
} from '@/components/ui/card'
import { VisuallyHidden } from 'reka-ui'

const { pholi, widthConfig, heightConfig, getSrc } = mediaHandler()

</script>

<template>
    <div class="grid grid-cols-16 rounded-3xl bg-accent border-accent border-4 p-2">
        <template v-for="(row, rowIndex) in pholi" :key="rowIndex">
            <div v-for="(cell, colIndex) in row" :key="`${rowIndex}-${colIndex}`"
                class="relative overflow-visible aspect-square rounded-lg m-0">
                <div v-if="cell && 'id' in cell && cell.id !== 'block' && !cell.id.startsWith('size-')" :class="[
                    widthConfig[(cell as GridItem).width as SizeType],
                    heightConfig[(cell as GridItem).height as SizeType],
                    'absolute top-0 left-0 flex items-center justify-center text-xs text-white overflow-hidden'
                ]">
                    <div class="w-full h-full p-2">
                        <Dialog class="w-full h-full">
                            <DialogTrigger class="w-full h-full cursor-help">
                                <img :src="getSrc((cell as GridItem).id)" :alt="(cell as GridItem).label"
                                    class="object-cover w-full h-full border-4 border-secondary bg-secondary rounded-3xl" />
                            </DialogTrigger>
                            <DialogContent class="w-auto h-auto p-8 shadow-none" :aria-describedby="undefined">
                                <VisuallyHidden asChild>
                                    <DialogTitle :value="(cell as GridItem).label" />
                                </VisuallyHidden>
                                <div class="object-contain w-max h-[75vh] overflow-hidden flex justify-center">
                                    <Card
                                        class="mx-4 bg-accent border-secondary border-4 rounded-3xl h-fit w-[15vw] text-white">
                                        <CardHeader>
                                            <h1 class="m-0">{{ (cell as GridItem).label }}</h1>
                                        </CardHeader>
                                        <div v-if="(cell as GridItem).description">
                                            <CardContent>
                                                <h3>{{ (cell as GridItem).description }}</h3>
                                            </CardContent>
                                        </div>
                                    </Card>
                                    <img :src="getSrc((cell as GridItem).id)" :alt="(cell as GridItem).label"
                                        class="w-fit h-full border-secondary bg-accent rounded-3xl border-4" />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
