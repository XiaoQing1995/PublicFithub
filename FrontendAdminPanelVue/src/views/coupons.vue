<template>
  <body class="sb-nav-fixed">
    <NavbarTop></NavbarTop>
    <NavbarLeft></NavbarLeft>
    <div id="layoutSidenav">
      <div id="layoutSidenav_content">
        <div class="container-fluid px-4">
          <h1 class="mt-4 text-center">優惠券</h1>
          <div class="card mb-4">
            <div class="card-body table-responsive">
              <button
                class="btn mb-3 btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#insertModal"
              >
                新增優惠券
              </button>
              <table class="table table-bordered">
                <thead class="align-middle text-center">
                  <tr class="table-primary">
                    <th>
                      <button
                        class="btn btn-outline-danger"
                        @click="deleteSelected"
                      >
                        刪除
                      </button>
                    </th>
                    <th>分類</th>
                    <th>名稱</th>
                    <th>優惠碼</th>
                    <th>有效日期</th>
                    <th>使用門檻</th>
                    <th>優惠券折扣</th>
                    <th>已使用/發行總數</th>
                    <th>修改</th>
                  </tr>
                </thead>

                <tbody class="align-middle text-center">
                  <tr
                    v-for="(coupon, couponindex) in coupons"
                    :key="couponindex"
                  >
                    <td>
                      <input
                        type="checkbox"
                        v-model="selectedCoupons"
                        :value="coupon.couponid"
                      />
                    </td>
                    <td>{{ coupon.couponCategories.couponcategoriesname }}</td>
                    <td>{{ coupon.couponname }}</td>
                    <td>{{ coupon.couponcode }}</td>
                    <td>
                      {{ coupon.coupongeneratedate }}至{{
                        coupon.couponenddate
                      }}
                    </td>
                    <td>{{ coupon.couponthreshold }}</td>
                    <td>{{ coupon.coupondiscount }}</td>
                    <td>{{ coupon.couponused }}/{{ coupon.couponceil }}</td>

                    <td>
                      <button
                        class="btn btn-outline-secondary"
                        data-bs-toggle="modal"
                        @click="openUpdateModal(coupon)"
                        data-bs-target="#updateModal"
                      >
                        修改
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改-彈出視窗 -->
    <div
      class="modal fade"
      id="updateModal"
      tabindex="-1"
      aria-labelledby="updateModal"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">更新優惠券</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              名稱<input
                v-model="updateSelectedCoupon.couponname"
                type="text"
                class="form-control"
                required="required"
              />
              <span v-if="!updateSelectedCoupon.couponname" class="text-danger"
                >必填</span
              >
            </div>
            <div class="mb-3">
              優惠碼<input
                v-model="updateSelectedCoupon.couponcode"
                type="text"
                class="form-control"
                required="required"
              />
              <span v-if="!updateSelectedCoupon.couponcode" class="text-danger"
                >必填</span
              >
              <button @click="generateCoupon" class="btn btn-primary">
                生成優惠碼
              </button>
            </div>
            <!-- <div class="mb-3">
                        優惠碼<input v-model="coupon.couponcode" type="text" class="form-control" required="required">
                        <span v-if="!coupon.couponcode" class="text-danger">必填</span>
                        <button @click="generateCoupon" class="btn btn-primary">生成優惠碼</button>
                    </div> -->
            <div class="mb-3">
              生效日期<input
                v-model="updateSelectedCoupon.coupongeneratedate"
                type="date"
                class="form-control"
                required="required"
              />
              <span
                v-if="!updateSelectedCoupon.coupongeneratedate"
                class="text-danger"
                >必填</span
              >
            </div>
            <div class="mb-3">
              結束日期<input
                v-model="updateSelectedCoupon.couponenddate"
                type="date"
                class="form-control"
                required="required"
              />
              <span
                v-if="!updateSelectedCoupon.couponenddate"
                class="text-danger"
                >必填</span
              >
            </div>
            <div class="mb-3">
              使用門檻<input
                v-model="updateSelectedCoupon.couponthreshold"
                type="text"
                class="form-control"
                required="required"
              />
              <span
                v-if="!updateSelectedCoupon.couponthreshold"
                class="text-danger"
                >必填</span
              >
            </div>
            <div class="mb-3">
              折扣金額<input
                v-model="updateSelectedCoupon.coupondiscount"
                type="text"
                class="form-control"
                required="required"
              />
              <span
                v-if="!updateSelectedCoupon.coupondiscount"
                class="text-danger"
                >必填</span
              >
            </div>
            <div class="mb-3">
              已使用量<input
                v-model="updateSelectedCoupon.couponused"
                type="text"
                class="form-control"
                required="required"
              />
              <span v-if="!updateSelectedCoupon.couponused" class="text-danger"
                >必填</span
              >
            </div>
            <div class="mb-3">
              總發行量<input
                v-model="updateSelectedCoupon.couponceil"
                type="text"
                class="form-control"
                required="required"
              />
              <span v-if="!updateSelectedCoupon.couponceil" class="text-danger"
                >必填</span
              >
            </div>
            <!-- <td>{{ coupon.couponused }}/{{ coupon.couponceil }}</td> -->
            <label class="form-label">分類</label>
            <div class="mb-3">
              <select
                v-model="updateSelectedCoupon.couponcategoriesid"
                class="form-control"
                required="required"
              >
                <option value="1">全站可使用</option>
                <option value="2">重量訓練類限定</option>
                <option value="3">有氧訓練類限定</option>
                <option value="4">綜合體能類限定</option>
                <option value="5">瑜珈類限定</option>
                <option value="6">格鬥訓練類限定</option>
                <option value="7">舞蹈類限定</option>
                <option value="8">伸展類限定</option>
              </select>
              <span
                v-if="!updateSelectedCoupon.couponcategoriesid"
                class="text-danger"
                >必填</span
              >
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" @click="updateCoupon">
              送出
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增-彈出視窗 -->
    <div
      class="modal fade"
      id="insertModal"
      tabindex="-1"
      aria-labelledby="insertModal"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">新增優惠券</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              名稱<input
                v-model="coupon.couponname"
                type="text"
                class="form-control"
                required="required"
              />
              <span v-if="!coupon.couponname" class="text-danger">必填</span>
            </div>
            <div class="mb-3">
              優惠碼<input
                v-model="coupon.couponcode"
                type="text"
                class="form-control"
                required="required"
              />
              <span v-if="!coupon.couponcode" class="text-danger">必填</span>
              <button @click="generateCoupon" class="btn btn-primary">
                生成優惠碼
              </button>
            </div>
            <div class="mb-3">
              生效日期<input
                v-model="coupon.coupongeneratedate"
                type="date"
                class="form-control"
                required="required"
              />
              <span v-if="!coupon.coupongeneratedate" class="text-danger"
                >必填</span
              >
            </div>
            <div class="mb-3">
              結束日期<input
                v-model="coupon.couponenddate"
                type="date"
                class="form-control"
                required="required"
              />
              <span v-if="!coupon.couponenddate" class="text-danger">必填</span>
            </div>
            <div class="mb-3">
              使用門檻<input
                v-model="coupon.couponthreshold"
                type="text"
                class="form-control"
                required="required"
              />
              <span v-if="!coupon.couponthreshold" class="text-danger"
                >必填</span
              >
            </div>
            <div class="mb-3">
              折扣金額<input
                v-model="coupon.coupondiscount"
                type="text"
                class="form-control"
                required="required"
              />
              <span v-if="!coupon.coupondiscount" class="text-danger"
                >必填</span
              >
            </div>
            <div class="mb-3">
              發行張數<input
                v-model="coupon.couponceil"
                type="text"
                class="form-control"
                required="required"
              />
              <span v-if="!coupon.couponceil" class="text-danger">必填</span>
            </div>

            <label class="form-label">分類</label>
            <div class="mb-3">
              <select
                v-model="coupon.couponcategoriesid"
                class="form-control"
                required="required"
              >
                <option value="1">全站可使用</option>
                <option value="2">重量訓練類限定</option>
                <option value="3">有氧訓練類限定</option>
                <option value="4">綜合體能類限定</option>
                <option value="5">瑜珈類限定</option>
                <option value="6">格鬥訓練類限定</option>
                <option value="7">舞蹈類限定</option>
                <option value="8">伸展類限定</option>
              </select>
              <span v-if="!coupon.couponcategoriesid" class="text-danger"
                >必填</span
              >
            </div>

            <!-- 教室狀態
                    <div class="mb-3">
                        <select v-model="classroom.classroomStatus" class="form-control">
                            <option value="開放">開放</option>
                            <option value="關閉">關閉</option>
                            <option value="維修中">維修中</option>
                        </select>
                        <span v-if="!classroom.classroomStatus" class="text-danger">必填</span>
                    </div> -->
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" @click="insertCoupon">
              送出
            </button>
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
const URL = import.meta.env.VITE_API_JAVAURL;

