<script setup lang="ts">
import { onMounted } from 'vue'

import About from '@/components/blocks/admin/About.vue'
import Features from '@/components/blocks//admin/Features.vue'
import Blurb from '@/components/blocks/admin/Blurb.vue'

import { authHandler } from '@/lib/authHandler'
import { mediaHandler } from '@/lib/mediaHandler'

const { user, signOut } = authHandler()
const { getCurrentMedia } = mediaHandler()

onMounted(async () => {
    if (user.value) {
        await getCurrentMedia()
    } else {
        signOut()
    }
})
</script>

<template>
    <div class="w-full h-full flex flex-col gap-4 p-4 items-center ">
        <div class="m-auto bg-secondary rounded-3xl w-3/4 flex flex-col items-center p-16">
            <Blurb />
            <Features />
            <About />
        </div>
    </div>
</template>