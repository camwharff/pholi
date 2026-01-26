<script setup lang="ts">
import { mediaHandler, type GridMatrix } from '@/lib/mediaHandler'
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProfilesStore } from '@/stores/profiles'
import MediaDialog from '@/components/blocks/shared/MediaDialog.vue'

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
                        <MediaDialog :src="cell.url ?? ''" :type="cell.type ?? ''" :alt="cell.id ?? ''"
                            :label="cell.label" :description="cell.description" />
                    </div>
                </div>
                <div v-if="cell && cell.kind === 'text'" :class="[
                    widthConfig[cell.width],
                    heightConfig[cell.height],
                    'absolute top-0 left-0 flex items-center justify-center text-xs text-white overflow-hidden'
                ]" @mouseover="viewMedia(cell, true)" @mouseleave="viewMedia(cell, false)">
                    <div class="w-full h-full p-2">
                        <MediaDialog :src="cell.url ?? ''" :type="'text'" :alt="cell.id ?? ''" :label="cell.label"
                            :description="cell.description" />
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>