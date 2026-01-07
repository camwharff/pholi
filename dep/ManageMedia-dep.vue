<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../src/lib/supabaseClient'
import type { Ref } from 'vue'

import Input from '../src/components/ui/input/Input.vue'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../src/components/ui/accordion'

const title = ref('')
const description = ref('')
const session = ref<Session | null>(null)

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
        await loadMedia()
    } else {
    }
})

async function loadMedia() {
    if (!session.value) return

    try {
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
    }
}

async function downloadMedia() {
    for (let item of Object.values(media_raw.value)) {
        if (!media_list.value.find(entry => item.id == entry.id)) {
            console.log(`adding item ${item.title}`)
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
}

const uploadMedia = async (evt: Event) => {
    if (!session.value) return

    const form = evt.target as HTMLFormElement
    const target = form.elements[0] as HTMLInputElement

    if (!target || !target.files || target.files.length === 0) {
        alert('You must select an image to upload.')
        return
    }

    const file = target.files[0]

    if (file) {
        const { user } = session.value
        const fileExt = file.name.split('.').pop()
        const filePath = `${Math.random()}.${fileExt}`
        const new_media = {
            title: title.value,
            description: description.value,
            id: filePath,
            aspect: 'square',
            size: 'sm',
            path: filePath,
            timeStamp: Date.now()
        }
        try {
            await supabase.storage.from('media').upload(filePath, file)
            await supabase.from('profiles').update({ media: [...media_raw.value, new_media] }).eq('id', user?.id)
            loadMedia()
            form.reset()
        } catch (error) {
            if (error instanceof Error) alert(error.message)
        }
    }
}

</script>

<template>
    <Accordion type="single" collapsible class="w-full flex gap-4 flex-col overflow-visible" default-value="all_media">
        <AccordionItem value="add_media" class="w-full">
            <AccordionTrigger class="bg-sky-700 rounded-3xl text-white text-lg p-4 w-full z-20 relative">
                Upload Media
            </AccordionTrigger>
            <AccordionContent class="-mt-8 pt-12 overflow-visible">
                <div
                    class="flex w-inherit items-center bg-sky-950 rounded-3xl rounded-t-none shadow-md text-white text-sm p-8 -mb-4 pt-16 -mt-12 z-10">
                    <form @submit.prevent="uploadMedia" class="w-full flex flex-col justify-around gap-4 text-sm"
                        name="addForm">
                        <Input class="bg-white w-full text-black" type="file" id="single" accept="image/*" />
                        <div>
                            <label for="title">Title</label>
                            <Input id="title" type="text" v-model="title" required />
                        </div>
                        <div>
                            <label for="description">Description</label>
                            <Input id="description" type="text" v-model="description" />
                        </div>
                        <input type="submit" class="button rounded-lg text-white block max-w-fit p-2 bg-sky-700"
                            value="Submit" />
                    </form>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="all_media" class="w-full">
            <AccordionTrigger class="bg-sky-700 rounded-3xl text-white text-lg p-4 w-full z-20 relative">
                All
            </AccordionTrigger>
            <AccordionContent class="-mt-8 pt-12 overflow-visible">
                <div
                    class="grid grid-cols-2 gap-2 grid-flow-row justify-start w-inherit items-start bg-sky-950 rounded-3xl rounded-t-none shadow-md text-white text-sm p-4 -mb-4 pt-12 -mt-12 z-10 max-h-[50vh] overflow-y-scroll">
                    <div v-for="item in media_list" :key="item.id">
                        <img :src="item.src" alt="media" :class="['w-full rounded-lg border-sky-700 border-5 aspect-square object-cover']" />
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="staged_media" class="w-full">
            <AccordionTrigger class="bg-sky-700 rounded-3xl text-white text-lg p-4 w-full z-20 relative">
                Staged
            </AccordionTrigger>
            <AccordionContent class="-mt-8 pt-12 overflow-visible">
                <div
                    class="flex w-inherit items-center bg-sky-950 rounded-3xl rounded-t-none shadow-md text-white text-sm p-8 -mb-4 pt-16 -mt-12 z-10 max-h-[50vh] overflow-scroll">
                </div>
            </AccordionContent>
        </AccordionItem>
    </Accordion>

</template>
