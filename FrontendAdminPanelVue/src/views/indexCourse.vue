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
              {{ courses[0]["courseCategories"]["categoryName"] }}課程
            </h1>

            <div class="card mb-4">
              <div class="card-body table-responsive">
                <div class="row mb-3">
                  <!-- insert button start -->
                  <div class="col-6 col-lg-4">
                    <button
                      type="button"
                      id="insertCourse"
                      class="btn btn btn-primary mb-1"
                      data-bs-toggle="modal"
                      data-bs-target="#insertModal"
                    >
                      新增課程資料
                    </button>
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
                      <th>去排課</th>
                      <th>&nbsp;#&nbsp;</th>
                      <th>課程分類</th>
                      <th>課程名稱</th>
                      <th>課程圖片</th>
                      <th>課程描述</th>
                      <th>修改</th>
                      <th>刪除</th>
                    </tr>
                  </thead>
                  <tbody class="align-middle text-center">
                    <tr
                      v-for="(
                        {
                          courseId,
                          courseName,
                          courseCategories,
                          courseImgPath,
                          courseDescription,
                        },
                        index
                      ) in courses"
                      :key="courseId"
                    >
                      <td>
                        <button
                          type="button"
                          class="btn btn-primary btn-sm"
                          data-bs-toggle="modal"
                          :data-bs-target="`#insertClassesModal${courseId}`"
                        >
                          <i class="bi bi-plus"></i>
                        </button>
                        <InsertClass
                          class="text-left"
                          :courseId="courseId"
                          :courseName="courseName"
                          @submitInsertCourse-emit="pageHandler(1)"
                        >
                        </InsertClass>
                      </td>
                      <td>{{ index + 1 }}</td>
                      <td>{{ courseCategories.categoryName }}</td>
                      <td>{{ courseName }}</td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-secondary btn-sm"
                          data-bs-toggle="modal"
                          :data-bs-target="`#staticBackdropPic${courseId}`"
                        >
                          檢視圖片
                        </button>
                        <courseImg
                          :parentId="courseId"
                          :parentImgName="courseName"
                          :parentImgPath="courseImgPath"
                          modalTitle="課程圖片"
                        ></courseImg>
                      </td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-secondary btn-sm"
                          data-bs-toggle="modal"
                          :data-bs-target="`#staticBackdrop${courseId}`"
                        >
                          詳細內容
                        </button>
                        <courseDescription
                          :parentId="courseId"
                          :parentDescription="courseDescription"
                          modalTitle="課程描述"
                        >
                        </courseDescription>
                      </td>
                      <td>
                        <button
                          :id="`getUpdateCourseBtn${courseId}}`"
                          class="btn btn-outline-secondary btn-sm"
                          data-bs-toggle="modal"
                          :data-bs-target="`#updateModal${courseId}`"
                        >
                          修改
                        </button>
                        <UpdateCourse
                          :categories="courseCategories"
                          :courseId="courseId"
                          :courseName="courseName"
                          :courseImgPath="courseImgPath"
                          :courseCategories="courseCategories"
                          :courseDescription="courseDescription"
                          :allCourseCategories="allCourseCategories"
                          @submitUpdateCourse-emit="loadCourses"
                        >
                        </UpdateCourse>
                      </td>
                      <td>
                        <button
                          @click="deleteCourse(`${courseId}`, `${courseName}`)"
                          class="btn btn-outline-danger btn-sm"
                        >
                          刪除
                        </button>
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

    <InsertCourse
      :allCourseCategories="allCourseCategories"
      @submitInsertCourse-emit="pageHandler(1)"
    ></InsertCourse>
  </body>
</template>

<script setup>
/*
  imports
*/
import { ref, reactive, onMounted, onBeforeMount, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import NavbarTop from "../components/NavbarTop.vue";
import NavbarLeft from "../components/NavbarLeft.vue";
import InsertCourse from "../components/course/courseInsertModal.vue";
import UpdateCourse from "../components/course/courseUpdateModal.vue";
import InsertClass from "../components/classes/classesInsertModal.vue";
import courseImg from "../components/util/imageModal.vue";
import courseDescription from "../components/util/textModal.vue";
import Pagination from "../components/util/pagination.vue";
import Swal from "sweetalert2";

/*
  watcher for categoryId
*/

const pageCourseCategoryId = ref(0);
watch(
  () => pageCourseCategoryId.value,
  (newCategoryId) => {
    if (newCategoryId == 0) {
      paginationData.page = 1; //每次換Category時 顯示所有資料的第一頁
      loadCourses();
    } else {
      paginationData.page = 1; //每次換Category時 顯示所有資料的第一頁
      loadCoursesOfSingleCategory();
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
  console.log("out" + page);
  paginationData.page = page;
  // choose which page to load
  if (pageCourseCategoryId.value == 0) {
    loadCourses();
  } else {
    loadCoursesOfSingleCategory();
  }
};

/*
  Load datas
*/

// Load course data
const courses = ref([]);
const URL = import.meta.env.VITE_API_JAVAURL;
const loadCourses = async () => {
  const URLAPI = `${URL}/course/page`;
  const response = await axios
    .get(URLAPI, {
      params: {
        p: paginationData.page,
        size: 10,
      },
    })
    .catch((error) => {
      console.log(error.toJSON());
    });
  // console.log(response.data)

  //取得所有課程放進courses變數
  courses.value = response.data;

  //取得所有課程頁數及單頁資料數放進courses變數
  paginationData.totalPages = parseInt(response.headers["total-pages"]);
  paginationData.numberOfCourses = parseInt(
    response.headers["number-of-elements"]
  );
  // console.log(courses);
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
  // console.log(allCourseCategories);
};

// Load course data of single category
const loadCoursesOfSingleCategory = async () => {
  if (pageCourseCategoryId != 0) {
    const URLAPI = `${URL}/course/page/${pageCourseCategoryId.value}`;
    const response = await axios.get(URLAPI, {
      params: {
        p: paginationData.page,
        size: 10,
      },
    });

    //取得所有課程放進courses變數
    courses.value = response.data;

    //取得所有課程頁數及單頁資料數放進courses變數
    paginationData.totalPages = parseInt(response.headers["total-pages"]);
    paginationData.numberOfCourses = parseInt(
      response.headers["number-of-elements"]
    );
  }
};

/*
  methods
*/

// deleteCourse
const deleteCourse = async (courseId, courseName) => {
  // console.log(`i am here to delete \${courseId}`);
  // console.log(e);
  const URLAPI = `${URL}/course/${courseId}`;
  let msg = prompt(`您確定要刪除嗎?\n請輸入想要刪除的課程名稱:`);
  if (msg == `${courseName}`) {
    const response = await axios.delete(URLAPI);
    console.log(response);
    console.log(response.status);
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
    loadCourses();
  } else {
    loadCoursesOfSingleCategory();
  }
});
</script>

<style scoped></style>
