<template>
    <nav class="sb-topnav navbar navbar-expand navbar-dark bg-secondary">
        <router-link class="navbar-brand ps-3" to="/" style="text-align: left">Fithub管理系統</router-link>
        <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" @click="toggleSidebar"><i
                class="fas fa-bars"></i></button>
        <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
            <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li class="nav-item  dropdown">
                    <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown"
                        aria-expanded="false"><i class="fas fa-user fa-fw"></i>{{ userName }}</a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <!-- <li><a class="dropdown-item"    @onclick="logout()">Logout</a></li> -->
                        <li><input type="button" class="dropdown-item" @click="logout()" value="登出"></li>
                    </ul>
                </li>
            </ul>
        </form>
    </nav>
</template>

<script setup>
import router from "@/router"

// 從 localStorage 中取得 username 
const userName = window.localStorage.getItem("username");

function logout() {
    window.localStorage.setItem("isLogin", "")
    window.localStorage.setItem("token", "")
    window.localStorage.setItem("username", "")
    window.localStorage.setItem("loa", "")

    router.push({ name: "login" })
}


const toggleSidebar = () => {
    document.body.classList.toggle('sb-nav-fixed');
    document.body.classList.toggle('sb-sidenav-toggled');
};

</script>
