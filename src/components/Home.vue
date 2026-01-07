<script setup lang="ts">
import Heading from './Heading.vue'
import { onMounted } from 'vue'

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
    <div class="w-full h-full flex p-4">
        <div class="m-auto bg-secondary rounded-3xl p-4 w-full">
            plonk
        </div>
    </div>
</template>