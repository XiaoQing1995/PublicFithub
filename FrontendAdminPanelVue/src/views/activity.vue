<template>
    <body class="sb-nav-fixed">
        <NavbarTop></NavbarTop>
        <NavbarLeft></NavbarLeft>
        <div id="layoutSidenav">
            <div id="layoutSidenav_content">
                <div class="container-fluid px-4">
                    <!-- 標題 -->
                    <h1 class="mt-4 text-center">全部活動</h1>
                    <div class="card">
                        <div class="card-body table-responsive">
                            <button class="btn mb-3 btn-primary" data-bs-toggle="modal"
                                data-bs-target="#insertModal">新增活動</button>
                            <table class="table table-bordered">
                                <thead class="align-middle text-center">
                                    <tr class="table-primary">
                                        <th>
                                            <button class="btn btn-outline-danger" @click="deleteSelected">刪除</button>
                                        </th>
                                        <!-- <th>活動編號</th> -->
                                        <th>新增日期</th>
                                        <th>名稱</th>
                                        <th>活動內容</th>
                                        <th>顯示</th>
                                        <th>排序<i class="bi bi-patch-question-fill" title="請輸入正整數，數字越大首頁顯示越前面"></i></th>
                                        <th>上架日期</th>
                                        <th>下架日期</th>
                                        <th>負責員工</th>
                                        <th>首頁圖片</th>
                                        <th>修改</th>
                                    </tr>
                                </thead>

                                <tbody class="align-middle text-center">
                                    <tr v-for="(Activity, activityindex) in Activitys" :key="activityindex">
                                        <td><input type="checkbox" v-model="selectedActivities"
                                                :value="Activity.activityid">
                                        </td>
                                        <!-- <td>{{ Activity.activityid }}</td> -->
                                        <td>{{ Activity.activitydate }}</td>
                                        <td style="width:10%">{{ Activity.activityname }}</td>
                                        <!-- <td>{{ Activity.activitydescription }}</td> -->
                                        <td><a :href="'http://localhost:5173/activity?activityid=' + Activity.activityid"
                                                target="_blank"><i class="fas fa-link"></i>預覽</a></td>
                                        <td>{{ Activity.activitydisplay }}</td>
                                        <td>{{ Activity.activitysort }}</td>
                                        <td>{{ Activity.activityon }}</td>
                                        <td>{{ Activity.activityoff }}</td>
                                        <td>{{ Activity.employee.employeename }}</td>
                                        <td><img :src="Activity.activitypic" style="width: 250px;height: 250px;" alt="維修中">
                                        </td>
                                        <td><button class="btn btn-outline-secondary" data-bs-toggle="modal"
                                                @click="openUpdateModal(Activity)" data-bs-target="#updateModal">修改</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 修改-彈出視窗-->
        <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModal" aria-hidden="true"
            data-bs-backdrop="static" data-bs-focus="false">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">修改活動</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            新增日期<input v-model="updateSelectedActivities.activitydate" type="date" class="form-control">
                            <span v-if="!updateSelectedActivities.activitydate" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            名稱<input v-model="updateSelectedActivities.activityname" type="text" class="form-control">
                            <span v-if="!updateSelectedActivities.activityname" class="text-danger">必填</span>
                        </div>
                        顯示
                        <div class="mb-3">
                            <select v-model="updateSelectedActivities.activitydisplay" class="form-select">
                                <option value="是">是</option>
                                <option value="否">否</option>
                            </select>
                            <span v-if="!updateSelectedActivities.activitydisplay" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            排序<i class="bi bi-patch-question-fill" title="請輸入正整數，數字越大首頁顯示越前面"></i><input
                                v-model="updateSelectedActivities.activitysort" type="text" class="form-control">
                            <span v-if="!updateSelectedActivities.activitysort" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            上架日期<input v-model="updateSelectedActivities.activityon" type="date" class="form-control">
                            <span v-if="!updateSelectedActivities.activityon" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            下架日期<input v-model="updateSelectedActivities.activityoff" type="date" class="form-control">
                            <span v-if="!updateSelectedActivities.activityoff" class="text-danger">必填</span>
                        </div>
                        負責員工
                        <div class="mb-3">
                            <select v-model="updateSelectedActivities.employeeid" class="form-select">
                                <option v-for="employeenameAndemployeeid in AllemployeenameAndemployeeid"
                                    :value="employeenameAndemployeeid[1]">{{ employeenameAndemployeeid[0] }}</option>
                            </select>
                            <span v-if="!updateSelectedActivities.employeeid" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            內容<br>
                            <textarea id="updateEditor"></textarea>
                        </div>
                        <div class="mb-3">
                            活動圖片
                            <input id="updatefile" type="file" class="form-control" accept="image/*" @change="imageUpdate">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" @click="updateActivity">送出</button>
                    </div>
                </div>
            </div>
        </div>



        <!-- 新增-彈出視窗 點擊表格外不關閉="static"  取消輸入聚焦在表格data-bs-focus="false"-->
        <div class="modal fade" id="insertModal" tabindex="-1" aria-labelledby="insertModal" aria-hidden="true"
            data-bs-backdrop="static" data-bs-focus="false">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">新增活動</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            新增日期<input v-model="Activity.activitydate" type="date" class="form-control">
                            <span v-if="!Activity.activitydate" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            名稱<input v-model="Activity.activityname" type="text" class="form-control">
                            <span v-if="!Activity.activityname" class="text-danger">必填</span>
                        </div>
                        顯示
                        <div class="mb-3">
                            <select v-model="Activity.activitydisplay" class="form-select">
                                <option value="是">是</option>
                                <option value="否">否</option>
                            </select>
                            <span v-if="!Activity.activitydisplay" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            排序<i class="bi bi-patch-question-fill" title="請輸入正整數，數字越大首頁顯示越前面"></i><input
                                v-model="Activity.activitysort" type="text" class="form-control">
                            <span v-if="!Activity.activitysort" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            上架日期<input v-model="Activity.activityon" type="date" class="form-control">
                            <span v-if="!Activity.activityon" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            下架日期<input v-model="Activity.activityoff" type="date" class="form-control">
                            <span v-if="!Activity.activityoff" class="text-danger">必填</span>
                        </div>
                        負責員工
                        <div class="mb-3">
                            <select v-model="Activity.employeeid" class="form-select">
                                <option v-for="employeenameAndemployeeid in AllemployeenameAndemployeeid"
                                    :value="employeenameAndemployeeid[1]">{{ employeenameAndemployeeid[0] }}</option>
                            </select>
                            <span v-if="!Activity.employeeid" class="text-danger">必填</span>
                        </div>
                        <div class="mb-3">
                            內容<br>
                            <textarea id="insertEditor"></textarea>
                        </div>
                        <div class="mb-3">
                            活動圖片
                            <input id="insertfile" type="file" class="form-control" accept="image/*" @change="imageInsert">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" @click="insertActivity">送出</button>
                    </div>
                </div>
            </div>
        </div>
    </body>
