<template>
  <body class="sb-nav-fixed">
    <NavbarTop></NavbarTop>
    <NavbarLeft></NavbarLeft>

    <div id="layoutSidenav">
      <div id="layoutSidenav_content">
        <div class="container-fluid px-4">
          <h1 class="mt-4 text-center">教練照片</h1>
          <div class="card">
            <div class="card-body table-responsive">
              <div class="col-3">
                <PageSize @pageSizeChange="changeHandler"></PageSize>
              </div>
              <div class="col-3">
                <SearchTextBox @searchInput="inputHandler"></SearchTextBox>
              </div>
              <table id="departmentsTable" class="table table-bordered">
                <thead class="align-middle text-center">
                  <tr class="table-primary">
                    <th>教練編號</th>
                    <th>教練姓名</th>
                    <th>管理照片</th>
                  </tr>
                </thead>
                <tbody class="align-middle text-center">
                  <tr v-for="coach in allCoachs" :key="coach.employeeid">
                    <td>{{ coach.employeeid }}</td>
                    <td>{{ coach.employeename }}</td>
                    <td>
                      <button type="submit" class="btn btn-outline-secondary" data-bs-toggle="modal"
                        data-bs-target="#updateModal" @click="inputUpdateData(coach)">
                        修改
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <Paging :totalPages="totalPages" :thePage="datas.start + 1" @abcClick="clickHandler"></Paging>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModal" aria-hidden="true"
      data-bs-backdrop="static">
      <div class="modal-dialog  modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">修改教練照片</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div>
              <span class="ms-3">教練編號: {{ updateEmp.employeeid }}</span>
              <span class="ms-3">教練姓名: {{ updateEmp.employeename }}</span>
            </div>
            <div>
              <img class="m-3" style="width: 300px ;height: 300px;" v-for="cpic in updateCoachPic"
                :src="`data:image/jpeg;base64,${cpic.cpicfile}`" @click="inputDeleteData(cpic)" />
            </div>
            <span class="text-danger  ms-3">*點擊圖片可刪除</span>
            <div class="mt-3 ms-3">
              <input id="inputImg" type="file" multiple />
            </div>
            <!-- <div class="mb-3">
                            員工編號: {{ updateBackStageAccount.cpicid }}
                        </div>
                        <div class="mb-3">
                            員工姓名: {{ updateBackStageAccount.employeename }}
                        </div>
                        <div class="mb-3">
                            員工帳號: {{ updateBackStageAccount.employeeid }}
                        </div>
                        <div class="mb-3">
                            員工密碼(輸入即更改為新密碼 未輸入保持原樣):<input type="password" class="form-control"
                                v-model="updateBackStageAccount.cpicfile" @keyup="checkupdatepassword">
                            <span class="text-danger"></span>
                        </div>
                        <div class="mb-3">
                            確認密碼(輸入即更改為新密碼 未輸入保持原樣):<input type="password" class="form-control"
                                v-model="updateagainpassword.password" @keyup="checkupdatepassword">
                            <span v-if="!updateagainpassword.check" class="text-danger">密碼不相符</span><br>

                        </div>
                        <div class="mb-3">
                            權限等級:
                            <select v-model="updateBackStageAccount.loa">
                                <option v-for="loa in 5" :key="loa" :value="loa">{{ loa }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="submit" class="btn btn-primary" @click="updateData()">修改</button>
                    </div> -->
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script setup>
import axios from "axios";
import { ref, reactive, onMounted } from "vue";
import NavbarTop from "../components/NavbarTop.vue";
import NavbarLeft from "../components/NavbarLeft.vue";
import Paging from "../components/Paging.vue";
import PageSize from "../components/PageSize.vue";
import SearchTextBox from "../components/SearchTextBox.vue";
import Swal from 'sweetalert2'

const url = import.meta.env.VITE_API_JAVAURL;
const insertCoachPic = reactive({
  cpicid: "",
  employeeid: "",
  cpicfile: "",
});

const updateCoachPic = reactive({});
const deleteCoachPic = reactive({});

const allCoachs = ref([]);

const updateEmp = ref([]);

const totalPages = ref(0);
const datas = reactive({
  start: 0,
  rows: 5,
  name: null,
  sortOrder: "asc",
  sortType: "id",
});

const selectedFile = ref(null);

const loadDatas = async () => {
  const responseCoachs = await axios.post(`${url}/employees/findCoachPageByName`, datas);

  allCoachs.value = responseCoachs.data.list;

  // 計算總共幾頁
  totalPages.value =
    +datas.rows === 0 ? 1 : Math.ceil(responseCoachs.data.count / datas.rows);
};

onMounted(() => {
  loadDatas();

  var inputImg = document.getElementById("inputImg");

  inputImg.addEventListener("change", async function (e) {
    selectedFile.value = e.target.files;
    try {
      await uploadImage()
      let inputImg = document.getElementById("inputImg");
      inputImg.value = '';
    } catch (error) { }
  });
});

//paging 由子元件觸發
const clickHandler = (page) => {
  datas.start = page - 1;
  loadDatas();
};

//一頁幾筆資料
const changeHandler = (value) => {
  datas.rows = value;
  datas.start = 0;
  loadDatas();
};

//排序
const sortHandler = (type) => {
  datas.sortOrder = datas.sortOrder === "asc" ? "desc" : "asc";
  datas.sortType = type;
  loadDatas();
};

//搜尋
const inputHandler = (value) => {
  datas.name = value;
  datas.start = 0;
  loadDatas();
};

// 點擊修改時觸發 帶入該筆資料
const inputUpdateData = async (emp) => {
  for (const key in updateCoachPic) {
    delete updateCoachPic[key];
  }
  updateEmp.value = emp;
  const responseCoachPics = await axios.get(`${url}/coachpics/byemp/${emp.employeeid}`);
  Object.assign(updateCoachPic, responseCoachPics.data);

};

const uploadImage = async () => {

  if (!selectedFile.value || selectedFile.value.length === 0) {
    return;
  }

  for (let i = 0; i < selectedFile.value.length; i++) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result;
      const jsonPayload = {
        employeeid: updateEmp.value.employeeid,
        cpicfile: base64Image,
      };

      try {
        const response = await axios.post(`${url}/coachpics`, jsonPayload);
        inputUpdateData(updateEmp.value)
      } catch (error) {
        console.error(error);
      }
    };

    reader.readAsDataURL(selectedFile.value[i]);
  }
};

// // 點擊刪除時觸發 帶入該筆資料
const inputDeleteData = (data) => {
  Object.assign(deleteCoachPic, data);
  let deletecheck = confirm('是否刪除')
  if (deletecheck) {
    deleteData()
  }
};

const deleteData = async () => {
  //抓彈出視窗

  //如果沒有值 return 不做
  try {
    const response = await axios.delete(`${url}/coachpics/${deleteCoachPic.cpicid}`)

    if (response.status == 200) {
      datas.start = 0;
      datas.name = "";

      loadDatas(); // 重新載入資料
      inputUpdateData(updateEmp.value)
      // alert("刪除成功")
      Swal.fire({
        title: '刪除成功',
        icon: 'success',
        confirmButtonText: '確定'
      })
    }

  } catch (error) {
    // alert("刪除失敗")
    Swal.fire({
      title: '刪除失敗',
      icon: 'warning',
      confirmButtonText: '確定'
    })
  }

}
</script>
