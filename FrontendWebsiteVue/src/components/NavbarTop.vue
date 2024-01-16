<template>
  <!-- navbar-->
  <nav class="navbar navbar-expand-lg navbar-light fixed-top mynav" :id="navId">
    <div class="container px-4 px-lg-5">
      <router-link class="navbar-brand" to="/">Fithub</router-link>
      <button class="navbar-toggler navbar-toggler-right" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ms-auto my-2 my-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/course/0">課程</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/rent">場地租借</router-link>
          </li>
          <li class="nav-item" v-if="!isLogin">
            <router-link class="nav-link" to="/login"><i class="bi bi-person-fill"></i>會員登入</router-link>
          </li>
          <li class="nav-item dropdown" v-if="isLogin">
            <a class="nav-link dropdown-toggle" href="#" id="dropdownMenuLink" role="button" data-bs-toggle="dropdown"
              aria-expanded="false">
              <i class="bi bi-person-fill"></i>
              {{ membername }}
            </a>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li>
                <router-link class="dropdown-item" to="/member">會員專區</router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/login" @click="logout">登出</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
/*
  imports
*/
import router from "@/router";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useWishlistStore } from "../stores/courseStore";

const isLogin = ref();
const membername = ref();
const navId = ref(null); // 定义navId变量

const wishlistStore = useWishlistStore();
const { courseWishlistStore } = storeToRefs(wishlistStore);

const logout = () => {
  window.localStorage.setItem("isLogin", "");
  window.localStorage.setItem("token", "");
  window.localStorage.setItem("memberid", "");
  window.localStorage.setItem("memberemail", "");
  window.localStorage.setItem("membername", "");
  courseWishlistStore.value = []; // 清空願望清單
};

router.beforeResolve((to) => {
  isLogin.value = window.localStorage.getItem("isLogin") === "true";
  membername.value = localStorage.getItem("membername");
});

onMounted(() => {
  isLogin.value = window.localStorage.getItem("isLogin") === "true";
  // 检查是否是首页
});

router.afterEach((to, from) => {
  // 检查是否是首页
  if (to.name === "home") {
    navId.value = "mainNav"; // 设置 ID
  } else {
    navId.value = null; // 清除 ID
  }
});
</script>
