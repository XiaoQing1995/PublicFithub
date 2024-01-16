<template>
    <body class="sb-nav-fixed">
        <NavbarTop></NavbarTop>
        <NavbarLeft></NavbarLeft>

        <div id="layoutSidenav">
            <div id="layoutSidenav_content">
                <div class="container-fluid px-4">
                    <h1 class="mt-4 text-center">部門資料</h1>
                    <div class="card">
                        <div class="card-body table-responsive">
                            <button type="submit" class="btn btn-primary mb-3" data-bs-toggle="modal"
                                data-bs-target="#insertModal">新增部門</button>

                            <div class="col-3" style="padding-top: 20px;">
                                <PageSize @pageSizeChange="changeHandler"></PageSize>
                            </div>
                            <div class="col-3">
                                <SearchTextBox @searchInput="inputHandler"></SearchTextBox>
                            </div>
                            <table id="departmentsTable" class="table table-bordered">
                                <thead class="align-middle text-center">
                                    <tr class="table-primary">
                                        <th>部門名稱</th>
                                        <th>修改</th>
                                        <th>刪除</th>
                                    </tr>
                                </thead>
                                <tbody class="align-middle text-center">
                                    <tr v-for="dept in allDepts" :key="dept.deptid">
                                        <td>{{ dept.deptname }}</td>
                                        <td><button type="submit" class="btn btn-outline-secondary" data-bs-toggle="modal"
                                                data-bs-target="#updateModal" @click="inputUpdateData(dept)">修改</button>
                                        </td>
                                        <td><button type="submit" class="btn btn-outline-danger" data-bs-toggle="modal"
                                                data-bs-target="#deleteModal" @click="inputDeleteData(dept)">刪除</button>
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
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">修改部門名稱</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            部門名稱:<input type="text" class="form-control" v-model="updateDepartment.deptname">
                            <span v-if="!updateDepartment.deptname" class="text-danger">必填</span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="submit" class="btn btn-primary" @click="updateData()">修改</button>
                    </div>

                </div>
            </div>
        </div>

        <div class="modal fade" id="insertModal" tabindex="-1" aria-labelledby="insertModal" aria-hidden="true"
            data-bs-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">新增部門</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            部門名稱:<input type="text" class="form-control" v-model="insertDepartment.deptname">
                            <span v-if="!insertDepartment.deptname" class="text-danger">必填</span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="submit" class="btn btn-primary" @click="insertData()">新增</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModal" aria-hidden="true"
            data-bs-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">刪除部門</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            部門名稱:<input type="text" class="form-control" v-model="deleteDepartment.deptname" readonly>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="submit" class="btn btn-primary" @click="deleteData()">刪除</button>
                    </div>
                </div>
            </div>
        </div>
    </body>
</template>

<script setup>
import axios from 'axios';
import { ref, reactive, onMounted } from 'vue'
import NavbarTop from '../components/NavbarTop.vue'
import NavbarLeft from '../components/NavbarLeft.vue'
import Paging from "../components/Paging.vue";
import PageSize from "../components/PageSize.vue";
import SearchTextBox from '../components/SearchTextBox.vue'
import Swal from 'sweetalert2'

const url = import.meta.env.VITE_API_JAVAURL
const insertDepartment = reactive({
    deptname: '',
});
const updateDepartment = reactive({});
const deleteDepartment = reactive({});

//存所有dept資料
const allDepts = ref([])

const totalPages = ref(0);
const datas = reactive({
    start: 0,
    rows: 5,
    name: null,
    sortOrder: "asc",
    sortType: "id",
});



onMounted(() => {
    loadDatas()
});

const loadDatas = async () => {
    //透過get方法呼叫/products/find 傳datas資料

    const response = await axios.post(`${url}/departments/findPageByName`, datas)

    allDepts.value = response.data.list

    // console.log(response.data)

    totalPages.value = +datas.rows === 0 ? 1 : Math.ceil(response.data.count / datas.rows)

}

//paging 由子元件觸發
const clickHandler = page => {
    datas.start = page - 1
    loadDatas()
}

//一頁幾筆資料
const changeHandler = value => {
    datas.rows = value
    datas.start = 0
    loadDatas()
}

//排序
// const sortHandler = type => {
//     datas.sortOrder = datas.sortOrder === "asc" ? "desc" : "asc"
//     datas.sortType = type
//     loadDatas()
// }

//搜尋
const inputHandler = value => {
    datas.name = value
    datas.start = 0
    loadDatas()
}


const inputUpdateData = (data) => {
    Object.assign(updateDepartment, data);
};

const inputDeleteData = (data) => {
    Object.assign(deleteDepartment, data);
};



const insertData = async () => {
    //抓彈出視窗
    var myModalEl = document.getElementById('insertModal')
    var modal = bootstrap.Modal.getInstance(myModalEl)

    //如果沒有值 return 不做
    if (!insertDepartment.deptname.trim()) {
        // alert("請輸入正確資料")
        Swal.fire({
            title: '請輸入正確資料',
            icon: 'warning',
            confirmButtonText: '確定'
        })
        return;
    }

    try {
        const response = await axios.post(`${url}/departments`, { deptname: insertDepartment.deptname })
        if (response.status === 200) {
            loadDatas(); // 重新載入資料
            insertDepartment.deptname = ''; // 清空 insertDeptName
            // alert("新增成功")
            Swal.fire({
                title: '新增成功',
                icon: 'success',
                confirmButtonText: '確定'
            })
        }
    } catch (error) {
        // alert("新增失敗")
        Swal.fire({
            title: '新增失敗',
            icon: 'warning',
            confirmButtonText: '確定'
        })
    } finally {
        //不管是否成功 modal切換
        modal.toggle();
    }
}

const updateData = async () => {
    //抓彈出視窗
    var myModalEl = document.getElementById('updateModal')
    var modal = bootstrap.Modal.getInstance(myModalEl)


    //如果沒有值 return 不做
    if (!updateDepartment.deptid || !updateDepartment.deptname.trim()) {
        // alert("請輸入正確資料")
        Swal.fire({
            title: '請輸入正確資料',
            icon: 'warning',
            confirmButtonText: '確定'
        })
        return;
    }


    try {
        const response = await axios.put(`${url}/departments/${updateDepartment.deptid}`, { deptid: updateDepartment.deptid, deptname: updateDepartment.deptname })

        if (response.status == 200) {
            loadDatas(); // 重新載入資料
            updateDepartment.deptid = ''
            updateDepartment.deptname = ''; // 清空 insertDeptName
            // alert("修改成功")
            Swal.fire({
                title: '修改成功',
                icon: 'success',
                confirmButtonText: '確定'
            })
        }


    } catch (error) {
        // alert("修改失敗")
        Swal.fire({
            title: '修改失敗',
            icon: 'warning',
            confirmButtonText: '確定'
        })
    } finally {
        //不管是否成功 modal切換
        modal.toggle();
    }
}


const deleteData = async () => {
    //抓彈出視窗
    var myModalEl = document.getElementById('deleteModal')
    var modal = bootstrap.Modal.getInstance(myModalEl)

    // 如果沒有值 return 不做
    if (!deleteDepartment.deptname) {
        return;
    }

    try {
        const response = await axios.delete(`${url}/departments/${deleteDepartment.deptid}`)

        if (response.status == 200) {
            loadDatas(); // 重新載入資料
            deleteDepartment.deptid = ''
            deleteDepartment.deptname = ''; // 清空 insertDeptName
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
    } finally {
        //不管是否成功 modal切換
        modal.toggle();
    }
}

</script>

<style></style>