<script setup>
import axios from "axios";
import { login, googleLogin } from "@/api/login"
import router from "@/router"
import { ref, reactive } from "vue";
import { GoogleLogin, decodeCredential } from 'vue3-google-login'
import Swal from 'sweetalert2'
import GoogleReCaptchaV2 from "../components/member/GoogleReCaptchaV2.vue";


const url = import.meta.env.VITE_API_JAVAURL

const data = ref()

// const callback = (response) => {
//   data.value = response
// }


const recaptcha = ref(Boolean)

const loginData = reactive({
  memberemail: "",
  memberpassword: "",
});

const checkreCaptcha = value => {
  recaptcha.value = JSON.parse(value)
}


const submit = async () => {
  try {
    console.log(!loginData.memberemail.trim())

    if (!loginData.memberemail.trim() || !loginData.memberpassword.trim()) {
      Swal.fire({
        title: '請輸入帳號密碼',
        icon: 'error',
        confirmButtonText: '確定'
      })
      return
    }


    if (recaptcha.value == true) {
      let res = await login(loginData.memberemail, loginData.memberpassword)
      if (res.status == 0) {
        router.push({ name: "home" })
      } else {
        Swal.fire({
          title: '帳號密碼錯誤',
          icon: 'error',
          confirmButtonText: '確定'
        })
        return
      }
    } else {
      Swal.fire({
        title: '請先驗證',
        icon: 'error',
        confirmButtonText: '確定'
      })
    }

  } catch (error) {

  }
}

const callback = async (response) => {
  // This callback will be triggered when the user selects or login to
  // his Google account from the popup

  const userData = decodeCredential(response.credential)

  console.log(userData)

  let res = await googleLogin(userData.email, userData.name)
  if (res.status == 0) {
    router.push({ name: "home" })
  }
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
                <img src="../assets/index/other/4.jpg" alt="login form" class="myimg-full"
                  style="border-radius: 1rem 0 0 1rem;" />
              </div>
              <div class="col-md-6 col-lg-7 d-flex align-items-center">
                <div class="card-body p-4 p-lg-5 text-black">
                  <h2 class="pb-5" style="letter-spacing: 1px;">Sign into your account</h2>
                  <div class="mb-4">
                    <label class="form-label">Email address</label>
                    <input type="email" class="form-control form-control-lg" v-model="loginData.memberemail"
                      placeholder="abc123456@example.com" />
                  </div>
                  <label class="form-label">Password</label>
                  <div class="form-outline mb-4">
                    <input type="password" class="form-control form-control-lg" v-model="loginData.memberpassword" />
                  </div>
                  <GoogleReCaptchaV2 @recaptcha="checkreCaptcha"></GoogleReCaptchaV2>
                  <div class="pt-1 mb-4">
                    <button class="btn btn-dark btn-lg btn-block" type="button" @click="submit">登入</button>
                  </div>
                  <a class="small text-muted"><router-link to="/forgotpassword">忘記密碼</router-link></a>
                  <p class="pb-lg-2 mb-5">還沒有會員?<router-link to="/register">立即註冊</router-link>
                  <div>
                    <GoogleLogin :callback="callback"></GoogleLogin>
                  </div>
                  </p>
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
