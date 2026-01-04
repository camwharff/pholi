import { createWebHistory, createRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

import login from './components/forms/login.vue'
import account from './components/Account.vue'
import forgotPass from './components/forms/forgot-password.vue'
import signUp from './components/forms/sign-up.vue'
import updatePass from './components/forms/update-password.vue'
import profile from './components/Profile.vue'

const routes = [
  {
    path: '/login',
    name: 'auth',
    component: login,
    meta: { guestOnly: true }
  },
  {
    path: '/sign-up',
    component: signUp,
    meta: { guestOnly: true }
  },
  {
    path: '/forgot-password',
    component: forgotPass,
    meta: { guestOnly: true }
  },
  {
    path: '/update-password',
    component: updatePass
  },
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
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(), // ← critical change
  routes
})

router.beforeEach(async (to) => {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (to.meta.guestOnly && session) {
    return { name: 'account' }
  }

  if (to.meta.requiresAuth && !session) {
    return { name: 'auth' }
  }

  return true
})

export default router
