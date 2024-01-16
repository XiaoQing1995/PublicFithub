<template>
  <!-- 購物車圓形button+右上商品數 -->
  <div class="fixed-cart">
    <RouterLink to="/cart">
      <button class="btn btn-primary btn-circle position-relative">
        <i type="button" class="bi bi-cart2" style="font-size: 30px"></i>
        <span
          class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary"
          >{{ cartItemAmount }}</span
        >
      </button>
    </RouterLink>
  </div>
</template>

<script setup>
/*
  Imports
*/
import { computed } from "vue";
import { useCartStore } from "../../../stores/courseStore.js";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

/*
  Store
*/
const cartStore = useCartStore();
const { courseCartStore } = storeToRefs(cartStore);

/*
  computted for store and localStorage
*/
const cartItemAmount = computed(() => {
  return courseCartStore.value.length;
});
</script>

<style scoped>
.btn-primary {
  --bs-btn-color: #fff;
  --bs-btn-bg: #ffc408;
  --bs-btn-border-color: #fff;
  --bs-btn-hover-bg: #e83015;
  --bs-btn-hover-border-color: #c34e2e;
  --bs-btn-active-bg: #c34e2e;
}

.fixed-cart {
  position: fixed;
  /* width: 200px; */
  /* border: 3px solid #9999CC; */
  bottom: 10%;
  right: 5%;
}

.btn-circle {
  width: 60px;
  height: 60px;
  padding: 6px 0px;
  border-radius: 30px;
  text-align: center;
  font-size: 12px;
  line-height: 1.42857;
}
</style>
