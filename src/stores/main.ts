import { defineStore } from 'pinia'

interface StoreState {
}

export const useMainStore = defineStore('main', {
  persist: true,
  state: (): StoreState => ({
  }),

  getters: {},

  actions: {},
})
