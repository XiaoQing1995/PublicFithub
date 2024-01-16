import { createPinia, defineStore  } from 'pinia';

const pinia = createPinia();

export const useMyStore = defineStore('myStore', {
  state: () => ({
    message: '',
  }),
  actions: {
    setMessage(newMessage) {
      this.message = newMessage;
    },
  },
});
