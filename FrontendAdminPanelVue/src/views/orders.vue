<template>
  <body class="sb-nav-fixed">
    <NavbarTop></NavbarTop>
    <NavbarLeft></NavbarLeft>
    <div id="layoutSidenav">
      <div id="layoutSidenav_content">
        <div class="container-fluid px-4">
          <h1 class="mt-4 text-center">訂單</h1>
          <div class="card">
            <div class="card-body table-responsive">
              <div class="col-3 mb-3">
                <select
                  class="form-select"
                  @change="changeHandler(-1)"
                  v-model.number="row"
                >
                  <option value="5" selected>每頁 5 筆資料</option>
                  <option value="10">每頁 10 筆資料</option>
                </select>
              </div>
              <div class="col-3">
                <i
                  class="bi bi-patch-question-fill"
                  title="請輸入西元年,年-月,年-月-日(月日請補0)"
                ></i>
                <input
                  type="search"
                  class="form-control mb-3"
                  @keyup="changeHandler(-1)"
                  v-model="date"
                  placeholder="請輸入訂單日期查詢"
                />
              </div>
              <!-- <button class="btn mb-3 btn-primary" data-bs-toggle="modal" data-bs-target="#insertModal">
                新增訂單
              </button> -->
              <table class="table table-bordered">
                <thead class="align-middle text-center">
                  <tr class="table-primary">
                    <th>訂單編號</th>
                    <th>訂單日期</th>
                    <th>會員編號</th>
                    <th>會員名稱</th>
                    <!-- <th>總金額</th> -->
                    <th>付款方式</th>
                    <th>付款狀態</th>
                    <!-- <th>訂單狀態</th> -->
                    <!-- <th>修改</th> -->
                    <th>詳細資料</th>
                  </tr>
                </thead>

                <tbody class="align-middle text-center">
                  <tr
                    v-for="(orders, ordersindex) in orderPage.content"
                    :key="ordersindex"
                  >
                    <td>{{ orders.orderId }}</td>
                    <td>{{ orders.orderDate }}</td>
                    <td>{{ orders.member.memberid }}</td>
                    <td>{{ orders.member.membername }}</td>
                    <!-- <td>{{ orders.orderTotalAmount }}</td> -->
                    <td>{{ orders.orderPaymentMethod }}</td>
                    <!-- <td>{{ translateOrderState(orders.orderstate) }}</td> -->
                    <td>{{ orders.orderCondition }}</td>

                    <!-- <td>
                      <button class="btn btn-outline-secondary" data-bs-toggle="modal" @click="openUpdateModal(orders)"
                        data-bs-target="#updateModal">
                        修改
                      </button>
                    </td> -->
                    <td>
                      <button
                        class="btn btn-outline-danger"
                        data-bs-toggle="modal"
                        @click="openModalWithOrderItem(orders.orderId)"
                        data-bs-target="#updateModal2"
                      >
                        查看
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <nav>
                <ul class="pagination pagination-sm">
                  <li
                    class="page-item"
                    v-for="(value, index) in orderPage.totalPages"
                    :key="index"
                  >
                    <a
                      class="page-link"
                      :class="{
                        'selected-page': value - 1 === orderPage.number,
                      }"
                      @click="changeHandler(value)"
                    >
                      {{ value }}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 詳細資料彈出視窗 -->
    <div
      class="modal fade"
      id="updateModal2"
      tabindex="-1"
      aria-labelledby="updateModal2"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">詳細資料</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
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
                <tr
                  v-for="(orderitem, orderitemsindex) in selectedOrderItems"
                  :key="orderitemsindex"
                >
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

    <!-- 修改-彈出視窗 -->
    <!-- <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">更新訂單</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              日期<input v-model="updateSelectedOrders.orderDate" type="date" class="form-control" required="required" />
              <span v-if="!updateSelectedOrders.orderDate" class="text-danger">必填</span>
            </div>
            <div class="mb-3">
              會員編號<input v-model="updateSelectedOrders.memberId" type="text" class="form-control" required="required" />
              <span v-if="!updateSelectedOrders.memberId" class="text-danger">必填</span>
            </div> -->
    <!-- <div class="mb-3">
                        總金額<input v-model="updateSelectedOrders.orderTotalAmount" type="text" class="form-control" required="required">
                        <span v-if="!updateSelectedOrders.orderTotalAmount" class="text-danger">必填</span>
                    </div> -->
    <!-- <div class="mb-3">
              付款方式<input v-model="updateSelectedOrders.orderPaymentMethod" type="text" class="form-control"
                required="required" />
              <span v-if="!updateSelectedOrders.orderPaymentMethod" class="text-danger">必填</span>
            </div>
            <label class="form-label">付款狀態</label>
            <div class="mb-3">
              <select v-model="updateSelectedOrders.orderstate" class="form-control" required="required">
                <option value="0">未付款</option>
                <option value="1">已付款</option>
              </select>
              <span v-if="!updateSelectedOrders.orderstate" class="text-danger">必填</span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" @click="updateOrders">
              送出
            </button>
          </div>
        </div>
      </div>
    </div> -->

    <!-- 新增-彈出視窗 -->
    <!-- <div class="modal fade" id="insertModal" tabindex="-1" aria-labelledby="insertModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">新增訂單</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              日期<input v-model="orders.orderDate" type="date" class="form-control" required="required" />
              <span v-if="!orders.orderDate" class="text-danger">必填</span>
            </div>
            <div class="mb-3">
              會員編號<input v-model="orders.memberId" type="text" class="form-control" required="required" />
              <span v-if="!orders.memberId" class="text-danger">必填</span>
            </div> -->
    <!-- <div class="mb-3">
                        總金額<input v-model="orders.orderTotalAmount" type="text" class="form-control" required="required">
                        <span v-if="!orders.orderTotalAmount" class="text-danger">必填</span>
                    </div> -->
    <!-- <div class="mb-3">
              付款方式<input v-model="orders.orderPaymentMethod" type="text" class="form-control" required="required" />
              <span v-if="!orders.orderPaymentMethod" class="text-danger">必填</span>
            </div>
            <label class="form-label">付款狀態</label>
            <div class="mb-3">
              <select v-model="orders.orderstate" class="form-control" required="required">
                <option value="0">未付款</option>
                <option value="1">已付款</option>
              </select>
              <span v-if="!orders.orderstate" class="text-danger">必填</span>
            </div>
            <label class="form-label">訂單狀態</label>
            <div class="mb-3">
              <select v-model="orders.orderCondition" class="form-control" required="required">
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
              </select>
              <span v-if="!orders.orderCondition" class="text-danger">必填</span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" @click="insertOrders">
              送出
            </button>
          </div>
        </div>
      </div>
    </div> -->
  </body>