</template>
  
<script setup>
import axios from 'axios'
import { reactive, ref, onMounted } from 'vue'
import NavbarTop from '../components/NavbarTop.vue'
import NavbarLeft from '../components/NavbarLeft.vue'
import Swal from 'sweetalert2'
const url = import.meta.env.VITE_API_JAVAURL
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';  已改用CDN


//建立活動物件
const Activity = reactive({
    activitydate: '',
    activitydescription: '',
    activityname: '',
    activitydisplay: '',
    activityoff: '',
    activityon: '',
    activitysort: '',
    employeeid: '',
    activitypic: '',
});

const Activitys = ref([]); // 儲存SelectAll的活動
const AllemployeenameAndemployeeid = ref([]);
const selectedActivities = ref([]); // 儲存選中的 ClassroomID
const updateSelectedActivities = reactive({}); // 儲存要修改的教室資料(預設值)
let insertEditor = null;; //新增-文字編輯器
let updateEditor = null; //修改-文字編輯器

// 将選中的活動資料複製到 updateSelectedActivities
const openUpdateModal = (Activity) => {
    const { activityid, activitydate, activitydescription, activityname, activitydisplay, activityoff, activityon, activitysort, employeeid, activitypic } = Activity;

    // 只保留update需要的屬性
    updateSelectedActivities.activityid = activityid;
    updateSelectedActivities.activitydate = activitydate;
    updateSelectedActivities.activitydescription = activitydescription;
    updateSelectedActivities.activityname = activityname;
    updateSelectedActivities.activitydisplay = activitydisplay;
    updateSelectedActivities.activityoff = activityoff;
    updateSelectedActivities.activityon = activityon;
    updateSelectedActivities.activitysort = activitysort;
    updateSelectedActivities.activitypic = activitypic;
    updateSelectedActivities.employeeid = employeeid;
    updateEditor.setData(updateSelectedActivities.activitydescription);
    console.log(updateSelectedActivities)
    //清空上傳圖片欄位
    let updatefile = document.querySelector('#updatefile')
    updatefile.value = '';
};

