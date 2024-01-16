<template>
  <body class="sb-nav-fixed">
    <NavbarTop></NavbarTop>
    <NavbarLeft></NavbarLeft>
    <div id="layoutSidenav">
      <div id="layoutSidenav_content">
        <div class="container-fluid px-4">
          <!-- 標題 -->
          <h1 class="mt-4" style="text-align: center">教室場地</h1>
          <div class="card">
            <div class="card-body table-responsive">
              <button class="btn mb-3 btn-primary" data-bs-toggle="modal" data-bs-target="#insertModal">
                新增教室
              </button>
              <table class="table table-bordered">
                <thead class="align-middle text-center">
                  <tr class="table-primary">
                    <th>
                      <button class="btn btn-outline-danger" @click="deleteSelected">
                        刪除
                      </button>
                    </th>
                    <th>教室名稱</th>
                    <th>容納人數</th>
                    <th>設備介紹</th>
                    <th>租借價格</th>
                    <th>教室狀態</th>
                    <th>教室圖片</th>
                    <th>修改</th>
                  </tr>
                </thead>

                <tbody class="align-middle text-center">
                  <tr v-for="(classroom, classroomindex) in classrooms" :key="classroomindex">
                    <td>
                      <input type="checkbox" v-model="selectedClassrooms" :value="classroom.classroomId" />
                    </td>
                    <td>{{ classroom.classroomName }}</td>
                    <td>{{ classroom.classroomCapacity }}</td>
                    <td>{{ classroom.classroomDescription }}</td>
                    <td>{{ classroom.classroomPrice }}</td>
                    <td>{{ classroom.classroomStatus }}</td>
                    <td>
                      <img :src="classroom.classroomPic" style="width: 150px; height: 150px" alt="維修中" />
                    </td>
                    <td>
                      <button class="btn btn-outline-secondary" data-bs-toggle="modal" @click="openUpdateModal(classroom)"
                        data-bs-target="#updateModal">
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
    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModal" aria-hidden="true"
      data-bs-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">更新教室</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              教室名稱<input v-model="updateSelectedClassroom.classroomName" type="text" class="form-control" />
              <span v-if="!updateSelectedClassroom.classroomName" class="text-danger">必填</span>
            </div>
            <div class="mb-3">
              容納人數<input v-model="updateSelectedClassroom.classroomCapacity" type="text" class="form-control" />
              <span v-if="!updateSelectedClassroom.classroomCapacity" class="text-danger">必填</span>
            </div>
            <div class="mb-3">
              設備介紹<input v-model="updateSelectedClassroom.classroomDescription" type="text" class="form-control" />
              <span v-if="!updateSelectedClassroom.classroomDescription" class="text-danger">必填</span>
            </div>
            <div class="mb-3">
              租借價格<input v-model="updateSelectedClassroom.classroomPrice" type="text" class="form-control" />
              <span v-if="!updateSelectedClassroom.classroomPrice" class="text-danger">必填</span>
            </div>
            教室狀態
            <div class="mb-3">
              <select v-model="updateSelectedClassroom.classroomStatus" class="form-select">
                <option value="開放">開放</option>
                <option value="關閉">關閉</option>
                <option value="維修中">維修中</option>
              </select>
              <span v-if="!updateSelectedClassroom.classroomStatus" class="text-danger">必填</span>
            </div>
            <div class="mb-3">
              教室圖片
              <input id="updatefile" type="file" class="form-control" accept="image/*" @change="imageUpdate" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" @click="updateClassroom">
              送出
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增-彈出視窗 -->
    <div class="modal fade" id="insertModal" tabindex="-1" aria-labelledby="insertModal" aria-hidden="true"
      data-bs-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">新增教室</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              教室名稱<input v-model="classroom.classroomName" type="text" class="form-control" />
              <span v-if="!classroom.classroomName" class="text-danger">必填</span>
            </div>
            <div class="mb-3">
              容納人數<input v-model="classroom.classroomCapacity" type="text" class="form-control" />
              <span v-if="!classroom.classroomCapacity" class="text-danger">必填</span>
            </div>
            <div class="mb-3">
              設備介紹<input v-model="classroom.classroomDescription" type="text" class="form-control" />
              <span v-if="!classroom.classroomDescription" class="text-danger">必填</span>
            </div>
            <div class="mb-3">
              租借價格<input v-model="classroom.classroomPrice" type="text" class="form-control" />
              <span v-if="!classroom.classroomPrice" class="text-danger">必填</span>
            </div>
            教室狀態
            <div class="mb-3">
              <select v-model="classroom.classroomStatus" class="form-select">
                <option value="開放">開放</option>
                <option value="關閉">關閉</option>
                <option value="維修中">維修中</option>
              </select>
              <span v-if="!classroom.classroomStatus" class="text-danger">必填</span>
            </div>
            <div class="mb-3">
              教室圖片
              <input id="insertfile" type="file" class="form-control" accept="image/*" @change="imageInsert" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" @click="insertClassroom">
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
import Swal from 'sweetalert2'
const url = import.meta.env.VITE_API_JAVAURL

