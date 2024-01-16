<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from 'axios';
import router from "@/router";
import memberNavBar from "../components/member/memberNavBar.vue";
import Carousel from '../components/Carousel.vue'


const url = import.meta.env.VITE_API_JAVAURL

onMounted(() => {
    // loadDatas()
    getorderpage()
});

const localStorageEmail = ref({})

const memberData = ref({})

const orderPage = ref([])
// 分頁 預設5筆資料 第0頁
let row = ref(5);
let date = ref('')
const page = reactive({
    memberid: 0,
    number: 0,
    row: row.value,
    date: date.value
})

const selectedOrderItems = ref([]); // 儲存選中訂單的訂單項目

const changeHandler = (value) => {
    page.row = row.value
    page.date = date.value
    //
    if (value >= 0) {
        page.number = value - 1;
    } else {
        page.number = 0
    }
    getorderpage();
};

// 從伺服器獲取訂單分頁資料
const getorderpage = async () => {
    try {
        page.memberid = parseInt(window.localStorage.getItem("memberid"))
        console.log(page)
        const response = await axios.post('http://localhost:8080/fithub/orders/findpagebymemberid', page); // 替換為實際的 API URL
        orderPage.value = response.data;
        console.log(orderPage.value)

        // // 挑選需要的欄位輸出成檔案
        // xlsxData.value = rentorderPage.value.content.map(rentOrder => ({
        //     rentOrderId: rentOrder.rentorderid,
        //     rentOrderDate: rentOrder.rentorderdate,
        //     memberName: rentOrder.member.membername,
        //     classroomName: rentOrder.classroom.classroomName,
        //     rentDate: rentOrder.rentdate,
        //     rentTime: rentOrder.renttime,
        //     rentStatus: rentOrder.rentstatus,
        // }));

        // console.log(xlsxData.value)

    } catch (error) {
        console.error('Error getrentorder data:', error);
    }
};


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
        alert("修改成功")
    }

}

const cancel = async () => {
    router.push({ name: "member" })
}

const openModalWithOrderItem = (orderId) => {
    getOrderItemsByOrderId(orderId);

    //關閉動態框
    const modal = document.getElementById("updateModal2");
    let getInstanceUpdateModal = bootstrap.Modal.getInstance(modal);
    getInstanceUpdateModal.toggle();
};

const getOrderItemsByOrderId = async (orderId) => {
    try {
        const response = await axios.get(`${url}/order-items/items/${orderId}`);
        console.log("API Response:", response.data); // 檢查 API 的回應是否正確
        selectedOrderItems.value = response.data; // 賦值給selectedOrderItems

        console.log("test");
        console.log(selectedOrderItems.value);
        // let  classes = selectedOrderItems.value.classes
        // let  coupon = selectedOrderItems.value.coupon
        // let  order = selectedOrderItems.value.order.member

        // console.log(classes)
        // console.log(coupon)
        // console.log(order)
    } catch (error) {
        console.error("Error getting order item by order id:", error);
    }
};

</script>

<template>
    <Carousel></Carousel>
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-lg-2">
                <memberNavBar></memberNavBar>
            </div>
            <div class="col-lg-8 mydiv">
                <h1 class="text-center">課程訂單</h1>
                <div class="col-3 mb-3">
                    <select class="form-select" @change="changeHandler(-1)" v-model.number="row">
                        <option value=5 selected>每頁 5 筆資料</option>
                        <option value=10>每頁 10 筆資料</option>
                    </select>
                </div>
                <div class="col-3">
                    <i class="bi bi-patch-question-fill" title="請輸入西元年,年-月,年-月-日(月日請補0)"></i>
                    <input type="search" class="form-control mb-3" @keyup="changeHandler(-1)" v-model="date"
                        placeholder="請輸入訂單日期查詢">
                </div>
                <hr>
                <table id="departmentsTable" class="table table-bordered mt-3">
                    <thead class="align-middle text-center">
                        <tr class="table-success">
                            <th>訂單編號</th>
                            <th>訂單日期</th>
                            <th>付款方式</th>
                            <th>付款狀態</th>
                            <th>詳細資料</th>
                        </tr>
                    </thead>
                    <tbody class="align-middle text-center">
                        <tr v-for="(orders, ordersindex) in orderPage.content" :key="ordersindex">
                            <td>{{ orders.orderId }}</td>
                            <td>{{ orders.orderDate }}</td>
                            <!-- <td>{{ orders.orderTotalAmount }}</td> -->
                            <td>{{ orders.orderPaymentMethod }}</td>
                            <!-- <td>{{ translateOrderState(orders.orderstate) }}</td> -->
                            <td>{{ orders.orderCondition }}</td>
                            <td>
                                <button class="btn btn-outline-danger" data-bs-toggle="modal"
                                    @click="openModalWithOrderItem(orders.orderId)" data-bs-target="#updateModal2">
                                    查看
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <nav>
                    <ul class="pagination pagination-sm">
                        <li class="page-item" v-for="(value, index) in orderPage.totalPages" :key="index">
                            <a class="page-link" :class="{ 'selected-page': value - 1 === orderPage.number }"
                                @click="changeHandler(value)">
                                {{ value }}
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>

    <!-- 詳細資料彈出視窗 -->
    <div class="modal fade" id="updateModal2" tabindex="-1" aria-labelledby="updateModal2" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">詳細資料</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <table class="table">
              <thead class="align-middle text-center">
                <tr class="table-primary">
                  <th>項目編號</th>
                  <th>課程名稱</th>
                  <th>課程日期/時間</th>
                  <th>上課教室</th>
                  <th>課程價格</th>
                  <th>優惠金額</th>
                  <th>總金額</th>
                  <!-- 新增的列 -->
                </tr>
              </thead>
              <tbody class="align-middle text-center">
                <tr v-for="(orderitem, orderitemsindex) in selectedOrderItems" :key="orderitemsindex">
                  <td>{{ orderitem.itemId }}</td>
                  <td>{{ orderitem.classes.course.courseName }}</td>
                  <td>
                    {{ orderitem.classes.classDate }}
                    {{ orderitem.classes.classTime }}
                  </td>
                  <td>{{ orderitem.classes.classroom.classroomName }}</td>
                  <td>{{ orderitem.classes.price }}</td>
                  <td>{{ orderitem.coupon.coupondiscount }}</td>
                  <td>
                    {{
                      orderitem.classes.price - orderitem.coupon.coupondiscount
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
</template>