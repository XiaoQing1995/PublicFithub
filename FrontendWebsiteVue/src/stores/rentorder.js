import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useRentOrderStore = defineStore('rentorder', {
  state: () => ({
    selectedClassroom: ref(null)
  }),
  persist: {
    storage: sessionStorage,
  },
})