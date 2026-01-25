<script setup lang="ts">
import { mediaHandler, type GridMatrix } from '@/lib/mediaHandler'
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
import Aud from '@/components/media/Aud.vue'
import Vid from '@/components/media/Vid.vue'
import Image from '@/components/media/Imag.vue'
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProfilesStore } from '@/stores/profiles'

const { widthConfig, heightConfig, viewMedia, getSrc } = mediaHandler()
const route = useRoute()
const profilesStore = useProfilesStore()
const pholi = ref<GridMatrix>()

onMounted(async () => {
    const username = route.params.username as string
    await profilesStore.fetchProfile(username)
    await profilesStore.loadFromCache(username)

    pholi.value = computed(() => profilesStore.profiles[username]?.pholi ?? []).value
    for (const row of pholi.value) {
        for (const cell of row) {
            if (cell && cell.kind === 'media') {
                const source = await getSrc(cell.id)
                cell.url = source ?? ''
            }
        }
    }
})

</script>

<template>
    <div class="grid grid-cols-16 rounded-3xl bg-accent border-accent border-4 p-2">
        <template v-for="(row, rowIndex) in pholi" :key="rowIndex">
            <div v-for="(cell, colIndex) in row" :key="`${rowIndex}-${colIndex}`"
                class="relative overflow-visible aspect-square rounded-lg m-0">
                <div v-if="cell && cell.kind === 'media'" :class="[
                    widthConfig[cell.width],
                    heightConfig[cell.height],
                    'absolute top-0 left-0 flex items-center justify-center text-xs text-white overflow-hidden'
                ]" @mouseover="viewMedia(cell, true)" @mouseleave="viewMedia(cell, false)">
                    <div class="w-full h-full p-2">
                        <Dialog class="w-full h-full">
                            <DialogTrigger class="w-full h-full cursor-help">
                                <Image v-if="cell.type === 'image'" :src="cell.url ?? ''" :alt="cell.label"
                                    class="object-cover w-full h-full border-4 border-secondary bg-secondary rounded-3xl" />
                                <Vid v-if="cell.type === 'video'" :src="cell.url ?? ''" :alt="cell.label"
                                    class="object-cover w-full h-full border-4 border-secondary bg-secondary rounded-3xl" />
                                <Aud v-if="cell.type === 'audio'" :src="cell.url ?? ''" :alt="cell.label"
                                    :cover="cell.coverUrl"
                                    class="object-cover w-full h-full border-4 border-secondary bg-secondary rounded-3xl" />
                            </DialogTrigger>
                            <DialogContent class="w-auto h-auto p-4 shadow-none" :aria-describedby="undefined">
                                <VisuallyHidden asChild>
                                    <DialogTitle :value="cell.label" />
                                </VisuallyHidden>
                                <div class="object-contain w-fit h-[75vh] overflow-hidden flex justify-center">
                                    <Card
                                        class="mx-4 bg-accent border-secondary border-4 rounded-3xl h-fit w-[15vw] text-white">
                                        <CardHeader>
                                            <h1 class="m-0">{{ cell.label }}</h1>
                                        </CardHeader>
                                        <div v-if="cell.description">
                                            <CardContent>
                                                <h3>{{ cell.description }}</h3>
                                            </CardContent>
                                        </div>
                                    </Card>
                                    <Image v-if="cell.type === 'image'" :src="cell.url ?? ''" :alt="cell.label"
                                        class="w-fit h-full border-secondary bg-accent rounded-3xl border-4" />
                                    <Vid v-if="cell.type === 'video'" :src="cell.url ?? ''" :alt="cell.label"
                                        class="w-fit h-full border-secondary bg-accent rounded-3xl border-4" />
                                    <Aud v-if="cell.type === 'audio'" :src="cell.url ?? ''" :alt="cell.label"
                                        :cover="cell.coverUrl"
                                        class="w-fit h-full border-secondary bg-accent rounded-3xl border-4" />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div v-if="cell && cell.kind === 'text'" :class="[
                    widthConfig[cell.width],
                    heightConfig[cell.height],
                    'absolute top-0 left-0 flex items-center justify-center text-xs text-white overflow-hidden'
                ]" @mouseover="viewMedia(cell, true)" @mouseleave="viewMedia(cell, false)">
                    <div class="w-full h-full p-2">
                        <Dialog class="w-full h-full">
                            <DialogTrigger class="w-full h-full cursor-help">
                                <p>{{ cell.description }}</p>
                            </DialogTrigger>
                            <DialogContent class="w-auto h-auto p-4 shadow-none" :aria-describedby="undefined">
                                <VisuallyHidden asChild>
                                    <DialogTitle :value="cell.label" />
                                </VisuallyHidden>
                                <div class="object-contain w-fit h-[75vh] overflow-hidden flex justify-center">
                                    <Card
                                        class="mx-4 bg-accent border-secondary border-4 rounded-3xl h-fit w-[15vw] text-white">
                                        <CardHeader>
                                            <h1 class="m-0">{{ cell.label }}</h1>
                                        </CardHeader>
                                    </Card>
                                    {{ cell.description }}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>