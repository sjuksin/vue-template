import { defineStore } from 'pinia'

// --------- Modal Types -----------

interface BaseModalParams {
  onClose?: () => void
}

interface Example2Payload {
  count: number
}

/**
 * Карта соответствия type ↔ payload.
 * `void` означает, что у модалки нет payload.
 */
interface ModalPayloads {
  example: void
  example2: Example2Payload
}

export type ModalType = keyof ModalPayloads

export type Modal = {
  [K in ModalType]: {
    type: K
    payload: ModalPayloads[K] extends void ? undefined : ModalPayloads[K]
    params?: BaseModalParams
  }
}[ModalType]

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
     * Использование:
     *  open('type')
     *  open('type', payload)
     *  open('type', payload, { onClose })
     *  open('type', {}, { onClose })       // для void-типов: пустой payload
     */
    open<K extends ModalType> (
      type: K,
      payload?: ModalPayloads[K] extends void ? object : ModalPayloads[K],
      params?: BaseModalParams,
    ): void {
      const modal = { type, payload, params } as Modal

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
      this.current?.params?.onClose?.()

      const next = this.queue.shift()
      if (next) {
        this.current = next
      } else {
        this.current = null
      }
    },

    /**
     * Достаём payload текущей модалки, проверяя что её type совпадает с ожидаемым.
     */
    payloadAs<K extends ModalType> (type: K): ModalPayloads[K] {
      if (this.current?.type !== type) {
        throw new Error(`Modal payloadAs: expected "${type}", got "${this.current?.type}"`)
      }
      return this.current.payload as unknown as ModalPayloads[K]
    },
  },
})
