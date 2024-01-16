<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from 'axios';
import router from "@/router";
import memberNavBar from "../components/member/memberNavBar.vue";
import Carousel from '../components/Carousel.vue'
import Swal from 'sweetalert2'

const url = import.meta.env.VITE_API_JAVAURL

onMounted(() => {
    loadDatas()
});

const localStorageEmail = ref({})

const memberData = ref({})

const loadDatas = async () => {
    const response = await axios.get(`${url}/members/byemail/${window.localStorage.getItem("memberemail")}`)
    memberData.value = response.data
    // const response = await axios.post(`${url}/backstageaccounts/findPageByName`, datas)

    // allBackStageAccounts.value = response.data.list
    // allEmps.value = responseEmp.data.list

}

const submit = async () => {
    const response = await axios.put(`${url}/members/${memberData.value.memberid}`, memberData.value)

    if (response.status == 200) {
        Swal.fire({
            title: '修改成功',
            icon: 'success',
            confirmButtonText: '確定'
        })
    }

}

const cancel = async () => {
    router.push({ name: "member" })
}

</script>

<template>
    <Carousel></Carousel>
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-lg-2 col-md-2">
                <memberNavBar></memberNavBar>
            </div>
            <div class="col-lg-8 col-md-10 mydiv">
                <h1 class="text-center">編輯個人資料</h1>
                <hr>
                <div class="m-3">
                    會員編號: {{ memberData.memberid }}
                </div>
                <div class="m-3">
                    會員姓名: {{ memberData.membername }}
                </div>
                <div class="m-3">
                    信箱: {{ memberData.memberemail }}
                </div>

                <div class="m-3">
                    電話: <input type="text" class="form-control" v-model="memberData.memberphoneno">
                </div>
                <div class="m-3">
                    性別:
                    <input type="radio" name="gender" value="男" v-model="memberData.membergender" />男
                    <input type="radio" name="gender" value="女" v-model="memberData.membergender" />女
                </div>
                <div class="m-3">
                    縣市:<input type="text" class="form-control" v-model="memberData.membercity">
                </div>
                <div class="m-3">
                    地區:<input type="text" class="form-control" v-model="memberData.memberzone">
                </div>
                <div class="m-3">
                    地址:<input type="text" class="form-control" v-model="memberData.memberaddress">
                </div>
                <div class="m-3">
                    生日:<input type="date" class="form-control" v-model="memberData.memberbirthday">
                </div>
                <div class="m-3">
                    帳戶建立日期:{{ memberData.memberaccountsince }}
                </div>
                <button class="btn  btn-primary m-3" @click="submit">儲存</button>
                <button class="btn  btn-primary m-3 ms-1" @click="cancel">返回</button>
            </div>
        </div>
    </div>
</template>