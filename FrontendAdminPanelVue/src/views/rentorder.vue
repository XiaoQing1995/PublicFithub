<template>
    <body class="sb-nav-fixed">
        <NavbarTop></NavbarTop>
        <NavbarLeft></NavbarLeft>
        <div id="layoutSidenav">
            <div id="layoutSidenav_content">
                <div class="container-fluid px-4">
                    <h1 class="mt-4 text-center">場地租借</h1>
                    <div class="card">
                        <div class="card-body table-responsive">
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
                            <button class="btn mb-3 btn-primary" @click="exportXlsx">
                                匯出訂單
                            </button>
                            <table id="table1" class="table table-bordered">
                                <thead class="align-middle text-center">
                                    <tr class="table-primary">
                                        <th>
                                            <button class="btn btn-outline-danger" @click="deleteSelected">刪除</button>
                                        </th>
                                        <th>訂單日期</th>
                                        <th>會員姓名</th>
                                        <th>租借場地</th>
                                        <th>預約日期</th>
                                        <th>時段</th>
                                        <th>租借狀態</th>
                                        <th>修改</th>
                                    </tr>
                                </thead>

                                <tbody class="align-middle text-center">
                                    <tr v-for="(rentOrder, rentorderindex) in rentorderPage.content" :key="rentorderindex">
                                        <td><input type="checkbox" v-model="selectedRentOrderIds"
                                                :value="rentOrder.rentorderid"></td>
                                        <td>{{ rentOrder.rentorderdate }}</td>
                                        <td>{{ rentOrder.member.membername }}</td>
                                        <td>{{ rentOrder.classroom.classroomName }}</td>
                                        <td>{{ rentOrder.rentdate }}</td>
                                        <td>{{ rentOrder.renttime }}</td>
                                        <td>{{ rentOrder.rentstatus }}</td>
                                        <td><button type="submit" class="btn btn-outline-secondary" data-bs-toggle="modal"
                                                data-bs-target="#updateModal"
                                                @click="openUpdateModal(rentOrder)">修改</button></td>
                                    </tr>
                                </tbody>
                            </table>
                            <nav>
                                <ul class="pagination pagination-sm">
                                    <li class="page-item" v-for="(value, index) in rentorderPage.totalPages" :key="index">
                                        <a class="page-link"
                                            :class="{ 'selected-page': value - 1 === rentorderPage.number }"
                                            @click="changeHandler(value)">
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

        <!-- 修改-彈出視窗 -->
        <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModal" aria-hidden="true"
            data-bs-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">修改訂單</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            租借場地:<select class="form-select" v-model="updateId">
                                <option v-for="(classroomNameId, index) in classroomNameIds"
                                    :value="classroomNameId.classroomId">
                                    {{ classroomNameId.classroomName }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            預約日期:<input type="date" class="form-control" required="required"
                                v-model="chooseRentOrder.rentdate">
                        </div>
                        <div class="mb-3">
                            時段:<select class="form-select" v-model="chooseRentOrder.renttime">
                                <option>早上</option>
                                <option>下午</option>
                                <option>晚上</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            租借狀態:<select class="form-select" v-model="chooseRentOrder.rentstatus">
                                <option>未付款</option>
                                <option>已付款</option>
                                <option>取消</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" @click="updateRentOrder" class="btn btn-primary">送出</button>
                    </div>
                </div>
            </div>
        </div>
    </body>
</template>
  
<script setup>
import axios from 'axios'
import { ref, onMounted, reactive } from 'vue'
import NavbarTop from '../components/NavbarTop.vue'
import NavbarLeft from '../components/NavbarLeft.vue'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'
const url = import.meta.env.VITE_API_JAVAURL

const rentorderPage = ref([])
const classroomNameIds = ref([])
const selectedRentOrderIds = ref([]) // 儲存選中的 rentorderid
const xlsxData = ref([]) //儲存匯出xlsx需要的資料
const chooseRentOrder = reactive({})
const updateId = ref()

// 將json資料匯出xlsx檔
function exportXlsx() {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(xlsxData.value)
    XLSX.utils.book_append_sheet(wb, ws, '租借訂單')
    XLSX.writeFile(wb, 'RentOrder.xlsx')
}


// 分頁 預設5筆資料 第0頁
let row = ref(5);
let date = ref('')
const page = reactive({
    number: 0,
    row: row.value,
    date: date.value
})

// 更改顯示幾筆跳回第一頁(避免沒有該頁)
const changeHandler = (value) => {
    page.row = row.value
    page.date = date.value
    //
    if (value >= 0) {
        page.number = value - 1;
    } else {
        page.number = 0
    }
    getrentorderpage();
};

// 取得全部教室名稱ID
const getclassroomNameId = async () => {
    try {
        const response = await axios.get(`${url}/classroom/listName`);
        classroomNameIds.value = response.data;
        console.log(classroomNameIds.value)

    } catch (error) {
        console.error('Error getclassroomNameId:', error);
    }
};

// 將選中的訂單複製到 chooseRentOrder
const openUpdateModal = (rentorder) => {
    Object.assign(chooseRentOrder, rentorder);
    updateId.value = chooseRentOrder.classroom.classroomId
    console.log(chooseRentOrder)
};

// 從伺服器獲取訂單分頁資料
const getrentorderpage = async () => {
    try {

        // console.log(page)
        const response = await axios.post(`${url}/rent/findallpage`, page); // 替換為實際的 API URL
        rentorderPage.value = response.data;
        // console.log(rentorderPage.value)

        // 挑選需要的欄位輸出成檔案
        xlsxData.value = rentorderPage.value.content.map(rentOrder => ({
            rentOrderId: rentOrder.rentorderid,
            rentOrderDate: rentOrder.rentorderdate,
            memberName: rentOrder.member.membername,
            classroomName: rentOrder.classroom.classroomName,
            rentDate: rentOrder.rentdate,
            rentTime: rentOrder.renttime,
            rentStatus: rentOrder.rentstatus,
        }));

        // console.log(xlsxData.value)

    } catch (error) {
        console.error('Error getrentorderpage data:', error);
    }
};


// 修改訂單
const updateRentOrder = async () => {
    try {
        // 检查是否有任何必填字段为空
        if (
            !updateId ||
            !chooseRentOrder.rentdate ||
            !chooseRentOrder.renttime ||
            !chooseRentOrder.rentstatus
        ) {
            Swal.fire({
                title: '請完成必填欄位',
                icon: 'warning',
                confirmButtonText: '確定'
            })
            return;
        }

        // 只保留訂單需要的屬性
        const rentOrderData = reactive({
            rentorderid: chooseRentOrder.rentorderid,
            memberid: chooseRentOrder.memberid,
            classroomid: updateId.value,
            rentorderdate: chooseRentOrder.rentorderdate,
            rentdate: chooseRentOrder.rentdate,
            renttime: chooseRentOrder.renttime,
            rentamount: chooseRentOrder.rentamount,
            rentstatus: chooseRentOrder.rentstatus
        })

        const response = await axios.put(`${url}/rent/update`, rentOrderData,
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
        getrentorderpage();
    } catch (error) {
        console.error("Error updateRentOrder:", error);
    }
};

// 刪除多筆訂單
const deleteSelected = async () => {

    Swal.fire({
        title: '確定要刪除選中的訂單嗎?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定',
        cancelButtonText: '取消'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // 將選中的 rentorderid 送到後端進行刪除
                const response = await axios.delete(`${url}/rent/delete/multiple`, {
                    data: selectedRentOrderIds.value
                });

                // 刷新資料
                getrentorderpage();
                selectedRentOrderIds.value = []; // 清空選中的項目
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
};


onMounted(() => {
    getrentorderpage();
    getclassroomNameId();
});
</script>

<style scoped>
.pagination li {
    cursor: pointer;
}

.selected-page {
    background-color: lightblue;
}
</style>