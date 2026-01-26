import { supabase } from "@/lib/supabaseClient"
import { useProfilesStore } from "@/stores/profiles"

async function follow(currId: string, targetId: string, username: string) {
    await supabase.from('follows').insert({
        follower_id: currId,
        following_id: targetId
    })
    const profilesStore = useProfilesStore()
    await profilesStore.fetchProfile(username)
}

async function unfollow(currId: string, targetId: string, username: string) {
    await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currId)
        .eq('following_id', targetId)
    const profilesStore = useProfilesStore()
    await profilesStore.fetchProfile(username)
}

async function getFollowing(userId: string) {
    const { data: following } = await supabase
        .from('follows')
        .select('following_id, profiles(username, display_name, avatar_url)')
        .eq('follower_id', userId)
    return following
}

async function getFollowingCount(userId: string) {
    const { count: followingCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact' })
        .eq('follower_id', userId)
    return followingCount
}

async function getFollowers(userId: string) {
    const { data: followers } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('following_id', userId)
    return followers
}

async function getFollowerCount(userId: string) {
    const { count: followersCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact' })
        .eq('following_id', userId)
    return followersCount
}

export function interactionHandler() {
    return {
        follow,
        unfollow,
        getFollowing,
        getFollowingCount,
        getFollowers,
        getFollowerCount
    }
}