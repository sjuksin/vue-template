import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import StartView from '../views/StartView.vue'
import { useModalStore } from '@/stores/modal'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start',
      component: StartView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    }
  ],
})

/** Отправляем на роут, если и так на него не идём */
function ensureOnRoute (to: RouteLocationNormalized, name: string, params?: Record<string, any>) {
  return to.name === name ? true : { name, params }
}

router.beforeEach(to => {
  // dev-routes always in access
  if (to.path.startsWith('/_')) return

})

// При любом переходе сбрасываем модалки
router.afterEach(() => {
  const modalStore = useModalStore()
  modalStore.$reset()
})

export default router
