<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from 'axios';
import router from "@/router";
import memberNavBar from "../components/member/memberNavBar.vue";
import Carousel from '../components/Carousel.vue'
import Swal from 'sweetalert2'

const url = import.meta.env.VITE_API_JAVAURL

onMounted(() => {
    // loadDatas()
});

const localStorageEmail = ref({})

const memberData = ref({})

const checkpassword = reactive({
    check: true,
    oldpassword: '',
    newpassword: '',
    againpassword: '',
});

const loadDatas = async () => {
    const response = await axios.get(`${url}/members/byemail/${window.localStorage.getItem("memberemail")}`)
    memberData.value = response.data
    // const response = await axios.post(`${url}/backstageaccounts/findPageByName`, datas)

    // allBackStageAccounts.value = response.data.list
    // allEmps.value = responseEmp.data.list

}

const submit = async () => {
    try {
        const memberid = window.localStorage.getItem("memberid")

        if (!checkpassword.newpassword.trim() ||
            !checkpassword.againpassword.trim() ||
            !checkpassword.check) {
            Swal.fire({
                title: '請輸入資料',
                icon: 'error',
                confirmButtonText: '確定'
            })
            return;
        }

        const response = await axios.put(`${url}/members/changepassword/${memberid}`, checkpassword)
        Swal.fire({
            title: '修改成功',
            icon: 'success',
            confirmButtonText: '確定'
        }).then((result) => {
            if (result.isConfirmed) {
                // 點擊 "確定" 按钮，執行頁面跳转
                router.push({ name: "member" })
            }
        });
    } catch (error) {
        Swal.fire({
            title: '修改失敗',
            icon: 'error',
            confirmButtonText: '確定'
        })
    }
}

const cancel = async () => {
    router.push({ name: "member" })
}

const inputpassword = () => {
    if (checkpassword.newpassword === checkpassword.againpassword) {
        checkpassword.check = true
    } else {
        checkpassword.check = false
    }
}

</script>

<template>
    <Carousel></Carousel>
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-lg-2">
                <memberNavBar></memberNavBar>
            </div>
            <div class="col-lg-8 mydiv">
                <h1 class="text-center">重設密碼</h1>
                <hr>
                <div class="m-3">
                    輸入舊密碼<i class="bi bi-patch-exclamation-fill" title="使用google登入沒有設置過密碼則不用輸入"></i>
                    <span v-if="!checkpassword.oldpassword" class="text-danger">*</span>
                    <input type="password" class="form-control" v-model="checkpassword.oldpassword">
                </div>
                <div class="m-3">
                    輸入新密碼<span v-if="!checkpassword.newpassword" class="text-danger">*</span>
                    <input type="password" class="form-control" v-model="checkpassword.newpassword" @keyup="inputpassword">
                </div>
                <div class="m-3">
                    再次確認密碼<span v-if="!checkpassword.againpassword" class="text-danger">*</span>
                    <input type="password" class="form-control" v-model="checkpassword.againpassword"
                        @keyup="inputpassword">
                    <span v-if="!checkpassword.check" class="text-danger">密碼不相符</span>
                </div>
                <button class="btn  btn-primary m-3" value="儲存" @click="submit">儲存</button>
                <button class="btn  btn-primary m-3 ms-1" value="取消" @click="cancel">返回</button>
            </div>
        </div>
    </div>
</template>



