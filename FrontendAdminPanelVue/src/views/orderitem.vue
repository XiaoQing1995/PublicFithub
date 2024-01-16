<template>
  <body class="sb-nav-fixed">
    <NavbarTop></NavbarTop>
    <NavbarLeft></NavbarLeft>
    <div id="layoutSidenav">
      <div id="layoutSidenav_content">
        <div class="container-fluid px-4">
          <h1 class="mt-4 text-center">訂單項目</h1>
          <div class="card">
            <div class="card-body table-responsive">
              <table class="table table-bordered">
                <thead class="align-middle text-center">
                  <tr class="table-primary">
                    <th>訂單編號</th>
                    <th>課程名稱</th>
                    <th>課程日期/時間</th>
                    <th>上課教室</th>
                    <th>課程價格</th>
                    <th>優惠金額</th>
                  </tr>
                </thead>

                <tbody class="align-middle text-center">
                  <tr v-for="(orderitem, orderitemindex) in orderitems" :key="orderitemindex">
                    <td>{{ orderitem.orderId }}</td>
                    <td>{{ orderitem.classes.course.courseName }}</td>
                    <td>
                      {{ orderitem.classes.classDate }}
                      {{ orderitem.classes.classTime }}
                    </td>
                    <td>{{ orderitem.classes.classroom.classroomName }}</td>
                    <td>{{ orderitem.classes.price }}</td>
                    <td>{{ orderitem.coupon.coupondiscount }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>
<script setup>
import axios from "axios";
import { reactive, ref, onMounted } from "vue";
import NavbarTop from "../components/NavbarTop.vue";
import NavbarLeft from "../components/NavbarLeft.vue";
//建立優惠券物件
const orderitem = reactive({
  itemid: "",
  orderdid: "",
  classid: "",
  couponid: "",
});
// const translateOrderState = (state) => {
//   const stateTranslations = {
//     0: '未付款',
//     1: '已付款'
//     // Add more translations as needed
//   };

//   return stateTranslations[state] || '未知狀態';
// };

const orderitems = ref([]); // 儲存SelectAll的訂單
const selectedOrderss = ref([]); // 儲存選中的 ClassroomID

// 從伺服器獲取 JSON 格式優惠券資料
const getorderitems = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/fithub/order-items"
    ); // 替換為實際的 API URL
    orderitems.value = response.data; //data為response物件的屬性，通常是返回的JSON格式資料
    console.log(orderitems.value);
  } catch (error) {
    console.error("Error getorderss data:", error);
  }
};

// const getCouponCategoryName = (coupon) => {
//       if (coupon.couponCategories) {  // 注意属性名的大小寫
//         return coupon.couponCategories.couponcategoriesname;  // 注意属性名的大小寫
//       }
//       return '未知類別';
//     };

onMounted(() => {
  getorderitems();
});
</script>

<style scoped>
.text-danger {
  font-size: 8px;
}
</style>
