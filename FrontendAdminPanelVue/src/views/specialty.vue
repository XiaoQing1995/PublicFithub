<template>
    <body class="sb-nav-fixed">
        <NavbarTop></NavbarTop>
        <NavbarLeft></NavbarLeft>


        <div id="layoutSidenav">
            <div id="layoutSidenav_content">
                <div class="container-fluid px-4">
                    <h1 class="mt-4" style="text-align: center;">專長項目</h1>
                    <div class="card">
                        <div class="card-body table-responsive">
                            <button type="submit" class="btn btn-primary mb-3" data-bs-toggle="modal"
                                data-bs-target="#insertModal">新增專長</button>
                            <table id="specialtysTable" class="table table-bordered">
                                <thead class="align-middle text-center">
                                    <tr class="table-primary">
                                        <th>專長名稱</th>
                                        <th>修改</th>
                                        <th>刪除</th>
                                    </tr>
                                </thead>
                                <tbody class="align-middle text-center">
                                    <tr v-for="spec in allSpecs" :key="spec.specialtyid">
                                        <td>{{ spec.specialtyname }}</td>
                                        <td><button type="submit" class="btn btn-outline-secondary" data-bs-toggle="modal"
                                                data-bs-target="#updateModal" @click="inputUpdateData(spec)">修改</button>
                                        </td>
                                        <td><button type="submit" class="btn btn-outline-danger" data-bs-toggle="modal"
                                                data-bs-target="#deleteModal" @click="inputDeleteData(spec)">刪除</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
                        <h5 class="modal-title" id="exampleModalLabel">修改專長名稱</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            專長名稱:<input type="text" class="form-control" v-model="updateSpecialty.specialtyname">
                            <span v-if="!updateSpecialty.specialtyname" class="text-danger">必填</span>
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
                        <h5 class="modal-title" id="exampleModalLabel">新增專長</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            專長名稱:<input type="text" class="form-control" v-model="insertSpecialty.specialtyname">
                            <span v-if="!insertSpecialty.specialtyname" class="text-danger">必填</span>
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
                        <h5 class="modal-title" id="exampleModalLabel">刪除專長</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            專長名稱:<input type="text" class="form-control" v-model="deleteSpecialty.specialtyname" readonly>
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
import Swal from 'sweetalert2'

const url = import.meta.env.VITE_API_JAVAURL
const insertSpecialty = reactive({
    specialtyname: '',
});
const updateSpecialty = reactive({});
const deleteSpecialty = reactive({});

//存所有dept資料
const allSpecs = ref([])

const loadDatas = async () => {
    //透過get方法呼叫/products/find 傳datas資料

    const response = await axios.get(`${url}/specialtys`)

    allSpecs.value = response.data
}

onMounted(() => {
    loadDatas()
});

const inputUpdateData = (data) => {
    Object.assign(updateSpecialty, data);
};

const inputDeleteData = (data) => {
    Object.assign(deleteSpecialty, data);
};



const insertData = async () => {
    //抓彈出視窗
    var myModalEl = document.getElementById('insertModal')
    var modal = bootstrap.Modal.getInstance(myModalEl)

    //如果沒有值 return 不做
    if (!insertSpecialty.specialtyname.trim()) {
        // alert("請輸入正確資料")
        Swal.fire({
            title: '請輸入正確資料',
            icon: 'warning',
            confirmButtonText: '確定'
        })
        return;
    }

    try {
        const response = await axios.post(`${url}/specialtys`, { specialtyname: insertSpecialty.specialtyname })
        if (response.status === 200) {
            loadDatas(); // 重新載入資料
            insertSpecialty.specialtyname = ''; // 清空 insertSpecialtyname
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
    if (!updateSpecialty.specialtyid || !updateSpecialty.specialtyname.trim()) {
        // alert("請輸入正確資料")
        Swal.fire({
            title: '請輸入正確資料',
            icon: 'warning',
            confirmButtonText: '確定'
        })
        return;
    }


    try {
        const response = await axios.put(`${url}/specialtys/${updateSpecialty.specialtyid}`, { specialtyid: updateSpecialty.specialtyid, specialtyname: updateSpecialty.specialtyname })

        if (response.status == 200) {
            loadDatas(); // 重新載入資料
            updateSpecialty.specialtyid = ''
            updateSpecialty.specialtyname = ''; // 清空 insertSpecialtyname
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
    if (!deleteSpecialty.specialtyid) {
        return;
    }

    try {
        const response = await axios.delete(`${url}/specialtys/${deleteSpecialty.specialtyid}`)

        if (response.status == 200) {
            loadDatas(); // 重新載入資料
            deleteSpecialty.specialtyid = ''
            deleteSpecialty.specialtyname = ''; // 清空 insertSpecialtyname
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