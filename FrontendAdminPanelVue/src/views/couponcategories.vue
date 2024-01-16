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
              <button class="btn mb-3 btn-primary" data-bs-toggle="modal" data-bs-target="#insertModal">
                新增分類
              </button>
              <table class="table table-bordered">
                <thead class="align-middle text-center">
                  <tr class="table-primary">
                    <th>
                      <button class="btn btn-outline-danger" @click="deleteSelected">
                        刪除
                      </button>
                    </th>
                    <th>分類名稱</th>
                    <th>修改</th>
                  </tr>
                </thead>

                <tbody class="align-middle text-center">
                  <tr v-for="(
                      couponcategories, couponcategoriesindex
                    ) in couponcategoriess" :key="couponcategoriesindex">
                    <td>
                      <input type="checkbox" v-model="selectedCouponcategoriess"
                        :value="couponcategories.couponcategoriesid" />
                    </td>
                    <td>{{ couponcategories.couponcategoriesname }}</td>

                    <td>
                      <button class="btn btn-outline-info" data-bs-toggle="modal"
                        @click="openUpdateModal(couponcategories)" data-bs-target="#updateModal">
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
    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">更新教室</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              分類名稱<input v-model="updateSelectedCouponcategories.couponcategoriesname" type="text" class="form-control"
                required="required" />
              <span v-if="!updateSelectedCouponcategories.couponcategoriesname" class="text-danger">必填</span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" @click="updateCouponcategories">
              送出
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增-彈出視窗 -->
    <div class="modal fade" id="insertModal" tabindex="-1" aria-labelledby="insertModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">新增分類</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              名稱<input v-model="couponcategories.couponcategoriesname" type="text" class="form-control"
                required="required" />
              <span v-if="!couponcategories.couponcategoriesname" class="text-danger">必填</span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" @click="insertCouponcategories">
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
const couponcategories = reactive({
  couponcategoriesname: "",
});

const couponcategoriess = ref([]); // 儲存SelectAll的教室
const selectedCouponcategoriess = ref([]); // 儲存選中的 ClassroomID
const updateSelectedCouponcategories = reactive({}); // 儲存要修改的優惠券資料(預設值)

// 將選中優惠券分類資料複製到 updateSelectedCouponcategories
const openUpdateModal = (couponcategories) => {
  Object.assign(updateSelectedCouponcategories, couponcategories);
};

// 從伺服器獲取 JSON 格式優惠券資料
const getcouponcategoriess = async () => {
  try {
    const response = await axios.get(`${URL}/coupon-categories`); // 替換為實際的 API URL
    couponcategoriess.value = response.data; //data為response物件的屬性，通常是返回的JSON格式資料
  } catch (error) {
    console.error("Error getcouponcategoriess data:", error);
  }
};

// 新增優惠券類型
const insertCouponcategories = async () => {
  try {
    const response = await axios.post(
      `${URL}/coupon-categories`,
      couponcategories,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    //關閉動態框
    const insertModal = document.getElementById("insertModal");
    let getInstanceInsertModal = bootstrap.Modal.getInstance(insertModal);
    getInstanceInsertModal.toggle();

    // 清空輸入的值
    couponcategories.couponcategoriesname = "";

    // let insertfile = document.querySelector('#insertfile')
    // insertfile.value = '';

    // 刷新畫面
    getcouponcategoriess();
  } catch (error) {
    console.error("Error adding new couponcategories:", error);
  }
};

// 更新教室
const updateCouponcategories = async () => {
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
    `${URL}/coupon-categories/update`,
    updateSelectedCouponcategories,
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
  getcouponcategoriess();
  // } catch (error) {
  //     console.error('Error adding new classroom:', error);
  // }
};

// 刪除多筆教室
const deleteSelected = async () => {
  const checkDelete = window.confirm("確定要刪除選中的分類嗎？");
  if (checkDelete) {
    try {
      // 將選中的 ClassroomID 送到後端進行刪除
      const response = await axios.delete(
        `${URL}/coupon-categories/delete/multiple`,
        {
          data: selectedCouponcategoriess.value,
        }
      );

      // 刷新資料
      getcouponcategoriess();
      selectedCouponcategoriess.value = []; // 清空選中的項目
    } catch (error) {
      console.error("Error deleting rent orders:", error);
    }
  }
};

onMounted(() => {
  getcouponcategoriess();
});
</script>

<style scoped>
.text-danger {
  font-size: 8px;
}
</style>
