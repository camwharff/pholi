import { ref } from "vue"
import { supabase } from "./supabaseClient"
import { authHandler } from '@/lib/authHandler'
import router from '@/router'
import { uiHandler } from "./uiHandler"

const avatar_url = ref('')
const username = ref('')
const bio = ref('')
const full_name = ref('')
const website_title = ref('')
const website_url = ref('')

const { shortAlert } = uiHandler()

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

async function searchUsers(userSearchParam: string) {
    if (!userSearchParam) return

    try {
        const { data, error, status } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', userSearchParam)

        if (error && status !== 406) throw error
        if (data?.length) {
            router.push({ name: 'public-profile', params: { username: userSearchParam } })
        } else {
            shortAlert(`No user found with username \"${userSearchParam}\"`)
        }
    } catch (error) {
        if (error instanceof Error) alert(error.message)
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
    const { user } = authHandler()
    if (!user.value) return

    try {

        const { data, error, status } = await supabase
            .from('profiles')
            .select('username, avatar_url, full_name, bio, full_name')
            .eq('id', user.value?.id ?? '')
            .single()

        if (error && status !== 406) throw error

        if (data) {
            username.value = data.username ?? ''
            avatar_url.value = data.avatar_url ?? ''
            full_name.value = data.full_name ?? ''
            bio.value = data.bio ?? ''
        }
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    }
}

async function updateProfile() {
    const { user } = authHandler()
    if (!user.value) return

    try {
        const updates = {
            id: user.value.id,
            username: username.value,
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
        alert,
        getProfile,
        setProfile,
        updateProfile,
        searchUsers
    }
}