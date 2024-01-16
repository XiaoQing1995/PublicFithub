<template>
  <Carousel></Carousel>
  <section class="page-section" id="courseView">
    <div class="container">
      <!-- SideBar -->
      <div class="row">
        <div class="col-2">
          <listGroup
            class="d-flex justify-content-center"
            :allCourseCategories="allCourseCategories"
            :pageCourseCategoryId="parseInt(pageCourseCategoryId)"
            tabindex="0"
            v-focus
          ></listGroup>
        </div>

        <!-- cards for course -->
        <div class="col-9">
          <h1 v-if="pageCourseCategoryId != 0" class="text-center mb-4">
            {{
              allCourseCategories.find((item) => {
                console.log("rander page h1");
                return item.categoryId == pageCourseCategoryId;
              })["categoryName"]
            }}課程列表
          </h1>
          <h1 v-else class="text-center mb-4">全部課程列表</h1>
          <!-- <input type="text" v-focus> -->
          <div
            class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 justify-content-center"
          >
            <courseCard
              v-for="(course, index) in pageCourses"
              class="col-3 mx-2 my-3"
              :cardAmount="index"
              :course="course"
              :URL="URL"
            ></courseCard>
          </div>

          <pagination
            v-if="paginationData.showPagination"
            :totalPages="paginationData.totalPages"
            :page="paginationData.page"
            class="d-flex justify-content-center mt-3"
            @clickNaborCoursePage-emit="changePage"
            @clickAnyCoursePage-emit="changePage"
          >
          </pagination>
        </div>
      </div>
    </div>
  </section>

  <CartIcon></CartIcon>
</template>

<script setup>
/*
  docs
*/

/*
  1.Whole course data / 單一 Course category data
   - 利用 watcher 監控 url，url 中的 pageCourseCategoryId 決定 pageCourses 是那些 course data
     進而決定要 render 那些資料

  2.Pagination 分頁
   - loadPageCourses() 或 loadPageCoursesOfSingleCategory() 在 Server 端取得的 response header，
     totalPages、numberOfCourses 會決定 bootstrap pagination 元件要分成幾頁
   - 點按 bootstrap pagination 元件，會透過emit 回傳 nextOrLast, pageChoose 兩個變數， 決定 page 在第幾頁
     只要 page 數值改變 watcher 會決定要呼叫哪隻 Ajax ， 該 Ajax 會透過 page 決定要回傳哪一頁的資料，並重複
     之前敘述的 render 動作
*/

/*
  imports
*/
import { ref, reactive, onMounted, watch, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import courseCard from "../components/course/courseCard.vue";
import CartIcon from "../components/course/util/icon-cart.vue";
import pagination from "../components/course/util/pagination.vue";
import listGroup from "../components/course/util/listGroup.vue";
import { vFocus } from "../directives/vFocus";
import Carousel from "../components/Carousel.vue";
const URL = import.meta.env.VITE_API_JAVAURL;

/*
  watcher for router
*/

const route = useRoute();
const pageCourseCategoryId = ref(parseInt(route.params["categoryid"]));
watch(
  () => route.params["categoryid"],
  async (newUrlCategoryId) => {
    if (newUrlCategoryId == 0) {
      paginationData.page = 1; //每次換Category時 顯示所有資料的第一頁
      pageCourseCategoryId.value = 0;
      await loadPageCourses();
    } else if (
      route.params["categoryid"] != 0 &&
      route.params["categoryid"] != undefined
    ) {
      paginationData.page = 1; //每次換Category時 顯示所有資料的第一頁
      pageCourseCategoryId.value = newUrlCategoryId;
      await loadPageCoursesOfSingleCategory();
    }
  }
);

/*
Load Datas
*/

// Load courseCategories data
const allCourseCategories = ref([]);
const loadAllCourseCategories = async () => {
  const URLAPI = `${URL}/coursecategories/findAll`;
  const response = await axios.get(URLAPI);

  //取得所有分類放進allCourseCategories變數
  allCourseCategories.value = response.data;
};

// Load course data of all categories
const pageCourses = ref([]);
const paginationData = reactive({
  page: 1,
  totalPages: 1,
  numberOfCourses: 6,
  showPagination: false,
});

const loadPageCourses = async () => {
  const URLAPI = `${URL}/course/page`;
  const response = await axios.get(URLAPI, {
    params: {
      p: paginationData.page,
    },
  });

  //取得所有課程放進courses變數
  pageCourses.value = response.data;

  //取得所有課程頁數及單頁資料數放進courses變數
  paginationData.totalPages = parseInt(response.headers["total-pages"]);
  paginationData.numberOfCourses = parseInt(
    response.headers["number-of-elements"]
  );
  paginationData.showPagination = true; // loadPageCourses後，v-if顯示pagination
};

// Load course data of single category
const loadPageCoursesOfSingleCategory = async () => {
  if (pageCourseCategoryId != 0) {
    const URLAPI = `${URL}/course/page/${pageCourseCategoryId.value}`;
    const response = await axios.get(URLAPI, {
      params: {
        p: paginationData.page,
      },
    });

    //取得所有課程放進courses變數
    pageCourses.value = response.data;

    //取得所有課程頁數及單頁資料數放進courses變數
    paginationData.totalPages = parseInt(response.headers["total-pages"]);
    paginationData.numberOfCourses = parseInt(
      response.headers["number-of-elements"]
    );
    paginationData.showPagination = true; // loadPageCourses後，v-if顯示pagination
  }
};

/*
  Pagination
*/

//trigger @click pagination後換頁
const changePage = (nextOrLast, pageChoose) => {
  // console.log(
  //   "In Main Page, arg1 is: " + nextOrLast + " ,arg2 is: " + pageChoose
  // );
  if (nextOrLast == 0 && paginationData.page != pageChoose) {
    paginationData.page = pageChoose;
  } else if (
    pageChoose == 0 &&
    paginationData.page * nextOrLast != -1 &&
    paginationData.page + nextOrLast <= paginationData.totalPages
  ) {
    paginationData.page += nextOrLast;
  }
};

/*
  watcher for Pagination
*/
watch(
  () => paginationData.page,
  async () => {
    if (route.params["categoryid"] == 0) {
      await loadPageCourses();
    } else if (
      route.params["categoryid"] != 0 &&
      route.params["categoryid"] != undefined
    ) {
      await loadPageCoursesOfSingleCategory();
    }
  }
);

/*
  LifeCycle Hooks
*/
onBeforeMount(() => {
  // pageCourseCategoryId.value = route.params["categoryid"];
  loadAllCourseCategories();
});

onMounted(() => {
  // choose which page to load
  if (route.params["categoryid"] == 0) {
    loadPageCourses();
  } else if (
    route.params["categoryid"] != 0 &&
    route.params["categoryid"] != undefined
  ) {
    loadPageCoursesOfSingleCategory();
  }
});
</script>

<style scoped></style>
