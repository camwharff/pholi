import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'
import { interactionHandler } from "@/lib/interactionHandler"
import { type Post } from '@/lib/postHandler'
import { mediaHandler, type GridMatrix } from '@/lib/mediaHandler'

const { getSrc } = mediaHandler()
const { getFollowing, getFollowers, getFollowingCount, getFollowerCount } = interactionHandler()

interface Profile {
  id: string
  timestamp: number
  username: string
  full_name: string
  avatar_url: string
  bio: string
  media: string
  pholi: GridMatrix
  posts: Post[]
  followingData: {
    following: string[]
    followers: string[]
    followingCount: number
    followerCount: number
  }
}

export const useProfilesStore = defineStore('profiles', {
  state: () => ({
    profiles: {} as Record<string, Profile>,
    loading: {} as Record<string, boolean>
  }),

  actions: {
    async fetchProfile(username: string) {

      if (this.loading[username]) return
      this.loading[username] = true

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      if (error || !data) {
        this.loading[username] = false
        return null
      }

      const [followingRows, followerRows, followingCountResult, followerCountResult] =
        await Promise.all([
          getFollowing(data.id),
          getFollowers(data.id),
          getFollowingCount(data.id),
          getFollowerCount(data.id)
        ])

      const following = followingRows?.map(row => row.following_id) ?? []
      const followers = followerRows?.map(row => row.follower_id) ?? []
      const followingCount: number = followingCountResult ?? 0
      const followerCount: number = followerCountResult ?? 0

      const profile: Profile = {
        id: data.id,
        username: data.username,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        bio: data.bio,
        media: data.media,
        pholi: JSON.parse(data.pholi),
        posts: data.posts,
        timestamp: Date.now(),
        followingData: {
          following,
          followers,
          followingCount,
          followerCount
        }
      }
      
      // Resolve media URLs in pholi grid
      for (const row of profile.pholi) {
        for (const cell of row) {
          if (cell && cell.kind === 'media') {
            const source = await getSrc(cell.id)
            cell.url = source ?? ''
          }
        }
      }

      // Store in Pinia cache
      this.profiles[username] = profile

      // Persist cache
      localStorage.setItem(
        `profile:${username}`,
        JSON.stringify(profile)
      )

      this.loading[username] = false
      return profile
    },

    loadFromCache(username: string) {
      const CACHE_TTL = 1000 * 60 * 5 // 5 mins

      const cached = localStorage.getItem(`profile:${username}`)
      if (cached) {
        this.profiles[username] = JSON.parse(cached) as Profile
        if (Date.now() - this.profiles[username].timestamp > CACHE_TTL) {

        }
      }
    },

    clear() {
      this.profiles = {}
      this.loading = {}
    }
  }
})
