import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
import SecondView from '@/views/SecondView.vue'
import { useModalStore } from '@/stores/modal.ts'

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

router.beforeEach(async (to) => {
  // debug-routes always in access
  if (to.path.indexOf('/_') === 0) {
    return
  }
})

// При любом переходе сбрасываем модалки
router.afterEach(() => {
  const modalStore = useModalStore()
  modalStore.reset()
})

export default router
