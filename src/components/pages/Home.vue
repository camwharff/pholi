<script setup lang="ts">
import Heading from '@/components/blocks/Heading.vue'
import { onMounted } from 'vue'

import About from '../blocks/About.vue'
import Features from '../blocks/Features.vue'
import NotifSignup from '../blocks/Blurb.vue'

import { authHandler } from '@/lib/authHandler'
import { infoHandler } from '@/lib/infoHandler'
import { mediaHandler } from '@/lib/mediaHandler'

const { user, signOut } = authHandler()
const { getProfile } = infoHandler()
const { loadMedia } = mediaHandler()

onMounted(async () => {
    if (user.value) {
        await loadMedia()
        await getProfile()
    } else {
        signOut()
    }
})
</script>

<template>
    <Heading />
    <div class="w-full h-full flex flex-col gap-4 p-4 items-center ">
        <div class="m-auto bg-secondary rounded-3xl p-4 w-3/4 flex flex-col items-center ">
            <NotifSignup />
            <Features />
            <About />
        </div>
    </div>
</template>