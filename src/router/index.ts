import { createRouter, createWebHistory } from 'vue-router'
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

router.beforeEach(async (to) => {
  // dev-routes always in access
  if (to.path.indexOf('/_') === 0) {
    return
  }
})

// При любом переходе сбрасываем модалки
router.afterEach(() => {
  const modalStore = useModalStore()
  modalStore.$reset()
})

export default router
