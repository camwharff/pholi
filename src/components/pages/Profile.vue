<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import Heading from '@/components/blocks/Heading.vue'
import AccountInfoDisplay from '@/components/blocks/AccountInfoDisplay.vue'
import AccountMedia from '@/components/blocks/AccountMedia.vue'
import AccountFeed from '@/components/blocks/AccountFeed.vue'

import { mediaHandler } from '@/lib/mediaHandler'
import { infoHandler } from '@/lib/infoHandler'
import { postHandler } from '@/lib/postHandler'
import { supabase } from '@/lib/supabaseClient'

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
 } from '@/components/ui/tabs'

const route = useRoute()

const { loadMedia, setMedia } = mediaHandler()
const { getProfile, setProfile } = infoHandler()
const { loadPosts } = postHandler()

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
            setMedia(usernameParam.value ?? '')
        }
    } else {
        await getProfile()
    }
    await loadMedia()
    await loadPosts()
})
</script>


<template>
    <Heading />
    <div class="z-10 m-4 flex flex-row gap-4 justify-between">
        <AccountInfoDisplay class="basis-1/4 w-auto h-fit" />
        <Tabs default-value="pholi" class="basis-3/4 flex-col flex m-4 h-fit w-full gap-4 items-center">
            <TabsList>
                <TabsTrigger value="pholi">
                    Pholi
                </TabsTrigger>
                <TabsTrigger value="feed">
                    Feed
                </TabsTrigger>
            </TabsList>
            <TabsContent value="pholi" class="w-full">
                <AccountMedia class="w-full h-fit" />
            </TabsContent>
            <TabsContent value="feed" class="w-full">
                <AccountFeed class="w-full h-fit" />
            </TabsContent>
        </Tabs>
    </div>
</template>