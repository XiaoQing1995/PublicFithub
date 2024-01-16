<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from 'axios';
import memberNavBar from "../components/member/memberNavBar.vue";
import Carousel from '../components/Carousel.vue'
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
</script>

<template>
    <Carousel></Carousel>
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-lg-2">
                <memberNavBar></memberNavBar>
            </div>
            <div class="col-lg-8 mydiv">
                <h1 class="text-center">會員專區</h1>
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
                    電話: {{ memberData.memberphoneno }}
                </div>
                <div class="m-3">
                    性別: {{ memberData.membergender }}
                </div>
                <div class="m-3">
                    縣市:{{ memberData.membercity }}
                </div>
                <div class="m-3">
                    地區:{{ memberData.memberzone }}
                </div>
                <div class="m-3">
                    地址:{{ memberData.memberaddress }}
                </div>
                <div class="m-3">
                    生日:{{ memberData.memberbirthday }}
                </div>
                <div class="m-3">
                    帳戶建立日期:{{ memberData.memberaccountsince }}
                </div>
            </div>
        </div>
    </div>
</template>


