<script setup lang="ts">
import { ref, toRefs, watchEffect } from 'vue'
import { supabase } from '@/lib/supabaseClient'

const prop = defineProps(['path'])
const { path } = toRefs(prop)

const src = ref('')

const downloadImage = async () => {
    if (path) {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path.value)
            if (error) throw error
            src.value = URL.createObjectURL(data)
        } catch (error) {
            if (error instanceof Error) alert(error.message)
        }
    }
}

watchEffect(() => {
    if (path) {
        if (path.value) downloadImage()
    }
})
</script>

<template>
    <div class="flex flex-col items-center">
        <div class="aspect-square overflow-hidden w-full">
            <img v-if="src" :src="src" alt="Avatar"
                class="w-full h-full avatar image rounded-3xl border-accent border-4 object-cover" />
            <div v-else class="min-w-full min-h-full avatar image rounded-3xl bg-accent border-accent border-4"></div>
        </div>
    </div>
</template>