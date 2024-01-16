<script setup>
import axios from "axios";
import { login, googleLogin } from "@/api/login"
import router from "@/router"
import { ref, reactive } from "vue";
import { GoogleLogin, decodeCredential } from 'vue3-google-login'
import Swal from 'sweetalert2'

const url = import.meta.env.VITE_API_JAVAURL

const email = ref("")

const submit = async () => {
    try {
        const response = await axios.post(`${url}/members/forgotpassword/${email.value}`)
        Swal.fire({
            title: '請至信箱收取密碼重設信',
            icon: 'success',
            confirmButtonText: '確定'
        })
        router.push({ name: "login" })
    } catch (error) {
        Swal.fire({
            title: '查無此信箱',
            icon: 'warning',
            confirmButtonText: '確定'
        })
    }

}


const goBack = () => {
router.back();
}

</script>

<template>
    <section class="vh-100 pt-5" style="background-color: #E8E1D4;">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-lg-8">
                    <div class="card" style="border-radius: 1rem;">
                        <div class="row g-0">
                            <div class=" col-md-6 col-lg-5 d-none d-md-block">
                                <img src="../assets/index/other/4.jpg" alt="login form" class="img-fluid"
                                    style="border-radius: 1rem 0 0 1rem;" />
                            </div>
                            <div class="col-md-6 col-lg-7 d-flex align-items-center">
                                <div class="card-body p-4 p-lg-5 text-black">
                                    <h2 class="pb-5" style="letter-spacing: 1px;">忘記密碼</h2>
                                    <div class="mb-4">
                                        <label class="form-label">請輸入信箱</label>
                                        <input type="email" class="form-control form-control-lg" v-model="email"
                                            placeholder="abc123456@example.com" />
                                    </div>
                                    <div class="pt-1 mb-4">
                                        <button class="btn btn-dark btn-lg btn-block" type="button"
                                            @click="goBack">返回</button>
                                        <button class="btn btn-dark btn-lg btn-block ms-1" type="button"
                                            @click="submit()">確認</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
p {
    margin-top: 12px;
    word-break: break-all;
}
</style>