//建立優惠券物件
const coupon = reactive({
  couponcategoriesid: "",
  couponname: "",
  couponstate: "",
  coupongeneratedate: "",
  couponenddate: "",
  couponcode: "",
  couponamount: "",
  couponceil: "",
  coupondiscount: "",
  couponused: "",
  couponthreshold: "",
});

const coupons = ref([]); // 儲存SelectAll的優惠券
const selectedCoupons = ref([]); // 儲存選中的 CouponID
const updateSelectedCoupon = reactive({}); // 儲存要修改的優惠券資料(預設值)

//生成優惠碼按鈕
const generateCoupon = () => {
  coupon.couponcode = generateRandomCouponCode();
  updateSelectedCoupon.couponcode = generateRandomCouponCode();
};

function generateRandomCouponCode() {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let couponCode = "";

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    couponCode += charset.charAt(randomIndex);
  }

  return couponCode;
}

// 将選中的資料複製到 updateSelectedCoupon
const openUpdateModal = (coupon) => {
  Object.assign(updateSelectedCoupon, coupon);
};

// 從伺服器獲取 JSON 格式優惠券資料
const getcoupons = async () => {
  try {
    const response = await axios.get(`${URL}/coupons`); // 替換為實際的 API URL
    coupons.value = response.data; //data為response物件的屬性，通常是返回的JSON格式資料
    console.log(coupons.value);
  } catch (error) {
    console.error("Error getcoupons data:", error);
  }
};

