<template>
    <body class="sb-nav-fixed">
        <NavbarTop></NavbarTop>
        <NavbarLeft></NavbarLeft>

        <div id="layoutSidenav">
            <div id="layoutSidenav_content">
                <div class="container-fluid px-4">
                    <h1 class="mt-4 text-center">會員管理</h1>
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
                                        <th>會員編號</th>
                                        <th>會員姓名</th>
                                        <th>會員信箱</th>
                                        <th>會員手機</th>
                                        <th>詳細資料</th>
                                        <th>刪除</th>
                                    </tr>
                                </thead>
                                <tbody class="align-middle text-center">
                                    <tr v-for="member in allMembers" :key="member.memberid">
                                        <td>{{ member.memberid }}</td>
                                        <td>{{ member.membername }}</td>
                                        <td>{{ member.memberemail }}</td>
                                        <td>{{ member.memberphoneno }}</td>
                                        <td><button type="submit" class="btn btn-outline-secondary" data-bs-toggle="modal"
                                                data-bs-target="#updateModal" @click="inputUpdateData(member)">查看</button>
                                        </td>
                                        <td><button type="submit" class="btn btn-outline-danger" data-bs-toggle="modal"
                                                data-bs-target="#deleteModal" @click="inputDeleteData(member)">刪除</button>
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
            data-bs-memberckdrop="static">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">修改後台帳戶</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            會員編號: {{ updateMember.memberid }}
                        </div>
                        <div class="mb-3">
                            會員姓名: {{ updateMember.membername }}
                        </div>
                        <div class="mb-3">
                            信箱: {{ updateMember.memberemail }}
                        </div>
                        <div class="mb-3">
                            性別: {{ updateMember.membergender }}
                        </div>
                        <div class="mb-3">
                            縣市: {{ updateMember.membercity }}
                        </div>
                        <div class="mb-3">
                            地區: {{ updateMember.memberzone }}
                        </div>
                        <div class="mb-3">
                            地址: {{ updateMember.memberaddress }}
                        </div>
                        <div class="mb-3">
                            生日: {{ updateMember.memberbirthday }}
                        </div>
                        <div class="mb-3">
                            帳戶建立日期: {{ updateMember.memberaccountsince }}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                    </div>
                </div>
            </div>
        </div>


        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModal" aria-hidden="true"
            data-bs-memberckdrop="static">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">刪除會員</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            會員編號: {{ deleteMember.memberid }}
                        </div>
                        <div class="mb-3">
                            會員姓名: {{ deleteMember.membername }}
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

const updateMember = reactive({});
const deleteMember = reactive({});

const allMembers = ref([])

const totalPages = ref(0);
const datas = reactive({
    start: 0,
    rows: 5,
    name: null,
    sortOrder: "asc",
    sortType: "id",
});

const loadDatas = async () => {
    const response = await axios.post(`${url}/members/findPageByName`, datas)

    allMembers.value = response.data.list

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
    Object.assign(updateMember, data);
};

// 點擊刪除時觸發 帶入該筆資料
const inputDeleteData = (data) => {
    Object.assign(deleteMember, data);
};

const deleteData = async () => {
    //抓彈出視窗
    var myModalEl = document.getElementById('deleteModal')
    var modal = bootstrap.Modal.getInstance(myModalEl)

    //如果沒有值 return 不做
    try {
        const response = await axios.delete(`${url}/members/${deleteMember.memberid}`)

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

</script>