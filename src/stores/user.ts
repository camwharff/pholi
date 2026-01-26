import { defineStore } from "pinia"
import { supabase } from '@/lib/supabaseClient'
import { interactionHandler } from "@/lib/interactionHandler"

const { getFollowing, getFollowers, getFollowingCount, getFollowerCount } = interactionHandler()

export const useUserStore = defineStore('user', {
  state: () => ({
    info: null as any | null,
    followingInfo: null as any | null,
  }),
  actions: {
    async loadUserData(userId: string) {
      const user = supabase.auth.getUser()
      if (!user) return

      const { data: info } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      const following = await getFollowing(userId)
      const followers = await getFollowers(userId)
      const followingCount = await getFollowingCount(userId)
      const followerCount = await getFollowerCount(userId)

      this.info = info
      this.followingInfo = { following, followers, followingCount, followerCount }

      localStorage.setItem('userInfo', JSON.stringify(info))
      localStorage.setItem('followingInfo', JSON.stringify(this.followingInfo))
    },

    loadFromCache() {
      const info = localStorage.getItem('userInfo')
      const following = localStorage.getItem('followingInfo')
      if (info) this.info = JSON.parse(info)
      if (following) this.followingInfo = JSON.parse(following)
      this.info.pholi = JSON.parse(this.info.pholi)
    }
  }
})
