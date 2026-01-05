import { ref } from "vue"
import { supabase } from "./supabaseClient"
import { authHandler } from '@/lib/authHandler'

const avatar_url = ref('')
const username = ref('')
const bio = ref('')
const full_name = ref('')
const website_title = ref('')
const website_url = ref('')

const { user } = authHandler()

interface Profile {
    username: string
    full_name: string | null
    avatar_url: string | null
    bio: string | null
    website: {
        url: string
        title: string
    }
}

function setProfile(data: Profile): void {
    username.value = data.username ?? ''
    avatar_url.value = data.avatar_url ?? ''
    full_name.value = data.full_name ?? ''
    bio.value = data.bio ?? ''
    website_title.value = data.website.title ?? ''
    website_url.value = data.website.url ?? ''
}

async function getProfile() {
    if (!user.value) return

    try {

        const { data, error, status } = await supabase
            .from('profiles')
            .select('username, avatar_url, full_name, bio, website')
            .eq('id', user.value.id)
            .single()

        if (error && status !== 406) throw error

        if (data) {
            const website_json = data.website ?? { url: '', title: '' }

            username.value = data.username ?? ''
            avatar_url.value = data.avatar_url ?? ''
            full_name.value = data.full_name ?? ''
            bio.value = data.bio ?? ''
            website_title.value = website_json.title ?? ''
            website_url.value = website_json.url ?? ''
        }
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    }
}

async function updateProfile() {
    if (!user.value) return

    try {

        const updates = {
            id: user.value.id,
            username: username.value,
            website: {
                url: website_url.value,
                title: website_title.value
            },
            avatar_url: avatar_url.value,
            full_name: full_name.value,
            bio: bio.value,
            updated_at: new Date()
        }
        const { error } = await supabase.from('profiles').upsert(updates)
        if (error) throw error
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    }
}

export function infoHandler() {
    return {
        avatar_url,
        username,
        bio,
        full_name,
        website_title,
        website_url,
        getProfile,
        setProfile,
        updateProfile
    }
}