import { supabase } from "@/lib/supabaseClient"

async function follow(currId: string, targetId: string) {
    await supabase.from('follows').insert({
        follower_id: currId,
        following_id: targetId
    })
}

async function unfollow(currId: string, targetId: string) {
    await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currId)
        .eq('following_id', targetId)
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

const isFollowing = (currId: string, following: string[]) => {
    return following.includes(currId)
}

export function interactionHandler() {
    return {
        follow,
        unfollow,
        getFollowing,
        getFollowingCount,
        getFollowers,
        getFollowerCount,
        isFollowing
    }
}