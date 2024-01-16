<template>
    <body class="bg-secondary">
        <div id="layoutAuthentication">
            <div id="layoutAuthentication_content"
                style="background-image: url(src/assets/indexpic/1.jpg);background-repeat: no-repeat;background-size: cover;">
                <main>
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-4">
                                <div class="card shadow-lg border-0 rounded-lg mt-5">
                                    <div class="card-header">
                                        <h3 class="text-center font-weight-light my-4">登入</h3>
                                    </div>
                                    <div class="card-body">
                                        <div class="form-floating mb-3">
                                            <input class="form-control" id="userAccount" name="account" type="text"
                                                v-model="account" />
                                            <label>帳號</label>
                                        </div>
                                        <div class="form-floating mb-3">
                                            <input class="form-control" id="userPassword" name="password" type="password"
                                                v-model="password" />
                                            <label>密碼</label>
                                        </div>
                                        <div class="text-center">
                                            <input type="button" class="btn btn-primary" id="send" value="Login"
                                                @click="submit()">
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </body>
</template>
<script>
import { login } from "@/api/login"
import router from "@/router"
import Swal from 'sweetalert2'

export default {
    data() {
        return {
            account: "",
            password: ""
        }
    },
    methods: {
        async submit() {
            let res = await login(this.account, this.password)
            if (res.status == 0) {
                router.push({ name: "home" })
            } else {
                // alert("帳號密碼錯誤")
                Swal.fire({
                    title: '帳號密碼錯誤',
                    icon: 'warning',
                    confirmButtonText: '確定'
                })
            }
        }
    }
}
</script>