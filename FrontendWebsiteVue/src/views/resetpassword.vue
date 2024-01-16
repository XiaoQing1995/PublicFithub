<script setup>
import axios from "axios";
import router from "@/router"
import { ref, reactive, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import Swal from 'sweetalert2'

const url = import.meta.env.VITE_API_JAVAURL

const checkpassword = reactive({
    check: true,
    token: '',
    newpassword: '',
    againpassword: '',
});

const submit = async () => {
    try {
        if (!checkpassword.newpassword.trim() ||
            !checkpassword.againpassword.trim()) {
            return;
        }

        if (!checkpassword.check) {
            return;
        }

        const response = await axios.put(`${url}/members/resetPassword`, checkpassword)
        Swal.fire({
            title: '修改成功',
            icon: 'success',
            confirmButtonText: '確定'
        }).then((result) => {
            if (result.isConfirmed) {
                // 點擊 "確定" 按钮，執行頁面跳转
                router.push({ name: "home" })
            }
        });

    } catch (error) {
        Swal.fire({
            title: '修改失敗',
            icon: 'warning',
            confirmButtonText: '確定'
        })
    }
}

const route = useRoute();

onMounted(() => {
    checkpassword.token = route.query.token
})

const inputpassword = () => {
    if (checkpassword.newpassword === checkpassword.againpassword) {
        checkpassword.check = true
    } else {
        checkpassword.check = false
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
                                <img src="../assets/index/other/4.jpg" alt="login form" class="img-fluid"
                                    style="border-radius: 1rem 0 0 1rem;" />
                            </div>
                            <div class="col-md-6 col-lg-7 d-flex align-items-center">
                                <div class="card-body p-4 p-lg-5 text-black">
                                    <h2 class="pb-5" style="letter-spacing: 1px;">重設密碼</h2>
                                    <div class="mb-3">
                                        輸入新密碼<span v-if="!checkpassword.newpassword" class="text-danger">*</span>
                                        <input type="password" class="form-control" v-model="checkpassword.newpassword"
                                            @keyup="inputpassword">
                                    </div>
                                    <div class="mb-3">
                                        再次確認密碼<span v-if="!checkpassword.againpassword" class="text-danger">*</span>
                                        <input type="password" class="form-control" v-model="checkpassword.againpassword"
                                            @keyup="inputpassword">
                                        <span v-if="!checkpassword.check" class="text-danger">密碼不相符</span>
                                    </div>
                                    <div class="pt-1 mb-4">
                                        <button class="btn btn-dark btn-lg btn-block" type="button"
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
