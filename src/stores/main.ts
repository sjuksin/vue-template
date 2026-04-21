import { defineStore } from 'pinia'

interface StoreState {
}

export const useMainStore = defineStore('main', {
  persistedState: {
    persist: true,
  },
  state: (): StoreState => ({
  }),

  getters: {},

  actions: {
    reset () {
      this.$reset()
      localStorage.removeItem(this.$id)
    },
  },
})
