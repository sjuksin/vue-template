import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
import SecondView from '@/views/SecondView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start',
      component: StartView,
    },
    {
      path: '/second',
      name: 'second',
      component: SecondView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    }
  ],
})

export default router
