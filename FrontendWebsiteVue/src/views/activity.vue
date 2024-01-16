<template>
    <!-- 輪播圖 -->
    <div class="masthead">
        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"
                    aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                    aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                    aria-label="Slide 3"></button>
            </div>
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img src="../assets/index/classroom/攀岩教室.jpg" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                    <img src="../assets/index/classroom/有氧大教室.jpg" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                    <img src="../assets/index/classroom/空中瑜珈.jpg" class="d-block w-100" alt="...">
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </div>

    <section class="page-section" id="team">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 mybg-light" style="padding-left: 100px;padding-right: 100px;">
                    <div class="text-center">
                        <h1>{{ activityDeatil.activityname }}</h1>
                        <h2>{{ activityDeatil.activitydate }}</h2>
                    </div>
                    <div class="col-lg-8 offset-md-2" id="activityDeatil">
                    </div>
                    <hr />
                    <div class="text-center">
                        <button class="btn btn-primary" @click="goBack">返回首頁</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
  
<script setup>
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, reactive } from 'vue';
const url = import.meta.env.VITE_API_JAVAURL

// 測試:使用query接值
const router = useRouter();
const activityid = router.currentRoute.value.query.activityid;

//取得活動內容
// const activityDescription = ref([])
const activityDeatil = ref({});


const getActivityDeatil = async () => {
    try {
        const response = await axios.get(`${url}/activity/findDescriptionDateNameById/${activityid}`);
        activityDeatil.value = response.data;

        const activityDeatilDiv = document.getElementById('activityDeatil');
        

        // 將activityDescription的内容設置為<div>的innerHTML
        activityDeatilDiv.innerHTML = activityDeatil.value.activitydescription;

        const dynamicParagraph = activityDeatilDiv.querySelector('img');
        if (dynamicParagraph) {
            dynamicParagraph.style.width = '100%'; 
            dynamicParagraph.style.height = '100%'; 
        }
       
    } catch (error) {
        console.error('Error:', error);
    }
};

const goBack = () => {
    router.push({
        path: "/",
    });
}

onMounted(async () => {
    await getActivityDeatil();
});
</script>

<style scoped></style>