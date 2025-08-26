import { defineStore } from 'pinia'

export type ModalId = 'a' | 'b'

export interface ModalParams {
  class?: string
  handleClose?: () => void
}

export interface Modal extends ModalParams {
  id: ModalId
}

interface StoreState {
  current: Modal | null
  queue: Modal[]
}

export const useModalStore = defineStore('modal', {
  state: () => ({} as StoreState),

  actions: {
    open (id: ModalId, params: ModalParams = {}): void {
      const modal: Modal = { id, ...params }
      if (!this.current) {
        this.current = modal
      } else {
        this.queue.push(modal)
      }
    },

    /**
     * Закрываем текущий открытый модал, если он есть
     * Если есть ещё модалки в очереди - открываем
     */
    close () {
      if (this?.current?.handleClose) {
        this.current.handleClose()
      }

      if (this.queue.length > 0) {
        this.current = this.queue.shift()! // показываем следующее
      } else {
        this.current = null
      }
    },

    /**
     * Сброс состояния (например, при навигации)
     */
    reset () {
      this.current = null
      this.queue = []
    }
  },
  getters: {}
})
