import { createRouter, createWebHistory } from 'vue-router'
import DesktopView from '@/views/DesktopView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DesktopView,
    },
  ],
})

export default router