</template>

<script setup>
import axios from "axios";
import { reactive, ref, onMounted } from "vue";
import NavbarTop from "../components/NavbarTop.vue";
import NavbarLeft from "../components/NavbarLeft.vue";
const URL = import.meta.env.VITE_API_JAVAURL;

const orderPage = ref([]);
// 分頁 預設5筆資料 第0頁
let row = ref(5);
let date = ref("");
const page = reactive({
  number: 0,
  row: row.value,
  date: date.value,
});

const changeHandler = (value) => {
  page.row = row.value;
  page.date = date.value;
  //
  if (value >= 0) {
    page.number = value - 1;
  } else {
    page.number = 0;
  }
  getorderpage();
};

// 從伺服器獲取訂單分頁資料
const getorderpage = async () => {
  try {
    console.log(page);
    const response = await axios.post(
      "http://localhost:8080/fithub/orders/findallpage",
      page
    ); // 替換為實際的 API URL
    orderPage.value = response.data;
    console.log(orderPage.value);

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
    console.error("Error getrentorder data:", error);
  }
};

// const resInsertCourse = await axios.post(`${URL}/classes`, classes)-
//建立訂單物件
const orders = reactive({
  orderid: "",
  orderdate: "",
  ordercondition: "",
  memberid: "",
  ordertotalamount: "",
  orderpaymentmethod: "",
  orderstate: "",
});
// const translateOrderState = (state) => {
//   const stateTranslations = {
//     0: "未付款",
//     1: "已付款",
//     // Add more translations as needed
//   };

//   return stateTranslations[state] || "未知狀態";
// };

const orderitem = reactive({
  itemid: "",
  orderid: "",
  classid: "",
  couponid: "",
});

const orderitems = ref([]); // 儲存SelectAll的訂單