// 取得圖片轉為 BASE64(insert)
const imageInsert = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = (event) => {
                const base64Data = event.target.result;

                // 將 base64Data 直接塞入 activitypic 
                Activity.activitypic = base64Data;
            };
        }
    }
};

// 取得圖片轉為 BASE64(update)
const imageUpdate = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = (event) => {
                const base64Data = event.target.result;

                // 將 base64Data 直接塞入 activitypic 陣列中的物件
                updateSelectedActivities.activitypic = base64Data;
            };
        }
    }
};

// 從伺服器獲取 JSON 格式活動資料
const getActivitys = async () => {
    try {
        const response = await axios.get(`${url}/activity/list`); // 替換為實際的 API URL
        Activitys.value = response.data; //data為response物件的屬性，通常是返回的JSON格式資料
        // console.log(Activitys.value)

    } catch (error) {
        console.error('Error getActivitys:', error);
    }
};

// 給新增活動負責員工選項
const getAllemployeenameAndemployeeid = async () => {
    try {
        const response = await axios.get(`${url}/activity/findAllemployeenameAndemployeeid`); // 替換為實際的 API URL
        AllemployeenameAndemployeeid.value = response.data; //data為response物件的屬性，通常是返回的JSON格式資料
        // console.log(AllemployeenameAndemployeeid.value)

    } catch (error) {
        console.error('Error getAllemployeenameAndemployeeid:', error);
    }
};

