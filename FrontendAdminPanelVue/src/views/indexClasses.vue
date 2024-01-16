<template>
  <body class="sb-nav-fixed">
    <NavbarTop></NavbarTop>
    <NavbarLeft></NavbarLeft>
    <div id="layoutSidenav">
      <div id="layoutSidenav_content">
        <main>
          <div class="container-fluid px-4">
            <h1
              v-if="pageCourseCategoryId == 0"
              class="mt-4 mb-2"
              style="text-align: center"
            >
              全部課程
            </h1>
            <h1 v-else class="mt-4 mb-2" style="text-align: center">
              {{ classes[0]["categoryName"] }}課程
            </h1>

            <div class="card mb-4">
              <div class="card-body table-responsive">
                <div class="row mb-3">
                  <!-- insert button start -->
                  <div class="col-6 col-lg-4">
                    <router-link
                      to="course"
                      type="button"
                      class="btn btn btn-primary mb-1"
                      >新增課堂資料</router-link
                    >
                  </div>
                  <!-- insert button end -->
                  <!-- category select start -->
                  <div class="col-6 col-lg-3">
                    <select
                      class="form-select"
                      v-model="pageCourseCategoryId"
                      id="categoryId"
                    >
                      <option selected value="" style="display: none">
                        請選擇課程分類
                      </option>
                      <!-- value前加上：表示其爲int -->
                      <option :value="0">全部課程</option>
                      <option
                        v-for="{
                          categoryId,
                          categoryName,
                        } in allCourseCategories"
                        :value="categoryId"
                      >
                        {{ categoryName }}
                      </option>
                    </select>
                  </div>
                  <!-- category select end -->
                </div>
                <table class="table table-bordered">
                  <thead class="align-middle text-center">
                    <tr class="table-primary">
                      <th>&nbsp;#&nbsp;</th>
                      <th>課程分類</th>
                      <th>課程名稱</th>
                      <th>負責教練</th>
                      <th>課程時間</th>
                      <th>課程教室</th>
                      <th>課程價格</th>
                      <th>名額上限</th>
                      <th>最低開課人數</th>
                      <th>修改</th>
                      <th>刪除</th>
                    </tr>
                  </thead>
                  <tbody class="align-middle text-center">
                    <tr
                      v-for="(
                        {
                          classId,
                          courseId,
                          classDate,
                          classTime,
                          employeeId,
                          employeename,
                          courseName,
                          categoryName,
                          price,
                          applicantsCeil,
                          applicantsFloor,
                          classroomId,
                          classroomName,
                          classroomCapacity,
                          coachSubstitute,
                        },
                        index
                      ) in classes"
                      :key="classId"
                    >
                      <td>{{ index + 1 }}</td>
                      <td>{{ categoryName }}</td>
                      <td>{{ courseName }}</td>
                      <td>{{ employeename }}</td>
                      <td>{{ classDate }}&nbsp;{{ classTime }}</td>
                      <td>{{ classroomName }}</td>
                      <td>NT$&nbsp;{{ price.toLocaleString() }}</td>
                      <td>
                        {{ applicantsCeil }}
                      </td>
                      <td>{{ applicantsFloor }}</td>
                      <td>
                        <i
                          type="button"
                          class="bi bi-pencil-square"
                          :id="`getUpdateClassesBtn${classId}}`"
                          data-bs-toggle="modal"
                          :data-bs-target="`#updateClassesModal${classId}`"
                        ></i>
                        <UpdateClass
                          :classId="classId"
                          :classDate="classDate"
                          :classTime="classTime"
                          :employeeId="employeeId"
                          :courseId="courseId"
                          :courseName="courseName"
                          :price="price"
                          :applicantsCeil="applicantsCeil"
                          :applicantsFloor="applicantsFloor"
                          :classroomId="classroomId"
                          :classroomName="classroomName"
                          :classroomCapacity="classroomCapacity"
                          :coachSubstitute="coachSubstitute"
                          @submitUpdateClasses-emit="pageHandler(1)"
                        ></UpdateClass>
                      </td>
                      <td>
                        <i
                          type="button"
                          class="bi bi-trash3"
                          @click="deleteClass(`${classId}`, `${courseName}`)"
                        ></i>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- pagination start -->
              <div class="mb-4">
                <Pagination
                  :page="paginationData.page"
                  :total-pages="paginationData.totalPages"
                  @page-emit="pageHandler"
                ></Pagination>
              </div>
              <!-- pagination end -->
            </div>
            <!-- card end -->
          </div>
        </main>
      </div>
    </div>
  </body>
</template>

<script setup>
/*
  imports
*/
import {
  ref,
  reactive,
  onMounted,
  onBeforeMount,
  watch,
  onBeforeUpdate,
} from "vue";
import axios from "axios";
import UpdateClass from "../components/classes/classesUpdateModal.vue";
import NavbarTop from "../components/NavbarTop.vue";
import NavbarLeft from "../components/NavbarLeft.vue";
import Pagination from "../components/util/pagination.vue";
import Swal from "sweetalert2";
const URL = import.meta.env.VITE_API_JAVAURL;

