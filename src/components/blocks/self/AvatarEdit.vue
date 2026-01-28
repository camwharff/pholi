<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import Input from '@/components/ui/input/Input.vue'
import { Label } from '@/components/ui/label'
import logoCircleFront from '@/assets/logo-circle-front.vue'
import { authHandler } from '@/lib/authHandler'
import { mediaHandler } from '@/lib/mediaHandler'

const prop = defineProps<{
    avatar_url: string
}>()
const emit = defineEmits<{
    (update: 'update:avatar_src', value: string): void,
    (disableSave: 'disableSave', value: boolean): void
}>()

const loadingPreview = ref(false)
const newAvatarUrl = ref<string>()
const { preloadImage } = mediaHandler()

const setAvatarPreview = async (newSrc: string) => {
    const { data } = await supabase.storage.from('avatars').getPublicUrl(newSrc)
    newAvatarUrl.value = data.publicUrl
    await preloadImage(data.publicUrl)
}

const uploadAvatar = async (evt: Event) => {
    const { user, loadUser } = authHandler()
    if (!user.value) {
        loadUser()
    }
    loadingPreview.value = true
    emit('disableSave', true)
    const input = evt.target as HTMLInputElement
    if (!input.files || input.files.length === 0) {
        alert('You must select an image to upload.')
        return
    }

    const file = input.files[0]
    if (file) {
        try {
            const fileExt = file.name.split('.').pop()
            const filePath = `${Math.random()}.${fileExt}`

            const { error } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })

            if (error) throw error
            emit('update:avatar_src', filePath)
            await setAvatarPreview(filePath)
        } catch (error) {
            if (error instanceof Error) alert(error.message)
        } finally {
            loadingPreview.value = false
            emit('disableSave', false)
        }
    } else {
        loadingPreview.value = false
        emit('disableSave', false)
    }
}

</script>

<template>
    <div class="flex flex-col items-start gap-4">
        <div class="w-full aspect-square overflow-hidden bg-accent rounded-3xl">
            <img v-if="!loadingPreview && (avatar_url || newAvatarUrl)" :src="newAvatarUrl ?? avatar_url" alt="Avatar"
                class="w-full h-full avatar image rounded-3xl border-accent border-4 object-cover" />
            <logo-circle-front v-else-if="loadingPreview"
                class="animate-pulse w-full h-full rounded-full mx-auto text-accent" />
            <logo-circle-front v-else class="w-full h-full rounded-full mx-auto text-accent" />
        </div>
        <div class="flex flex-col w-full justify-start items-start gap-2">
            <Label for="avatarUpload">Avatar</Label>
            <Input class="bg-input h-fit w-full file:font-bold file:text-input-foreground text-input-foreground"
                type="file" id="avatarUpload" accept="image/*" @change="uploadAvatar" />
        </div>
    </div>
</template>
