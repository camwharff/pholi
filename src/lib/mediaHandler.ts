import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { authHandler } from '@/lib/authHandler'
import { uiHandler } from '@/lib/uiHandler'
import { useUserStore } from '@/stores/user'
import type { MediaRaw, NewMedia } from '@/lib/types'

const { shortAlert } = uiHandler()
const newMedia = ref<NewMedia[]>([])
const preview = ref<NewMedia>()
const disableUpload = ref(false)

async function selectMedia(evt: Event) {
    const input = evt.target as HTMLInputElement
    const selectedFiles = input.files

    if (selectedFiles) {
        for (const newFile of selectedFiles) {
            if (newFile.size > 50000000) {
                shortAlert(`${newFile.name} exceeds size limit of 50mb`)
                continue
            }
            newMedia.value.push({
                file: newFile,
                type: newFile.type.split('/')![0] as string,
                url: URL.createObjectURL(newFile)
            })
        }
    }
    input.value = ''
}

function addCover(evt: Event) {
    const input = evt.target as HTMLInputElement
    return input.files![0]
}

async function deleteMedia(itemId: string) {
    const { user } = authHandler()
    const media_raw: MediaRaw[] = await loadMedia()
    if (user.value) {
        const indexRaw = media_raw.findIndex(item => item.id === itemId)
        media_raw.splice(indexRaw, 1)
        await supabase.from('profiles').update({ media: [...media_raw] }).eq('id', user.value.id)
        await supabase.storage.from('media').remove([itemId])
        const userStore = useUserStore()
        await userStore.loadUserData(user.value.id)
        shortAlert('Media deleted')
    }
}

const uploadMedia = async (evt: Event) => {
    const { user } = authHandler()
    if (!user.value) return
    disableUpload.value = true
    const form = evt.target as HTMLFormElement

    if (newMedia.value.length === 0) {
        alert('You must select at least one file to upload.')
        return
    }

    for (const media of newMedia.value) {
        if (media.file) {

            const fileExt = media.file.name.split('.').pop()
            const filePath = `${Math.random()}.${fileExt}`
            const new_media: MediaRaw = {
                id: filePath,
                path: filePath,
                label: media.title,
                timeStamp: Date.now(),
                description: media.description,
                type: media.type,
                date: media.date
            }

            // upload cover if exists
            if (media.cover) {
                const coverExt = media.cover.name.split('.').pop()
                new_media.cover = `${Math.random()}.${coverExt}`
                try {
                    const { error } = await supabase.storage.from('media').upload(new_media.cover, media.cover)
                    if (error) throw error
                } catch (error) {
                    if (error instanceof Error) {
                        alert(error.message)
                        continue
                    }
                }
            }

            // upload media file
            try {
                const { error } = await supabase.storage.from('media').upload(filePath, media.file)
                if (error) throw error
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message)
                    continue
                }
            }

            // update profile media array
            const media_raw: MediaRaw[] = await loadMedia()
            try {
                const { error } = await supabase.from('profiles').update({ media: [...media_raw, new_media] }).eq('id', user.value.id)
                if (error) throw error
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message)
                    continue
                }
            }
        }
    }

    disableUpload.value = false
    shortAlert('Upload complete')
    form.reset()
    newMedia.value = []
}

async function loadMedia() {
    const { user } = authHandler()
    if (!user.value) return

    try {
        const { data, error, status } = await supabase
            .from('profiles')
            .select('media')
            .eq('id', user.value.id)
            .single()

        if (error && status !== 406) throw error

        if (data) {
            return data.media ?? []
        }
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    }
}

async function getSrc(id: string) {
    return await supabase.storage.from('media').getPublicUrl(id).data.publicUrl
}

async function getAvatarUrl(id: string) {
    return await supabase.storage.from('avatars').getPublicUrl(id).data.publicUrl
}

export function mediaHandler() {
    return {
        disableUpload,
        preview,
        newMedia,
        addCover,
        deleteMedia,
        getSrc,
        getAvatarUrl,
        uploadMedia,
        loadMedia,
        selectMedia
    }
}
