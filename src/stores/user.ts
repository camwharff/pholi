import { defineStore } from "pinia"
import { supabase } from '@/lib/supabaseClient'
import { interactionHandler } from "@/lib/interactionHandler"
import { mediaHandler } from "@/lib/mediaHandler"

const { getSrc, nullPholi, updatePholi, initializePholi } = mediaHandler()
const { getFollowing, getFollowers, getFollowingCount, getFollowerCount } = interactionHandler()

export const useUserStore = defineStore('user', {
  state: () => ({
    info: null as any | null,
    followingInfo: null as any | null,
    timestamp: Date.now()
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

      console.log(info.pholi)

      if(info.pholi) {
        for (const row of info.pholi) {
          for (const cell of row) {
            if (cell && cell.kind === 'media') {
              const source = await getSrc(cell.id)
              cell.url = source ?? ''
            }
          }
        }
      }
      console.log(info)

      localStorage.setItem('userInfo', JSON.stringify(info))
      localStorage.setItem('followingInfo', JSON.stringify(this.followingInfo))
      localStorage.setItem('timestamp', JSON.stringify(Date.now()))
    },

    async loadFromCache() {
      const info = localStorage.getItem('userInfo')
      const timestamp = localStorage.getItem('timestamp')
      if (timestamp && timestamp !== 'undefined') { this.timestamp = JSON.parse(timestamp) }
      else { this.timestamp = Date.now() }

      if (info) this.info = JSON.parse(info)

      const CACHE_TTL = 1000 * 60 * 5 // 5 mins
      if (Date.now() - this.timestamp > CACHE_TTL) {
        const userStore = useUserStore()
        await userStore.loadUserData(this.info.id)
        const info = localStorage.getItem('userInfo')
        if (info) this.info = JSON.parse(info)
      }
    
      const following = localStorage.getItem('followingInfo')
      if (following) this.followingInfo = JSON.parse(following)
    }
  }
})
