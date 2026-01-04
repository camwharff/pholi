import { createWebHistory, createRouter } from 'vue-router'

import login from './components/forms/login.vue'
import account from './components/Account.vue'
import forgotPass from './components/forms/forgot-password.vue'
import signUp from './components/forms/sign-up.vue'
import updatePass from '../dep/update-password.vue'
import profile from './components/Profile.vue'
import home from './components/Home.vue'
import { authHandler } from './lib/authHandler'

const { session } = authHandler()

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
    path: '/home',
    name: 'home',
    component: home
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
  if (to.meta.guestOnly && session.value) {
    return { name: 'account' }
  }

  if (to.meta.requiresAuth && !session.value) {
    return { name: 'auth' }
  }

  return true
})

export default router
