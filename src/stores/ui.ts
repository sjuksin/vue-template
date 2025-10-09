import { defineStore } from 'pinia'
import { isMobile, isTouchDevice } from '@/extra/utils.common.ts'

interface StoreState {
  isMobile: boolean
  isTouchDevice: boolean
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    isMobile: false,
    isTouchDevice: false,
  } as StoreState),
  actions: {
    init () {
      this.setDeviceParams()

      const isDev = window.location.hostname === 'localhost'
      if (isDev) {
        // В режиме разработки может поменяться тип устройства, отслеживаем это с помощью события resize
        window.addEventListener('resize', () => {
          this.setDeviceParams()
        })
      }
    },
    setDeviceParams () {
      this.isMobile = isMobile()
      this.isTouchDevice = isTouchDevice()
    },
  },
  getters: {
    layoutClass (): string {
      return (this.isMobile ? 'mobile ' : 'desktop ') +
        (this.isTouchDevice ? 'touch ' : 'no-touch ')
    },
    isDesktop (): boolean {
      return !this.isMobile
    },
  }
})