// 新增優惠券
const insertCoupon = async () => {
  try {
    const response = await axios.post(`${URL}/coupons`, coupon, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    //關閉動態框
    const insertModal = document.getElementById("insertModal");
    let getInstanceInsertModal = bootstrap.Modal.getInstance(insertModal);
    getInstanceInsertModal.toggle();

    // 清空輸入的值
    coupon.couponname = "";
    coupon.coupongeneratedate = "";
    coupon.couponenddate = "";
    coupon.couponcode = "";
    coupon.couponamount = "";
    coupon.couponceil = "";
    coupon.coupondiscount = "";
    coupon.couponused = "";
    coupon.couponthreshold = "";
    // let insertfile = document.querySelector('#insertfile')
    // insertfile.value = '';

    // 刷新畫面
    getcoupons();
    alert("成功新增優惠券");
  } catch (error) {
    console.error("Error adding new coupon:", error);
  }
};

// 更新優惠券
const updateCoupon = async () => {
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
    `${URL}/coupons/update`,
    updateSelectedCoupon,
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
  getcoupons();
  alert("成功更新優惠券");
  // } catch (error) {
  //     console.error('Error adding new classroom:', error);
  // }
};

// 刪除多筆
const deleteSelected = async () => {
  const checkDelete = window.confirm("確定要刪除選中的優惠券嗎？");
  if (checkDelete) {
    try {
      // 將選中的 couponId 送到後端進行刪除
      const response = await axios.delete(`${URL}/coupons/delete/multiple`, {
        data: selectedCoupons.value,
      });

      // 刷新資料
      getcoupons();
      selectedCoupons.value = []; // 清空選中的項目
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  }
};

onMounted(() => {
  getcoupons();
});
</script>

<style scoped>
.text-danger {
  font-size: 8px;
}
</style>
