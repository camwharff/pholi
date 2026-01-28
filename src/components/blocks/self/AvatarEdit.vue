<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import Input from '@/components/ui/input/Input.vue'
import { Label } from '@/components/ui/label'

const prop = defineProps(['src'])
const { src } = toRefs(prop)

const emit = defineEmits(['upload', 'update:path'])
const uploading = ref(false)
const newAvatarSrc = ref('')

const setAvatarPreview = async (newSrc: string) => {
    const { data } = await supabase.storage.from('avatars').getPublicUrl(newSrc)
    newAvatarSrc.value = data.publicUrl
}

const uploadAvatar = async (evt: Event) => {
    const input = evt.target as HTMLInputElement

    if (!input.files || input.files.length === 0) {
        alert('You must select an image to upload.')
        return
    }

    const file = input.files[0]

    if (file) {
        try {
            uploading.value = true

            const fileExt = file.name.split('.').pop()
            const filePath = `${Math.random()}.${fileExt}`

            const { error } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })

            if (error) throw error
            setAvatarPreview(filePath)
            emit('upload')
        } catch (error) {
            if (error instanceof Error) alert(error.message)
        } finally {
            uploading.value = false
        }
    }
}
</script>

<template>
    <div class="flex flex-col items-start gap-4">
        <div class="w-full aspect-square overflow-hidden">
            <img :src="newAvatarSrc === '' ? src : newAvatarSrc" alt="Avatar"
                class="w-full h-full avatar image rounded-3xl border-accent border-4 object-cover" />
        </div>
        <div class="flex flex-col w-full justify-start items-start gap-2">
            <Label for="avatarUpload">Avatar</Label>
            <Input class="bg-input h-fit w-full file:font-bold file:text-input-foreground text-input-foreground" type="file" id="avatarUpload" accept="image/*"
                @change="uploadAvatar" />
        </div>
    </div>
</template>