/*
  watcher for categoryId
*/

const pageCourseCategoryId = ref(0);
watch(
  () => pageCourseCategoryId.value,
  (newCategoryId) => {
    if (newCategoryId == 0) {
      paginationData.page = 1; //每次換Category時 顯示所有資料的第一頁
      loadClasses();
    } else {
      paginationData.page = 1; //每次換Category時 顯示所有資料的第一頁
      loadSingleCategoryClasses();
    }
  }
);

/* 
  pagination
*/
const paginationData = reactive({
  page: 1,
  totalPages: 1,
  numberOfCourses: 10,
});

const pageHandler = (page) => {
  // console.log("out" + page);
  paginationData.page = page;
  // choose which page to load
  if (pageCourseCategoryId.value == 0) {
    loadClasses();
  } else {
    loadSingleCategoryClasses();
  }
};

/*
  Load Datas
*/
// Load Classes data
const classes = ref([]);
const loadClasses = async () => {
  const URLAPI = `${URL}/classes/findAllInMonthRange/page`;
  const response = await axios
    .get(URLAPI, {
      params: {
        monthBefore: 1,
        monthAfter: 1,
        p: paginationData.page,
        size: 10,
      },
    })
    .catch((error) => {
      console.log(error.toJSON());
    });

  classes.value = response.data;

  //取得所有課程頁數及單頁資料數放進courses變數
  paginationData.totalPages = parseInt(response.headers["total-pages"]);
  paginationData.numberOfCourses = parseInt(
    response.headers["number-of-elements"]
  );
  await getAllAlreadyBuy();
};

// Load Single category Classes data
const loadSingleCategoryClasses = async () => {
  const URLAPI = `${URL}/classes/findAllInMonthRangeAndCategoryId/page`;
  const response = await axios
    .get(URLAPI, {
      params: {
        categoryId: pageCourseCategoryId.value,
        monthBefore: 1,
        monthAfter: 1,
        p: paginationData.page,
        size: 10,
      },
    })
    .catch((error) => {
      console.log(error.toJSON());
    });

  classes.value = response.data;

  //取得所有課程頁數及單頁資料數放進courses變數
  paginationData.totalPages = parseInt(response.headers["total-pages"]);
  paginationData.numberOfCourses = parseInt(
    response.headers["number-of-elements"]
  );
  await getAllAlreadyBuy();
};

// Load courseCategories data
const allCourseCategories = ref([]);
const loadAllCourseCategories = async () => {
  const URLAPI = `${URL}/coursecategories/findAll`;
  const response = await axios.get(URLAPI).catch((error) => {
    console.log(error.toJSON());
  });
  // console.log(response.data)

  //取得所有分類放進allCourseCategories變數
  allCourseCategories.value = response.data;
  // console.log(allCourseCategories)
};

// Load alreadyBuyAmount
const URLAPIALREADYBUY = `${URL}/order-items/getOrderItemAmountByClassId`;
const getAlreadyBuy = (classId) =>
  axios
    .get(URLAPIALREADYBUY, {
      params: {
        classId: classId,
      },
    })
    .catch((error) => {
      console.log(error.toJSON());
    });

// Temporary used method 後端controller 出現對應方法後棄用
const alreadyBuy = ref([]);
const getAllAlreadyBuy = async () => {
  for (const singleClass of classes.value) {
    const res = await getAlreadyBuy(singleClass["classId"]);
    if (Object.keys(res.data).length !== 0) {
      //判斷是否為空{}
      alreadyBuy.value.push(res.data);
    }
  }
};

/*
  Delete Datas
*/

// deleteCourse
const deleteClass = async (classId, courseName) => {
  // console.log(`i am here to delete \${classID}`);
  // console.log(e);
  const URLAPI = `${URL}/classes/${classId}`;
  let msg = prompt(`您確定要刪除嗎?\n請輸入想要刪除的課程名稱:`);
  if (msg == `${courseName}`) {
    const response = await axios.delete(URLAPI).catch((error) => {
      console.log(error.toJSON());
    });
    if (response.status == 200) {
      // alert("刪除成功");
      Swal.fire({
        title: "刪除成功",
        icon: "success",
        confirmButtonText: "確定",
      });
    } else {
      // alert("刪除失敗");
      Swal.fire({
        title: "刪除失敗",
        icon: "warning",
        confirmButtonText: "確定",
      });
    }
    pageHandler(1);
  } else if (msg == null) {
  } else {
    // alert("輸入錯誤");
    Swal.fire({
      title: "輸入錯誤",
      icon: "warning",
      confirmButtonText: "確定",
    });
  }
};

/*
  LifeCycle Hooks
 */
onBeforeMount(() => {
  loadAllCourseCategories();
});

onMounted(() => {
  // choose which page to load
  if (pageCourseCategoryId.value == 0) {
    loadClasses();
  } else {
    loadSingleCategoryClasses();
  }
});
// onBeforeUpdate(() => {
//   alreadyBuyShow.value = false;
// });
</script>

<style scoped></style>
