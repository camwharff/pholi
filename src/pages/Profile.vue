<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProfilesStore } from '@/stores/profiles'

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs'
import ProfileFeed from '@/components/blocks/others/ProfileFeed.vue'
import ProfileInfoDisplay from '@/components/blocks/others/ProfileInfoDisplay.vue'
import ProfileMedia from '@/components/blocks/others/ProfileMedia.vue'

const route = useRoute()

const username = computed(() => route.params.username as string)
const profilesStore = useProfilesStore()


onMounted(async () => {
    await profilesStore.loadFromCache(username.value)
    await profilesStore.fetchProfile(username.value)
})
</script>


<template>
    <div class="z-10 m-4 flex flex-row gap-4 justify-between">
        <div class="basis-1/4 2xl:basis-1/5 h-fit relative" >
            <ProfileInfoDisplay class="w-full"/>
        </div>
        <Tabs default-value="pholi" class="flex-1 flex-col flex h-fit w-full gap-4 items-center">
            <TabsList>
                <TabsTrigger value="pholi">
                    Pholi
                </TabsTrigger>
                <TabsTrigger value="feed">
                    Feed
                </TabsTrigger>
            </TabsList>
            <TabsContent value="pholi" class="w-full">
                <ProfileMedia class="w-full h-fit" />
            </TabsContent>
            <TabsContent value="feed" class="w-full">
                <ProfileFeed class="w-full h-fit" />
            </TabsContent>
        </Tabs>
    </div>
</template>