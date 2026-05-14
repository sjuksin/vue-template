import { defineStore } from 'pinia'

// --------- Modal Types -----------

interface BaseModalParams {
  className?: string
  handleClose?: () => void
}

/**
 * Usage:
 *  modalStore.payloadAs<Example2Payload>()
 */
export interface Example2Payload {
  count: number
}

export type Modal =
  | BaseModalParams & { type: 'example' }
  | BaseModalParams & { type: 'example2', payload: Example2Payload }

export type ModalType = Modal['type']

// --------- Store -----------

interface StoreState {
  current: Modal | null
  queue: Modal[]
}

export const useModalStore = defineStore('modal', {
  state: (): StoreState => ({
    current: null,
    queue: [],
  }),

  actions: {
    /**
     * Использование
     *  open({ type: 'a', handleClose })
     *  open({ type: 'second', payload })
     */
    open (modal: Modal): void {
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
      this.current?.handleClose?.()

      const next = this.queue.shift()
      if (next) {
        this.current = next
      } else {
        this.current = null
      }
    },

    payloadAs<T> (): T {
      return (this.current as { payload: T }).payload
    }
  },
})
