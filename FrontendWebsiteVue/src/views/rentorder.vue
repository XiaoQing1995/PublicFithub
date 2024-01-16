<template>
  <Carousel></Carousel>
  <section class="page-section">
    <div class="container text-center">
      <h1>選擇付款方式</h1>
      <hr class="divider" />
      <div class="row justify-content-center">
        <div class="col-lg-10 col-md-12">
          <table class="table table-bordered align-middle">
            <thead class="table-success">
              <tr>
                <th scope="col"></th>
                <th scope="col">圖片</th>
                <th scope="col">場地</th>
                <th scope="col">日期</th>
                <th scope="col">時段</th>
                <th scope="col">金額</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <img
                    :src="selectedClassroom.classroomPic"
                    style="width: 400px; height: 400px"
                  />
                </td>
                <td>{{ selectedClassroom.classroomName }}</td>
                <td>{{ selectedClassroom.rentdate }}</td>
                <td>{{ selectedClassroom.renttime }}</td>
                <td>$NT {{ selectedClassroom.classroomPrice.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
          <div class="p-2 bg-light border">
            <div class="form-floating">
              <select v-model="payment" class="form-select">
                <option value="0" disabled>選擇付款方式</option>
                <option value="1">信用卡-綠界金流</option>
                <option value="2">LINE PAY</option>
              </select>
              <label for="floatingSelect">Pay with selects</label>
            </div>
          </div>
          <div class="mt-5">
            <button
              type="submit"
              class="btn btn-primary btn-lg"
              @click="cancleRentOrder"
            >
              取消返回
            </button>
            <button
              type="submit"
              class="btn btn-primary btn-lg offset-1"
              @click="paymentMethod(payment)"
            >
              結帳
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useNow, useDateFormat } from "@vueuse/core";
import { useRentOrderStore } from "../stores/rentorder.js";
import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import Carousel from "../components/Carousel.vue";
const url = import.meta.env.VITE_API_JAVAURL;

// 測試:使用query接值
// const id = router.currentRoute.value.query.id;
// const name = router.currentRoute.value.query.name;

// 取得路由物件
const router = useRouter();

// 取得pinia全域
const rentOrderStore = useRentOrderStore();
const { selectedClassroom } = storeToRefs(rentOrderStore);
// console.log(selectedClassroom.value)

// 選擇付款方式
const payment = ref("0");

// 執行選擇的付款方式
function paymentMethod(params) {
  if (params === "0") {
    Swal.fire({
      title: "請選擇付款方式",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "確定",
    });
  } else if (params === "1") {
    insertEcpayOrder();
  } else if (params === "2") {
    insertLineOrder();
  }
}

// 綠界新增訂單
const insertEcpayOrder = async () => {
  try {
    // 金流日期需求格式
    const formatted = useDateFormat(useNow(), "YYYY/MM/DD HH:mm:ss");

    // 建立綠界需要的訂單資訊
    const ecpayRentOrder = reactive({
      rentorderid: "",
      rentorderdate: formatted.value,
      rentamount: selectedClassroom.value.classroomPrice,
      classroomname: selectedClassroom.value.classroomName,
    });

    ecpayRentOrder.rentorderid = selectedClassroom.value.rentOrderid;

    // ecpay請求 會回傳字串form表單
    const ecpayResponse = await axios.post(
      `${url}/ecpay/ecpayCheckout`,
      ecpayRentOrder
    );
    const ecpayCheckout = ecpayResponse.data;
    console.log(ecpayCheckout);

    // 建立一个隱藏的div元素，將表單內容放入
    const hiddenDiv = document.createElement("div");
    hiddenDiv.style.display = "none"; // 隐藏这个元素
    hiddenDiv.innerHTML = ecpayCheckout;

    // 將隱藏的div添加到網頁中
    document.body.appendChild(hiddenDiv);

    // 找到表單元素
    const form = hiddenDiv.querySelector("form");
    if (form) {
      // 觸發表單自動提交
      form.submit();
    } else {
      console.error("找不到表單元素");
    }
  } catch (error) {
    console.error("insertEcpayOrder Error:", error);
  }
};

// LinePay新增訂單
const insertLineOrder = async () => {
  const linePayData = ref(null);

  try {
    // 建立LinePay需要的訂單資訊
    const lineRentOrder = reactive({
      rentorderid: "",
      rentamount: selectedClassroom.value.classroomPrice,
      classroomname: selectedClassroom.value.classroomName,
    });
    lineRentOrder.rentorderid = selectedClassroom.value.rentOrderid;
    // console.log(lineRentOrder)

    // 由後端整理格式  取得line需要的 header內容 以及json字串的訂單內容
    const linepayCheckoutResponse = await axios.post(
      `${url}/linepay/linepayCheckout`,
      lineRentOrder
    );
    linePayData.value = linepayCheckoutResponse.data;
    // console.log(linePayData.value);

    // 開啟付款頁面
    const orderWebUrl = linePayData.value.info.paymentUrl.web;
    // console.log(orderWebUrl);

    window.location.href = orderWebUrl;
  } catch (error) {
    console.error("insertLineOrder Error:", error);
  }
};

// 取消訂單
const cancleRentOrder = async () => {
  try {
    Swal.fire({
      title: "確定要取消訂單嗎？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定",
      cancelButtonText: "取消",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire("已取消訂單!");
        const response = await axios.delete(
          `${url}/rent/delete/${selectedClassroom.value.rentOrderid}`
        );
        // console.log(response.data);
        selectedClassroom.value = null;
        router.back();
      }
    });
  } catch (error) {
    console.error("cancleRentOrder Error:", error);
  }
};

onMounted(() => {});
</script>
