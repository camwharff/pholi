import { defineStore } from "pinia"
import { supabase } from '@/lib/supabaseClient'
import { interactionHandler } from "@/lib/interactionHandler"
import { mediaHandler } from '@/lib/mediaHandler'

const { getFollowing, getFollowers, getFollowingCount, getFollowerCount } = interactionHandler()
const { getSrc } = mediaHandler()

export const useUserStore = defineStore('user', {
  state: () => ({
    info: null as any | null,
    followingInfo: null as any | null,
    timestamp: Date.now()
  }),
  actions: {
    async loadUserData(userId: string) {
      const user = await supabase.auth.getUser()
      if (!user) return

      const { data: info } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.data.user?.id ?? '')
        .single()

      const following = await getFollowing(userId)
      const followers = await getFollowers(userId)
      const followingCount = await getFollowingCount(userId)
      const followerCount = await getFollowerCount(userId)

      this.info = info
      this.followingInfo = { following, followers, followingCount, followerCount }

      // Resolve media URLs in pholi grid
      for (const row of this.info.pholi) {
        for (const cell of row) {
          if (cell && cell.kind === 'media') {
            const source = await getSrc(cell.id)
            cell.url = source ?? ''
            if (cell.coverId) {
              const coverSource = await getSrc(cell.coverId)
              cell.coverUrl = coverSource ?? ''
            }
          }
        }
      }

      // Resolve media URLs for all media
      for (const item of this.info.media) {
        const source = await getSrc(item.id)
        item.url = source ?? ''
        if (item.coverId) {
          const coverSource = await getSrc(item.coverId)
          item.coverUrl = coverSource ?? ''
        }
      }

      // Resolve media URLs in posts
      for (const item of this.info.posts) {
        const source = await getSrc(item.id)
        item.url = source ?? ''
      }

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
