import { defineStore } from 'pinia'

export type ModalId = 'a'

export interface ModalParams {
  class?: string
  handleClose?: () => void
}

interface Modal extends ModalParams {
  id: ModalId
}

interface StoreState {
  current: Modal | null
  queue: Modal[]
}

export const useModalStore = defineStore('modal', {
  state: (): StoreState => ({
    current: null,
    queue: [],
  }),
  getters: {},

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

      const next = this.queue.shift()
      if (next) {
        this.current = next
      } else {
        this.current = null
      }
    }
  },
})
