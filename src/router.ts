import { createWebHistory, createRouter } from 'vue-router'

import account from '@/components/pages/Account.vue'
import profile from '@/components/pages/Profile.vue'
import home from '@/components/pages/Home.vue'
import { authHandler } from '@/lib/authHandler'
import updatePassword from '@/components/forms/update-password.vue'
import swatches from '@/components/pages/Swatches.vue'

const routes = [
  {
    path: '/account',
    name: 'account',
    component: account,
    meta: { requiresAuth: true }
  },
  {
    path: '/users/:username',
    name: 'public-profile',
    component: profile
  },
  {
    path: '/update-password',
    component: updatePassword,
    meta: { requiresAuth: true }
  },
  {
    path: '/home',
    name: 'home',
    component: home
  },
  {
    path: '/swatch',
    component: swatches
  },
  {
    path: '/',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const { user, loadUser } = authHandler()
  await loadUser()
  if (to.meta.guestOnly && user) {
    return { name: 'account' }
  }

  if (to.meta.requiresAuth && !user) {
    return { name: 'home' }
  }

  return true
})

export default router
