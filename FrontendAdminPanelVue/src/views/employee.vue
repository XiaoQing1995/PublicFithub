<template>
    <body class="sb-nav-fixed">
        <NavbarTop></NavbarTop>
        <NavbarLeft></NavbarLeft>

        <div id="layoutSidenav">
            <div id="layoutSidenav_content">
                <div class="container-fluid px-4">
                    <h1 class="mt-4 text-center">員工資料</h1>
                    <div class="card">
                        <div class="card-body table-responsive">
                            <div class="col-3">
                                <PageSize @pageSizeChange="changeHandler"></PageSize>
                            </div>
                            <div class="col-3">
                                <SearchTextBox @searchInput="inputHandler"></SearchTextBox>
                            </div>
                            <button type="submit" class="btn btn-primary mb-3" data-bs-toggle="modal"
                                data-bs-target="#insertModal">新增員工</button>
                            <table id="departmentsTable" class="table table-bordered">
                                <thead class="align-middle text-center">
                                    <tr class="table-primary">
                                        <th>員工編號</th>
                                        <th>姓名</th>
                                        <th>性別</th>
                                        <th>電話</th>
                                        <th>信箱</th>
                                        <th>職稱</th>
                                        <th>修改</th>
                                        <th>刪除</th>
                                    </tr>
                                </thead>
                                <tbody class="align-middle text-center">
                                    <tr v-for="emp in allEmps" :key="emp.employeeid">
                                        <td>{{ emp.employeeid }}</td>
                                        <td>{{ emp.employeename }}</td>
                                        <td>{{ emp.employeegender }}</td>
                                        <td>{{ emp.employeephone }}</td>
                                        <td>{{ emp.employeeemail }}</td>
                                        <td>{{ emp.jobtitlename }}</td>
                                        <td><button type="submit" class="btn btn-outline-secondary" data-bs-toggle="modal"
                                                data-bs-target="#updateModal" @click="inputUpdateData(emp)">修改</button>
                                        </td>
                                        <td><button type="submit" class="btn btn-outline-danger" data-bs-toggle="modal"
                                                data-bs-target="#deleteModal" @click="inputDeleteData(emp)">刪除</button>
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
                        <h5 class="modal-title" id="exampleModalLabel">修改員工資料</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            員工編號:<input type="text" class="form-control" v-model="updateEmployee.employeeid" readonly>
                        </div>
                        <div class="mb-3">
                            姓名:<input type="text" class="form-control" v-model="updateEmployee.employeename">
                            <span v-if="!updateEmployee.employeename" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            信箱:<input type="text" class="form-control" v-model="updateEmployee.employeeemail">
                            <span v-if="!updateEmployee.employeeemail" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            電話:<input type="text" class="form-control" v-model="updateEmployee.employeephone">
                            <span v-if="!updateEmployee.employeephone" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            性別:<select class="form-select" v-model="updateEmployee.employeegender" id="gender">
                                <option value="男">男</option>
                                <option value="女">女</option>
                            </select>
                        </div>
                        <span v-if="!updateEmployee.employeegender" class="text-danger">必填</span>
                        <div class="mb-3">
                            縣市:<input type="text" class="form-control" v-model="updateEmployee.employeecity">
                            <span v-if="!updateEmployee.employeecity" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            地區:<input type="text" class="form-control" v-model="updateEmployee.employeezone">
                            <span v-if="!updateEmployee.employeezone" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            地址:<input type="text" class="form-control" v-model="updateEmployee.employeeaddress">
                            <span v-if="!updateEmployee.employeeaddress" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            部門:
                            <select class="form-select" v-model="updateEmployee.deptid">
                                <option v-for="dept in allDepts" :key="dept.deptid" :value="dept.deptid">{{ dept.deptname }}
                                </option>
                            </select>
                            <span v-if="!updateEmployee.deptid" class="text-danger">必填</span>
                        </div>

                        <div class="mb-3">
                            職稱:
                            <select class="form-select" v-model="updateEmployee.jobtitleid">
                                <option v-for="jobtitle in allJobTitles" :key="jobtitle.jobtitleid"
                                    :value="jobtitle.jobtitleid">{{ jobtitle.jobtitlename }}
                                </option>
                            </select>
                            <span v-if="!updateEmployee.jobtitleid" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            主管:
                            <select class="form-select" v-model="updateEmployee.managerid">
                                <option value="">無</option>
                                <option v-for="manager in allManagers" :key="manager.employeeid"
                                    :value="manager.employeeid">{{ manager.employeename }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            入職時間:<input type="date" class="form-control" v-model="updateEmployee.hiredate">
                            <span v-if="!updateEmployee.hiredate" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            離職時間:<input type="date" class="form-control" v-model="updateEmployee.resigndate">
                        </div>
                        <div class="mb-3">
                            薪資:<input type="text" class="form-control" v-model="updateEmployee.salary">
                            <span v-if="!updateEmployee.salary" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            生日:<input type="date" class="form-control" v-model="updateEmployee.employeebirthday">
                            <span v-if="!updateEmployee.employeebirthday" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            簡介:<textarea class="form-control" v-model="updateEmployee.employeeintroduction"></textarea>
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
                        <h5 class="modal-title" id="exampleModalLabel">新增員工</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <input type="button" value="測試資料" class="btn btn-secondary ms-1" @click="inputTestData" />
                        </div>
                        <div class="mb-3">
                            姓名:<input type="text" class="form-control" v-model="insertEmployee.employeename">
                            <span v-if="!insertEmployee.employeename" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            信箱:<input type="text" class="form-control" v-model="insertEmployee.employeeemail">
                            <span v-if="!insertEmployee.employeeemail" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            電話:<input type="text" class="form-control" v-model="insertEmployee.employeephone">
                            <span v-if="!insertEmployee.employeephone" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            性別:<select class="form-select" v-model="insertEmployee.employeegender" id="gender">
                                <option value="男">男</option>
                                <option value="女">女</option>
                            </select>
                        </div>
                        <span v-if="!insertEmployee.employeegender" class="text-danger">必填</span>
                        <div class="mb-3">
                            縣市:<input type="text" class="form-control" v-model="insertEmployee.employeecity">
                            <span v-if="!insertEmployee.employeecity" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            地區:<input type="text" class="form-control" v-model="insertEmployee.employeezone">
                            <span v-if="!insertEmployee.employeezone" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            地址:<input type="text" class="form-control" v-model="insertEmployee.employeeaddress">
                            <span v-if="!insertEmployee.employeeaddress" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            部門:
                            <select class="form-select" v-model="insertEmployee.deptid">
                                <option v-for="dept in allDepts" :key="dept.deptid" :value="dept.deptid">{{ dept.deptname }}
                                </option>
                            </select>
                            <span v-if="!insertEmployee.deptid" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            職稱:
                            <select class="form-select" v-model="insertEmployee.jobtitleid">
                                <option v-for="jobtitle in allJobTitles" :key="jobtitle.jobtitleid"
                                    :value="jobtitle.jobtitleid">{{ jobtitle.jobtitlename }}
                                </option>
                            </select>
                            <span v-if="!insertEmployee.jobtitleid" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            主管:
                            <select class="form-select" v-model="insertEmployee.managerid">
                                <option value="">無</option>
                                <option v-for="manager in allManagers" :key="manager.employeeid"
                                    :value="manager.employeeid">{{ manager.employeename }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            入職時間:<input type="date" class="form-control" v-model="insertEmployee.hiredate">
                            <span v-if="!insertEmployee.hiredate" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            離職時間:<input type="date" class="form-control" v-model="insertEmployee.resigndate">
                        </div>
                        <div class="mb-3">
                            薪資:<input type="text" class="form-control" v-model="insertEmployee.salary">
                            <span v-if="!insertEmployee.salary" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            生日:<input type="date" class="form-control" v-model="insertEmployee.employeebirthday">
                            <span v-if="!insertEmployee.employeebirthday" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            簡介:<textarea class="form-control" v-model="insertEmployee.employeeintroduction"></textarea>
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
                        <h5 class="modal-title" id="exampleModalLabel">刪除部門</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            員工編號:<input type="text" class="form-control" v-model="deleteEmployee.employeeid" readonly>
                            <span v-if="!deleteEmployee.employeeid" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            姓名:<input type="text" class="form-control" v-model="deleteEmployee.employeename" readonly>
                            <span v-if="!deleteEmployee.employeename" class="text-danger">必填</span>
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
const insertEmployee = reactive({
    employeename: '',
    employeeemail: '',
    employeephone: '',
    employeegender: '',
    employeecity: '',
    employeezone: '',
    employeeaddress: '',
    deptid: '',
    jobtitleid: '',
    managerid: '',
    hiredate: '',
    resigndate: '',
    salary: '',
    employeebirthday: '',
    employeeintroduction: '',
});

const updateEmployee = reactive({});
const deleteEmployee = reactive({});

const allEmps = ref([])
const allDepts = ref([])
const allJobTitles = ref([])
const allManagers = ref([])

const totalPages = ref(0);
const datas = reactive({
    start: 0,
    rows: 5,
    name: null,
    sortOrder: "asc",
    sortType: "id",
});

const loadDatas = async () => {
    //透過get方法呼叫/products/find 傳datas資料

    // const response = await axios.get(`${url}/employees`)
    const response = await axios.post(`${url}/employees/findPageByName`, datas)
    const responseDept = await axios.get(`${url}/departments`)
    const responseJobTitle = await axios.get(`${url}/jobtitles`)
    const responseManager = await axios.get(`${url}/employees/managers`)


    allEmps.value = response.data.list
    allDepts.value = responseDept.data
    allJobTitles.value = responseJobTitle.data
    allManagers.value = responseManager.data

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

//排序
const sortHandler = type => {
    datas.sortOrder = datas.sortOrder === "asc" ? "desc" : "asc"
    datas.sortType = type
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
    Object.assign(updateEmployee, data);
};

// 點擊刪除時觸發 帶入該筆資料
const inputDeleteData = (data) => {
    Object.assign(deleteEmployee, data);
};



const insertData = async () => {
    // //抓彈出視窗
    var myModalEl = document.getElementById('insertModal')
    var modal = bootstrap.Modal.getInstance(myModalEl)

    // //如果沒有值 return 不做
    if (!insertEmployee.employeename.trim() ||
        !insertEmployee.employeeemail.trim() ||
        !insertEmployee.employeephone.trim() ||
        !insertEmployee.employeegender.trim() ||
        !insertEmployee.employeecity.trim() ||
        !insertEmployee.employeezone.trim() ||
        !insertEmployee.employeeaddress.trim() ||
        !insertEmployee.deptid ||
        !insertEmployee.jobtitleid ||
        !insertEmployee.hiredate.trim() ||
        !insertEmployee.salary || !insertEmployee.salary.trim() ||
        !insertEmployee.employeebirthday.trim()
    ) {
        // alert("請輸入正確資料")
        Swal.fire({
            title: '請輸入正確資料',
            icon: 'warning',
            confirmButtonText: '確定'
        })
        return;
    }

    try {
        const response = await axios.post(`${url}/employees`, insertEmployee)

        if (response.status == 200) {
            loadDatas(); // 重新載入資料
            // Object.assign(insertEmployee,{})
            // insertEmployee.value = ''; // 清空 insertDeptName
            insertEmployee.employeename = ''
            insertEmployee.employeeemail = ''
            insertEmployee.employeephone = ''
            insertEmployee.employeegender = ''
            insertEmployee.employeecity = ''
            insertEmployee.employeezone = ''
            insertEmployee.employeeaddress = ''
            insertEmployee.deptid = ''
            insertEmployee.jobtitleid = ''
            insertEmployee.managerid = ''
            insertEmployee.hiredate = ''
            insertEmployee.resigndate = ''
            insertEmployee.salary = ''
            insertEmployee.employeebirthday = ''
            insertEmployee.employeeintroduction = ''
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

    delete updateEmployee.department
    delete updateEmployee.jobtitle

    //如果沒有值 return 不做
    if (!updateEmployee.employeename.trim() ||
        !updateEmployee.employeeemail.trim() ||
        !updateEmployee.employeephone.trim() ||
        !updateEmployee.employeegender.trim() ||
        !updateEmployee.employeecity.trim() ||
        !updateEmployee.employeezone.trim() ||
        !updateEmployee.employeeaddress.trim() ||
        !updateEmployee.deptid ||
        !updateEmployee.jobtitleid ||
        !updateEmployee.hiredate.trim() ||
        !updateEmployee.salary ||
        !updateEmployee.employeebirthday.trim()) {
        // alert("請輸入正確資料")
        Swal.fire({
            title: '請輸入正確資料',
            icon: 'warning',
            confirmButtonText: '確定'
        })
        return;
    }

    try {
        const response = await axios.put(`${url}/employees/${updateEmployee.employeeid}`, updateEmployee)
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
    }
}


const deleteData = async () => {
    //抓彈出視窗
    var myModalEl = document.getElementById('deleteModal')
    var modal = bootstrap.Modal.getInstance(myModalEl)

    //如果沒有值 return 不做
    try {
        const response = await axios.delete(`${url}/employees/${deleteEmployee.employeeid}`)

        if (response.status == 200) {
            // datas.start = 0;
            // datas.name = null;

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

const inputTestData = () => {
    insertEmployee.employeename = "陳慶君"
    insertEmployee.employeeemail = "test3555488@gmail.com"
    insertEmployee.employeephone = "0912345678"
    insertEmployee.employeegender = "女"
    insertEmployee.employeecity = "高雄市"
    insertEmployee.employeezone = "旗山區"
    insertEmployee.employeeaddress = "鳳楠路11巷11號"
    insertEmployee.hiredate = "2023-09-25"
    insertEmployee.salary = "45000"
    insertEmployee.employeebirthday = "2000-02-04"
    insertEmployee.employeeintroduction = "擅長舉重"
}


</script >

<style></style>