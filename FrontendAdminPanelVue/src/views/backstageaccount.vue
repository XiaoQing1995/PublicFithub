<template>
    <body class="sb-nav-fixed">
        <NavbarTop></NavbarTop>
        <NavbarLeft></NavbarLeft>

        <div id="layoutSidenav">
            <div id="layoutSidenav_content">
                <div class="container-fluid px-4">
                    <h1 class="mt-4 text-center">後台帳戶</h1>
                    <div class="card">
                        <div class="card-body table-responsive">
                            <div class="col-3">
                                <PageSize @pageSizeChange="changeHandler"></PageSize>
                            </div>
                            <div class="col-3">
                                <SearchTextBox @searchInput="inputHandler"></SearchTextBox>
                            </div>
                            <button type="submit" class="btn btn-primary mb-3" data-bs-toggle="modal"
                                data-bs-target="#insertModal">新增帳戶</button>
                            <table id="departmentsTable" class="table table-bordered">
                                <thead class="align-middle text-center">
                                    <tr class="table-primary">
                                        <th>員工編號</th>
                                        <th>員工姓名</th>
                                        <th>員工帳號</th>
                                        <th>權限等級</th>
                                        <th>修改</th>
                                        <th>刪除</th>
                                    </tr>
                                </thead>
                                <tbody class="align-middle text-center">
                                    <tr v-for="ba in allBackStageAccounts" :key="ba.employeeid">
                                        <td>{{ ba.employeeid }}</td>
                                        <td>{{ ba.employeename }}</td>
                                        <td>{{ ba.employeeaccount }}</td>
                                        <td>{{ ba.loa }}</td>
                                        <td><button type="submit" class="btn btn-outline-secondary" data-bs-toggle="modal"
                                                data-bs-target="#updateModal" @click="inputUpdateData(ba)">修改</button>
                                        </td>
                                        <td><button type="submit" class="btn btn-outline-danger" data-bs-toggle="modal"
                                                data-bs-target="#deleteModal" @click="inputDeleteData(ba)">刪除</button>
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
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">修改後台帳戶</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            員工編號: {{ updateBackStageAccount.employeeid }}
                        </div>
                        <div class="mb-3">
                            員工姓名: {{ updateBackStageAccount.employeename }}
                        </div>
                        <div class="mb-3">
                            員工帳號: {{ updateBackStageAccount.employeeaccount }}
                        </div>
                        <div class="mb-3">
                            員工密碼(輸入即更改為新密碼 未輸入保持原樣):<input type="password" class="form-control"
                                v-model="updateBackStageAccount.employeepassword" @keyup="checkupdatepassword">
                            <span class="text-danger"></span>
                        </div>
                        <div class="mb-3">
                            確認密碼(輸入即更改為新密碼 未輸入保持原樣):<input type="password" class="form-control"
                                v-model="updateagainpassword.password" @keyup="checkupdatepassword">
                            <span v-if="!updateagainpassword.check" class="text-danger">密碼不相符</span><br>

                        </div>
                        <div class="mb-3">
                            權限等級:
                            <select class="form-select" v-model="updateBackStageAccount.loa">
                                <option v-for="loa in 3" :key="loa" :value="loa">{{ loa }}
                                </option>
                            </select>
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
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">新增後台帳戶</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            員工:
                            <select class="form-select" v-model="insertBackStageAccount.employeeid">
                                <option v-for="emp in allEmps" :key="emp.employeeid" :value="emp.employeeid">{{
                                    emp.employeeid + " " + emp.employeename }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            員工帳號:<input type="text" class="form-control" v-model="insertBackStageAccount.employeeaccount">
                            <span v-if="!insertBackStageAccount.employeeaccount" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            員工密碼:<input type="password" class="form-control"
                                v-model="insertBackStageAccount.employeepassword" @keyup="checkinsertpassword">
                            <span v-if="!insertBackStageAccount.employeepassword" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            確認密碼:<input type="password" class="form-control" v-model="insertagainpassword.password"
                                @keyup="checkinsertpassword">
                            <span v-if="!insertagainpassword.password" class="text-danger">必填</span><br>
                            <span v-if="!insertagainpassword.check" class="text-danger">密碼不相符</span>
                        </div>
                        <div class="mb-3">
                            權限等級:
                            <select class="form-select" v-model="insertBackStageAccount.loa">
                                <option v-for="loa in 3" :key="loa" :value="loa">{{ loa }}
                                </option>
                            </select>
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
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">刪除後台帳戶</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            員工編號: {{ deleteBackStageAccount.employeeid }}
                        </div>
                        <div class="mb-3">
                            員工姓名: {{ deleteBackStageAccount.employeename }}
                        </div>
                        <div class="mb-3">
                            員工帳號: {{ deleteBackStageAccount.employeeaccount }}
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
const insertBackStageAccount = reactive({
    employeeid: '',
    employeeaccount: '',
    employeepassword: '',
    loa: '',
});

const insertagainpassword = reactive({
    check: true,
    password: '',
});

const updateagainpassword = reactive({
    check: true,
    password: '',
});


const updateBackStageAccount = reactive({});
const deleteBackStageAccount = reactive({});

const allBackStageAccounts = ref([])
const allEmps = ref([])

const totalPages = ref(0);
const datas = reactive({
    start: 0,
    rows: 5,
    name: null,
    sortOrder: "asc",
    sortType: "id",
});

const loadDatas = async () => {
    const response = await axios.post(`${url}/backstageaccounts/findPageByName`, datas)
    const responseEmp = await axios.get(`${url}/employees`)


    allBackStageAccounts.value = response.data.list
    allEmps.value = responseEmp.data.list


    // 計算總共幾頁
    totalPages.value = +datas.rows === 0 ? 1 : Math.ceil(response.data.count / datas.rows)

}

onMounted(() => {
    loadDatas()
});

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

//搜尋
const inputHandler = value => {
    datas.name = value
    datas.start = 0
    loadDatas()
}


// 點擊修改時觸發 帶入該筆資料
const inputUpdateData = (data) => {
    Object.assign(updateBackStageAccount, data);
};

// 點擊刪除時觸發 帶入該筆資料
const inputDeleteData = (data) => {
    Object.assign(deleteBackStageAccount, data);
};


const cleardata = () => {
    insertBackStageAccount.employeeid = ''
    insertBackStageAccount.employeeaccount = ''
    insertBackStageAccount.employeepassword = ''
    insertBackStageAccount.loa = ''

    insertagainpassword.check = true
    insertagainpassword.password = ''

    for (const key in updateBackStageAccount) {
        delete updateBackStageAccount[key]
    }

    updateagainpassword.check = true
    updateagainpassword.password = ''
}



const insertData = async () => {
    // //抓彈出視窗
    var myModalEl = document.getElementById('insertModal')
    var modal = bootstrap.Modal.getInstance(myModalEl)

    // //如果沒有值 return 不做
    if (!insertBackStageAccount.employeeid ||
        !insertBackStageAccount.employeeaccount.trim() ||
        !insertBackStageAccount.employeepassword ||
        !insertBackStageAccount.loa) {
        // alert("請輸入資料")
        Swal.fire({
            title: '請輸入資料',
            icon: 'warning',
            confirmButtonText: '確定'
        })
        return;
    }

    if (!insertagainpassword.check) {
        return
    }

    try {
        const response = await axios.post(`${url}/backstageaccounts`, insertBackStageAccount)

        if (response.status == 200) {
            loadDatas(); // 重新載入資料
            // Object.assign(insertEmployee,{})
            // insertEmployee.value = ''; // 清空 insertDeptName
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
        cleardata();
    }
}

const updateData = async () => {
    //抓彈出視窗
    var myModalEl = document.getElementById('updateModal')
    var modal = bootstrap.Modal.getInstance(myModalEl)



    // delete updateEmployee.department
    // delete updateEmployee.jobtitle

    // //如果沒有值 return 不做
    if (!updateBackStageAccount.employeeid ||
        !updateBackStageAccount.employeeaccount.trim() ||
        !updateBackStageAccount.loa) {
        // alert("請輸入正確資料")
        Swal.fire({
            title: '請輸入正確資料',
            icon: 'warning',
            confirmButtonText: '確定'
        })
        return;
    }

    if (!updateagainpassword.check) {
        return
    }

    try {
        const response = await axios.put(`${url}/backstageaccounts/${updateBackStageAccount.employeeaccount}`, updateBackStageAccount)
        if (response.status == 200) {
            loadDatas(); // 重新載入資料
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
        cleardata();
    }
}


const deleteData = async () => {
    //抓彈出視窗
    var myModalEl = document.getElementById('deleteModal')
    var modal = bootstrap.Modal.getInstance(myModalEl)

    //如果沒有值 return 不做
    try {
        const response = await axios.delete(`${url}/backstageaccounts/${deleteBackStageAccount.employeeaccount}`)

        if (response.status == 200) {
            datas.start = 0;
            datas.name = "";

            loadDatas(); // 重新載入資料
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

const checkinsertpassword = () => {
    if (insertBackStageAccount.employeepassword === insertagainpassword.password) {
        insertagainpassword.check = true
    } else {
        insertagainpassword.check = false
    }
}

const checkupdatepassword = () => {
    if (updateBackStageAccount.employeepassword === updateagainpassword.password) {
        updateagainpassword.check = true
    } else {
        updateagainpassword.check = false
    }
}

</script>