//建立教室物件
const classroom = reactive({
  classroomName: "",
  classroomCapacity: "",
  classroomDescription: "",
  classroomPrice: "",
  classroomStatus: "",
  classroomPic: "",
});

const classrooms = ref([]); // 儲存SelectAll的教室
const selectedClassrooms = ref([]); // 儲存選中的 ClassroomID
const updateSelectedClassroom = reactive({}); // 儲存要修改的教室資料(預設值)

// 将選中的教室資料複製到 updateSelectedClassroom
const openUpdateModal = (classroom) => {
  Object.assign(updateSelectedClassroom, classroom);

  //清空上傳圖片欄位
  let updatefile = document.querySelector("#updatefile");
  updatefile.value = "";
};

// 取得圖片轉為BASE64
const imageInsert = (event) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const base64Data = event.target.result;
      classroom.classroomPic = base64Data;
    };
  }
};

// 取得圖片轉為BASE64
const imageUpdate = (event) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const base64Data = event.target.result;
      updateSelectedClassroom.classroomPic = base64Data;
    };
  }
};

// 從伺服器獲取 JSON 格式教室資料
const getclassrooms = async () => {
  try {
    const response = await axios.get(`${url}/classroom/list`); // 替換為實際的 API URL
    classrooms.value = response.data; //data為response物件的屬性，通常是返回的JSON格式資料
    // console.log(classrooms.value);
  } catch (error) {
    console.error("Error getclassroom data:", error);
  }
};

// 新增教室
const insertClassroom = async () => {
  try {
    // 检查是否有任何必填字段为空
    if (
      !classroom.classroomName ||
      !classroom.classroomCapacity ||
      !classroom.classroomDescription ||
      !classroom.classroomPrice ||
      !classroom.classroomStatus
    ) {
      Swal.fire({
        title: '請完成必填欄位',
        icon: 'warning',
        confirmButtonText: '確定'
      })
      return;
    }

    const response = await axios.post(`${url}/classroom/insert`, classroom,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    Swal.fire({
      title: '新增成功',
      icon: 'success',
      confirmButtonText: '確定'
    })

    //關閉動態框
    const insertModal = document.getElementById("insertModal");
    let getInstanceInsertModal = bootstrap.Modal.getInstance(insertModal);
    getInstanceInsertModal.toggle();

    // 清空輸入的值
    classroom.classroomName = "";
    classroom.classroomCapacity = "";
    classroom.classroomDescription = "";
    classroom.classroomPrice = "";
    classroom.classroomStatus = "";
    classroom.classroomPic = "";
    let insertfile = document.querySelector("#insertfile");
    insertfile.value = "";

    // 刷新畫面
    getclassrooms();
  } catch (error) {
    console.error("Error insertClassroom:", error);
  }
};

// 修改教室
const updateClassroom = async () => {
  try {
    // 检查是否有任何必填字段为空
    if (
      !updateSelectedClassroom.classroomName ||
      !updateSelectedClassroom.classroomCapacity ||
      !updateSelectedClassroom.classroomDescription ||
      !updateSelectedClassroom.classroomPrice ||
      !updateSelectedClassroom.classroomStatus
    ) {
      Swal.fire({
        title: '請完成必填欄位',
        icon: 'warning',
        confirmButtonText: '確定'
      })
      return;
    }

    const response = await axios.put(`${url}/classroom/update`, updateSelectedClassroom,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    Swal.fire({
      title: '修改成功',
      icon: 'success',
      confirmButtonText: '確定'
    })

    //關閉動態框
    const updateModal = document.getElementById("updateModal");
    let getInstanceUpdateModal = bootstrap.Modal.getInstance(updateModal);
    getInstanceUpdateModal.toggle();

    // 刷新畫面
    getclassrooms();
  } catch (error) {
    console.error("Error updateClassroom:", error);
  }
};

// 刪除多筆教室
const deleteSelected = async () => {

  Swal.fire({
    title: '確定要刪除選中的教室嗎?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確定',
    cancelButtonText: '取消'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${url}/classroom/delete/multiple`,
          {
            data: selectedClassrooms.value,
          }
        );
        // 刷新資料
        getclassrooms();
        selectedClassrooms.value = []; // 清空選中的項目
        Swal.fire(
          '已刪除',
          '',
          'success'
        )
      } catch (error) {
        console.error('Error deleteSelected rentorders:', error);
      }
    } else {
      Swal.fire(
        '已取消!',
        '',
        'success'
      )
      selectedClassrooms.value = []; // 清空選中的項目
    }
  })
}

onMounted(() => {
  getclassrooms();
});
</script>

<style scoped>
.text-danger {
  font-size: 8px;
}
</style>