// 新增活動
const insertActivity = async () => {
    try {

        //检查是否有任何必填字段为空
        if (!Activity.activitydate ||
            !Activity.activityname ||
            !Activity.activitydisplay ||
            !Activity.activityoff ||
            !Activity.activityon ||
            !Activity.activitysort ||
            !Activity.employeeid) {
            Swal.fire({
                title: '請完成必填欄位',
                icon: 'warning',
                confirmButtonText: '確定'
            })
            return;
        }

        //取得文字編輯器內容
        const insertContent = insertEditor.getData();
        Activity.activitydescription = insertContent;
        // console.log(insertContent)

        const response = await axios.post(`${url}/activity/insert`, Activity, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        Swal.fire({
            title: '新增成功',
            icon: 'success',
            confirmButtonText: '確定'
        })

        // 關閉動態框
        const insertModal = document.getElementById('insertModal')
        let getInstanceInsertModal = bootstrap.Modal.getInstance(insertModal)
        getInstanceInsertModal.toggle();

        // 清空輸入的值
        Activity.activitydate = ''
        Activity.activitydescription = ''
        Activity.activityname = ''
        Activity.activitydisplay = ''
        Activity.activityoff = ''
        Activity.activityon = ''
        Activity.activitysort = ''
        Activity.employeeid = ''
        let insertfile = document.querySelector('#insertfile')
        insertfile.value = '';


        // 刷新畫面
        getActivitys();
    } catch (error) {
        console.error('Error insertActivity:', error);
    }
};


// 更新活動
const updateActivity = async () => {
    try {
        // 检查是否有任何必填字段为空

        if (!updateSelectedActivities.activitydate ||
            !updateSelectedActivities.activityname ||
            !updateSelectedActivities.activitydisplay ||
            !updateSelectedActivities.activityoff ||
            !updateSelectedActivities.activityon ||
            !updateSelectedActivities.activitysort ||
            !updateSelectedActivities.employeeid) {
            Swal.fire({
                title: '請完成必填欄位',
                icon: 'warning',
                confirmButtonText: '確定'
            })
            return;
        }

        // 取得文字編輯器內容
        const updateContent = updateEditor.getData();
        updateSelectedActivities.activitydescription = updateContent;
        console.log(updateSelectedActivities)


        const response = await axios.put(`${url}/activity/update`, updateSelectedActivities, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        Swal.fire({
            title: '修改成功',
            icon: 'success',
            confirmButtonText: '確定'
        })

        // 關閉動態框
        const updateModal = document.getElementById('updateModal')
        let getInstanceUpdateModal = bootstrap.Modal.getInstance(updateModal)
        getInstanceUpdateModal.toggle();

        // 刷新畫面
        getActivitys();
    } catch (error) {
        console.error('Error updateActivity:', error);
    }
};


// 刪除多筆活動
const deleteSelected = async () => {

    Swal.fire({
        title: '確定要刪除選中的活動嗎?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定',
        cancelButtonText: '取消'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${url}/activity/delete/multiple`, {
                    data: selectedActivities.value
                });
                getActivitys();
                selectedActivities.value = []; // 清空選中的項目
                Swal.fire(
                    '已刪除',
                    '',
                    'success'
                )
            } catch (error) {
                console.error('Error deleteSelected:', error);
            }
        } else {
            Swal.fire(
                '已取消!',
                '',
                'success'
            )
            selectedActivities.value = []; // 清空選中的項目
        }
    })
};

onMounted(() => {
    getActivitys();
    getAllemployeenameAndemployeeid();
    //建立文字編輯器
    CKEDITOR.ClassicEditor.create(document.getElementById("insertEditor"), {
        toolbar: {
            items: [
                'exportPDF', 'exportWord', '|',
                'findAndReplace', 'selectAll', '|',
                'heading', '|',
                'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'removeFormat', '|',
                'bulletedList', 'numberedList', 'todoList', '|',
                'outdent', 'indent', '|',
                'undo', 'redo',
                '-',
                'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
                'alignment', '|',
                'link', 'insertImage', 'blockQuote', 'insertTable', 'mediaEmbed', 'codeBlock', 'htmlEmbed', '|',
                'specialCharacters', 'horizontalLine', '|',
                'sourceEditing'
            ],
            shouldNotGroupWhenFull: true
        },
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true
            }
        },
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
        },
        // placeholder: 'Welcome to CKEditor&nbsp;5!',
        fontFamily: {
            options: [
                'default',
                'Arial, Helvetica, sans-serif',
                'Courier New, Courier, monospace',
                'Georgia, serif',
                'Lucida Sans Unicode, Lucida Grande, sans-serif',
                'Tahoma, Geneva, sans-serif',
                'Times New Roman, Times, serif',
                'Trebuchet MS, Helvetica, sans-serif',
                'Verdana, Geneva, sans-serif'
            ],
            supportAllValues: true
        },
        fontSize: {
            options: [10, 12, 14, 'default', 18, 20, 22],
            supportAllValues: true
        },
        htmlSupport: {
            allow: [
                {
                    name: /.*/,
                    attributes: true,
                    classes: true,
                    styles: true
                }
            ]
        },
        htmlEmbed: {
            showPreviews: true
        },
        link: {
            decorators: {
                addTargetToExternalLinks: true,
                defaultProtocol: 'https://',
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        mention: {
            feeds: [
                {
                    marker: '@',
                    feed: [
                        '@apple', '@bears', '@brownie', '@cake', '@cake', '@candy', '@canes', '@chocolate', '@cookie', '@cotton', '@cream',
                        '@cupcake', '@danish', '@donut', '@dragée', '@fruitcake', '@gingerbread', '@gummi', '@ice', '@jelly-o',
                        '@liquorice', '@macaroon', '@marzipan', '@oat', '@pie', '@plum', '@pudding', '@sesame', '@snaps', '@soufflé',
                        '@sugar', '@sweet', '@topping', '@wafer'
                    ],
                    minimumCharacters: 1
                }
            ]
        },
        removePlugins: [
            'CKBox',
            'CKFinder',
            'EasyImage',
            'RealTimeCollaborativeComments',
            'RealTimeCollaborativeTrackChanges',
            'RealTimeCollaborativeRevisionHistory',
            'PresenceList',
            'Comments',
            'TrackChanges',
            'TrackChangesData',
            'RevisionHistory',
            'Pagination',
            'WProofreader',
            'MathType',
            'SlashCommand',
            'Template',
            'DocumentOutline',
            'FormatPainter',
            'TableOfContents',
            'PasteFromOfficeEnhanced'
        ]
    })
        .then(newEditor => {
            // 將 DOM 取得的 editor 賦予宣告的變數提供訪問方法和屬性
            insertEditor = newEditor;
        })
        .catch(error => {
            console.error(error);
        });

    CKEDITOR.ClassicEditor.create(document.getElementById("updateEditor"), {
        toolbar: {
            items: [
                'exportPDF', 'exportWord', '|',
                'findAndReplace', 'selectAll', '|',
                'heading', '|',
                'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'removeFormat', '|',
                'bulletedList', 'numberedList', 'todoList', '|',
                'outdent', 'indent', '|',
                'undo', 'redo',
                '-',
                'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
                'alignment', '|',
                'link', 'insertImage', 'blockQuote', 'insertTable', 'mediaEmbed', 'codeBlock', 'htmlEmbed', '|',
                'specialCharacters', 'horizontalLine', '|',
                'sourceEditing'
            ],
            shouldNotGroupWhenFull: true
        },
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true
            }
        },
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
        },
        // placeholder: 'Welcome to CKEditor&nbsp;5!',
        fontFamily: {
            options: [
                'default',
                'Arial, Helvetica, sans-serif',
                'Courier New, Courier, monospace',
                'Georgia, serif',
                'Lucida Sans Unicode, Lucida Grande, sans-serif',
                'Tahoma, Geneva, sans-serif',
                'Times New Roman, Times, serif',
                'Trebuchet MS, Helvetica, sans-serif',
                'Verdana, Geneva, sans-serif'
            ],
            supportAllValues: true
        },
        fontSize: {
            options: [10, 12, 14, 'default', 18, 20, 22],
            supportAllValues: true
        },
        htmlSupport: {
            allow: [
                {
                    name: /.*/,
                    attributes: true,
                    classes: true,
                    styles: true
                }
            ]
        },
        htmlEmbed: {
            showPreviews: true
        },
        link: {
            decorators: {
                addTargetToExternalLinks: true,
                defaultProtocol: 'https://',
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        mention: {
            feeds: [
                {
                    marker: '@',
                    feed: [
                        '@apple', '@bears', '@brownie', '@cake', '@cake', '@candy', '@canes', '@chocolate', '@cookie', '@cotton', '@cream',
                        '@cupcake', '@danish', '@donut', '@dragée', '@fruitcake', '@gingerbread', '@gummi', '@ice', '@jelly-o',
                        '@liquorice', '@macaroon', '@marzipan', '@oat', '@pie', '@plum', '@pudding', '@sesame', '@snaps', '@soufflé',
                        '@sugar', '@sweet', '@topping', '@wafer'
                    ],
                    minimumCharacters: 1
                }
            ]
        },
        removePlugins: [
            'CKBox',
            'CKFinder',
            'EasyImage',
            'RealTimeCollaborativeComments',
            'RealTimeCollaborativeTrackChanges',
            'RealTimeCollaborativeRevisionHistory',
            'PresenceList',
            'Comments',
            'TrackChanges',
            'TrackChangesData',
            'RevisionHistory',
            'Pagination',
            'WProofreader',
            'MathType',
            'SlashCommand',
            'Template',
            'DocumentOutline',
            'FormatPainter',
            'TableOfContents',
            'PasteFromOfficeEnhanced'
        ]
    })
        .then(newEditor => {
            // 將 DOM 取得的 editor 賦予宣告的變數提供訪問方法和屬性
            updateEditor = newEditor;
        })
        .catch(error => {
            console.error(error);
        });

});




</script>

<style >
.text-danger {
    font-size: 8px;
}

/* 調整文字編輯器樣式 */
.ck-editor__editable {
    min-height: 800px;
}

/* 調整文字編輯器URL按鈕(focus) */
body {
    --ck-z-default: 100;
    --ck-z-modal: calc(var(--ck-z-default) + 999);
}
</style>