<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { mediaHandler } from '@/lib/mediaHandler'
import { infoHandler } from '@/lib/infoHandler'
import { supabase } from '@/lib/supabaseClient'

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

const { loadMedia } = mediaHandler()
const { getProfile, setProfile } = infoHandler()

const usernameParam = computed(() => route.params.username as string | undefined)
const isPublicProfile = computed(() => !!usernameParam.value)


onMounted(async () => {
    if (isPublicProfile.value) {
        const { data, error } = await supabase
            .from('profiles')
            .select('username, full_name, avatar_url, bio, website')
            .eq('username', usernameParam.value)
            .single()
        if (!error && data) {
            setProfile(data)
        }
    } else {
        await getProfile()
    }
    await loadMedia()
})
</script>


<template>
    <div class="z-10 m-4 flex flex-row gap-4 justify-between">
        <ProfileInfoDisplay class="basis-1/4 2xl:basis-1/5 w-auto h-fit" />
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