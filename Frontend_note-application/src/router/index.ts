import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../page/LoginPage.vue')
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../page/SignupPage.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../page/DashboardPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      redirect: '/login'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
