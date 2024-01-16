<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarTop from "./components/NavbarTop.vue";
import NavbarLeft from "./components/NavbarLeft.vue";
import "bootstrap-icons/font/bootstrap-icons.css";

import { RouterLink, RouterView } from "vue-router";
import { ref, onMounted } from "vue";

const isLogin = ref([]);

onMounted(() => {
  isLogin.value = window.localStorage.getItem("isLogin");
  // console.log("isLogin App:" + isLogin.value);
});
</script>

<template>
  <router-view></router-view>
</template>

<style></style>
