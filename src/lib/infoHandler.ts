import { supabase } from "./supabaseClient"
import { authHandler } from '@/lib/authHandler'
import router from '@/router'
import { uiHandler } from "@/lib/uiHandler"
import { useUserStore } from "@/stores/user"

const { shortAlert } = uiHandler()

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

async function updateProfile(bio: string, avatar_src: string, full_name: string) {
    const { user } = authHandler()
    if (!user.value) return

    try {
        const updates = {
            id: user.value.id,
            username: user.value.user_metadata.username,
            full_name: full_name,
            bio: bio,
            avatar_src: avatar_src,
            updated_at: new Date()
        }
        const { error } = await supabase.from('profiles').upsert(updates).select()
        if (error) throw error
        shortAlert("Info Saved")
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    }
    const userStore = useUserStore()
    userStore.loadUserData(user.value.id)
}

export function infoHandler() {
    return {
        alert,
        updateProfile,
        searchUsers
    }
}