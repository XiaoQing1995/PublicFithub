import { ref } from "vue";
import { defineStore } from "pinia";

export const useCartStore = defineStore(
  "cart",
  () => {
    // 用setup的方式定義
    const courseCartStore = ref([]);
    return { courseCartStore };
  },
  {
    persist: [
      {
        paths: ["courseCartStore"],
        storage: localStorage,
      },
    ],
  }
);

export const useWishlistStore = defineStore(
  "wishlist",
  () => {
    // 用setup的方式定義
    const courseWishlistStore = ref([]);
    return { courseWishlistStore };
  },
  {
    persist: [
      {
        paths: ["courseWishlistStore"],
        storage: localStorage,
      },
    ],
  }
);
