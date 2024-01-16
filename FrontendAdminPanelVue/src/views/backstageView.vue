<template>
    <body class="sb-nav-fixed">
        <NavbarTop></NavbarTop>
        <NavbarLeft></NavbarLeft>
        <div id="layoutSidenav">
            <div id="layoutSidenav_content">
                <div class="container-fluid px-4">
                    <!-- 標題 -->
                    <h1 class="mt-4 text-center">營業報表</h1>
                    <hr>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="card mb-4">
                                <div class="card-header">
                                    <i class="fas fa-chart-area me-1"></i>
                                    當月營收
                                </div>
                                <Bar v-if="loaded" :options="options" :data="barData" />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="card mb-4">
                                <div class="card-header">
                                    <i class="fas fa-chart-bar me-1"></i>
                                    每月新增會員
                                </div>
                                <Line v-if="loaded" :options="options" :data="lineData" />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="card mb-4">
                                <div class="card-header">
                                    <i class="fas fa-chart-bar me-1"></i>
                                    會員男女比例
                                </div>
                                <Doughnut v-if="loaded" :options="options" :data="doughnutGenderData" />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="card mb-4 ">
                                <div class="card-header">
                                    <i class="fas fa-chart-bar me-1"></i>
                                    會員年齡層
                                </div>
                                <Doughnut v-if="loaded" :options="options" :data="doughnutMemberData" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</template>

<script setup>
import NavbarTop from '../components/NavbarTop.vue'
import NavbarLeft from '../components/NavbarLeft.vue'
import axios from "axios";
import { onMounted, ref, onBeforeMount } from "vue";
const url = import.meta.env.VITE_API_JAVAURL

// 長條圖
import { Bar } from 'vue-chartjs'
// 折線圖
import { Line } from 'vue-chartjs'
import { PointElement, LineElement } from 'chart.js';
// 圓餅圖
import { Doughnut } from 'vue-chartjs'
// 導入圖表模塊
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
// 註冊導入的模塊和元素
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement)

//圖表需使用V-if當資料載入後重新渲染
const loaded = ref(false);
const membergender = ref()
const memberbirthday = ref()

// 從伺服器獲取 JSON 格式教室資料
const getData = async () => {
    try {
        // 男女數據
        const gender = await axios.get(`${url}/members/membergender`);
        membergender.value = gender.data
        doughnutGenderData.datasets[0].data = [membergender.value.male, membergender.value.female]

        // 會員年齡層
        const birthday = await axios.get(`${url}/members/memberbirthday`);
        memberbirthday.value = birthday.data
        doughnutMemberData.datasets[0].data = [memberbirthday.value.age1To24, memberbirthday.value.age25To49, memberbirthday.value.age50To65, memberbirthday.value.age66To100]

        // 每月新增會員
        const memberaccountsince = await axios.get(`${url}/members/memberaccountsince`);
        lineData.datasets[0].data = memberaccountsince.data;

        // 取得租借場地總金額
        const rentamount = await axios.get(`${url}/rent/rentamount`);
        // 每月課程總金額
        const OrdertotalAmount = await axios.get(`${url}/orders/OrdertotalAmount`);
        barData.datasets[0].data = [OrdertotalAmount.data]
        barData.datasets[1].data = [rentamount.data]

        loaded.value = true;
    } catch (error) {
        console.error("Error getData:", error);
    }
};

// 長條圖
const barData = {
    labels: ['9月'],
    datasets: [
        {
            label: '課程',
            backgroundColor: 'rgba(161, 198, 247, 1)',
            borderColor: 'rgb(47, 128, 237)',
            data: []
        }, {
            label: '場地租借',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            data: []
        }
    ]
}

// 折線圖
const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
        {
            label: '會員',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2,
            data: []
        }
    ]
}

// 購課類型圓餅圖
const doughnutGenderData = {
    labels: ['男', '女'],
    datasets: [
        {
            backgroundColor: ['#FFD166', '#06D6A0'],
            data: [10, 20]
        }
    ]
}

// 會員年齡層圓餅圖
const doughnutMemberData = {
    labels: ['1-24歲', '25-49歲', '50-65歲', '66-100歲'],
    datasets: [
        {
            backgroundColor: ['#41B883', '#E46651', '#FFD166', '#9A42E1'],
            data: []
        }
    ]
}

//設定圖表
const options = {
    responsive: true,
    // maintainAspectRatio: true
}


onMounted(() => {
    getData();
});
</script>


<style scoped></style>