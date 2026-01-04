<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import Heading from './Sidebar.vue'
import AccountInfoDisplay from './blocks/AccountInfoDisplay.vue'
import AccountMedia from './blocks/AccountMedia.vue'

import { mediaHandler } from '@/lib/mediaHandler'
import { infoHandler } from '@/lib/infoHandler'
import { supabase } from '@/lib/supabaseClient'

const route = useRoute()

const { loadMedia, setMedia } = mediaHandler()
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
            setMedia(usernameParam.value ?? '')
        }
    } else {
        await getProfile()
    }
    await loadMedia()
})
</script>


<template>
    <div class="flex-row flex justify-between min-h-screen">
        <Heading class="basis-1/12 h-full" />
        <div class="m-4 flex flex-row gap-4 justify-between">
            <AccountInfoDisplay class=" basis-1/4 w-auto h-fit" />
            <AccountMedia class="basis-3/4 w-auto h-fit" />
        </div>
    </div>
</template>