const orderss = ref([]); // 儲存SelectAll的訂單
const selectedOrderss = ref([]); // 儲存選中的 ClassroomID
const updateSelectedOrders = reactive({}); // 儲存要修改的優惠券資料(預設值)
const selectedOrderItems = ref([]); // 儲存選中訂單的訂單項目

let classes = null;
let coupon = null;
let order = null;

// 将選中的教室資料複製到 updateSelectedCoupon
const openUpdateModal = (orders) => {
  Object.assign(updateSelectedOrders, orders);
};

const getorderitems = async () => {
  try {
    const response = await axios.get(`${URL}/order-items`); // 替換為實際的 API URL
    orderitems.value = response.data; //data為response物件的屬性，通常是返回的JSON格式資料
    console.log(orderitems.value);
  } catch (error) {
    console.error("Error getorderss data:", error);
  }
};

// // 從伺服器獲取 JSON 格式優惠券資料
// const getorderss = async () => {
//   try {
//     const response = await axios.get(`${URL}/orders`); // 替換為實際的 API URL
//     orderss.value = response.data; //data為response物件的屬性，通常是返回的JSON格式資料
//     console.log(orderss.value);
//   } catch (error) {
//     console.error("Error getorderss data:", error);
//   }
// };

const getCouponCategoryName = (coupon) => {
  if (coupon.couponCategories) {
    // 注意属性名的大小寫
    return coupon.couponCategories.couponcategoriesname; // 注意属性名的大小寫
  }
  return "未知類別";
};

// 新增優惠券
const insertOrders = async () => {
  try {
    const response = await axios.post(`${URL}/orders`, orders, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    //關閉動態框
    const insertModal = document.getElementById("insertModal");
    let getInstanceInsertModal = bootstrap.Modal.getInstance(insertModal);
    getInstanceInsertModal.toggle();

    // 清空輸入的值
    // coupon.couponname = '';
    // coupon.coupongeneratedate = '';
    // coupon.couponenddate = '';
    // coupon.couponcode = '';
    // coupon.couponamount = '';
    // coupon.couponceil = '';
    // coupon.coupondiscount = '';
    // coupon.couponused = '';
    // coupon.couponthreshold = '';
    // let insertfile = document.querySelector('#insertfile')
    // insertfile.value = '';

    // 刷新畫面
    getorderpage();
  } catch (error) {
    console.error("Error adding new orders:", error);
  }
};

// 更新訂單
const updateOrders = async () => {
  // try {
  //     // 检查是否有任何必填字段为空
  //     if (!updateSelectedClassroom.classroomName ||
  //         !updateSelectedClassroom.classroomCapacity ||
  //         !updateSelectedClassroom.classroomDescription ||
  //         !updateSelectedClassroom.classroomPrice ||
  //         !updateSelectedClassroom.classroomStatus) {
  //         return;
  //     }

  const response = await axios.put(
    `${URL}/orders/update`,
    updateSelectedOrders,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  //關閉動態框
  const updateModal = document.getElementById("updateModal");
  let getInstanceUpdateModal = bootstrap.Modal.getInstance(updateModal);
  getInstanceUpdateModal.toggle();

  // 刷新畫面
  getorderpage();
  // } catch (error) {
  //     console.error('Error adding new classroom:', error);
  // }
};

const getOrderItemByOrderId = async (orderId) => {
  try {
    const url = `${URL}/order-items/${orderId}`;
    const response = await axios.get(url);
    console.log("API Response:", response.data); // 檢查 API 的回應是否正確
    selectedOrderItems.value = response.data; // 賦值給selectedOrderItems

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

// 多筆
const getOrderItemsByOrderId = async (orderId) => {
  try {
    const url = `${URL}/order-items/items/${orderId}`;
    const response = await axios.get(url);
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

const openModalWithOrderItem = (orderId) => {
  getOrderItemsByOrderId(orderId);

  //關閉動態框
  const modal = document.getElementById("updateModal2");
  let getInstanceUpdateModal = bootstrap.Modal.getInstance(modal);
  getInstanceUpdateModal.toggle();
};

onMounted(() => {
  getorderpage();
});
</script>

<style scoped>
.text-danger {
  font-size: 8px;
}
.pagination li {
  cursor: pointer;
}

.selected-page {
  background-color: lightblue;
}
</style>
