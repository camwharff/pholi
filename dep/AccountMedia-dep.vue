<script setup lang="ts">
import { supabase } from '../src/lib/supabaseClient'
import { onMounted, ref } from 'vue'
import type { Session } from '@supabase/supabase-js'
import type { Ref } from 'vue'

const session = ref<Session | null>(null)
const loading = ref(true)

const media_raw: Ref<{
    title: string,
    description: string,
    id: string,
    aspect: string,
    size: string,
    path: string
}[]> = ref([])

const media_list: Ref<{
    title: string,
    description: string,
    id: string,
    src: string,
    aspect: string,
    size: string
}[]> = ref([])

onMounted(async () => {
    const {
        data: { session: currentSession }
    } = await supabase.auth.getSession()

    session.value = currentSession

    if (session.value) {
        await getCurrentMedia()
    } else {
        loading.value = false
    }
})

async function getCurrentMedia() {
    if (!session.value) return

    try {
        loading.value = true
        const { user } = session.value

        const { data, error, status } = await supabase
            .from('profiles')
            .select('media')
            .eq('id', user.id)
            .single()

        if (error && status !== 406) throw error

        if (data) {
            media_raw.value = data.media ?? []
        }
        downloadMedia()
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    } finally {
        loading.value = false
    }
}

async function downloadMedia() {
    for (let item of Object.values(media_raw.value)) {
        try {
            const { data, error } = await supabase.storage.from('media').download(item.path);
            if (error) {
                throw error;
            }
            const url = URL.createObjectURL(data)
            media_list.value.push({
                title: `${item.title}`,
                description: `${item.description}`,
                id: `${item.id}`,
                src: url,
                aspect: `${item.aspect}`,
                size: `${item.size}`
            })
        } catch (error) {
            if (error instanceof Error) alert(error.message)
        }
    }
}

</script>

<template>
    <div class="flex flex-col items-center w-full gap-4">
        <div
            class="h-fit rounded-3xl bg-sky-950 border-sky-950 border-4 p-4 grid grid-cols-4 grid-flow-dense gap-4">
            <div v-for="item in media_list" :key="item.id">
                <img :src="item.src" alt="media" class="w-full aspect-square object-cover rounded-3xl border-sky-700 border-5" />
            </div>
        </div>
    </div>
</template>