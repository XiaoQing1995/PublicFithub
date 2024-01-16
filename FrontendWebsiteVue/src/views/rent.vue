<template>
  <Carousel></Carousel>

  <div class="container text-center">
    <div class="row justify-content-center">
      <div class="col-lg-11 col-md-12">
        <h1>場地租借</h1>
        <hr class="divider" />
        <label class="fs-3">場地:</label>
        <select class="form-select-lg me-sm-5" v-model="selectedClassroomId" @change="handleOptionChange">
          <option disabled selected value="0">請先選擇場地</option>
          <option v-for="classroom in openClassrooms" :key="classroom.name" :value="classroom.classroomId">
            {{ classroom.classroomName }}
          </option>
        </select>
        <label class="fs-3">日期:</label>
        <input type="date" class="form-select-lg me-sm-5" v-model="selectedDate" :min="minDate" :max="maxDate" />
        <label class="fs-3">時段:</label>
        <select class="form-select-lg me-sm-5" v-model="selectedTime">
          <option disabled selected value="0">請選擇時段</option>
          <option value="早上">早上9:00-12:00</option>
          <option value="下午">下午14:00-17:00</option>
          <option value="晚上">晚上18:00-21:00</option>
        </select>
        <button type="submit" class="btn btn-primary btn-lg" @click="reserve">
          預約
        </button>
        <span>*僅開放預訂下個月</span>
        <div id="calendar" class="calendar text-center mt-5"></div>
      </div>
    </div>
  </div>

  <div class="container text-center">
    <h1>場地介紹</h1>
    <hr class="divider" />
    <div class="row justify-content-center">
      <div class="col-lg-11 col-md-12">
        <table class="table table-bordered align-middle">
          <thead>
            <tr class="table-success">
              <th>教室名稱</th>
              <th>容納人數</th>
              <th>介紹</th>
              <th>租借價格</th>
              <th>狀態</th>
              <th>圖片</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(classroom, classroomindex) in classroomData" :key="classroomindex">
              <td class="col-lg-2 col-md-2">{{ classroom.classroomName }}</td>
              <td class="col-lg-2 col-md-2">
                {{ classroom.classroomCapacity }}
              </td>
              <td class="col-lg-2 col-md-2">
                {{ classroom.classroomDescription }}
              </td>
              <td class="col-lg-2 col-md-2">
               $NT {{ classroom.classroomPrice.toLocaleString() }}
              </td>
              <td class="col-lg-2 col-md-2">{{ classroom.classroomStatus }}</td>
              <td class="col-lg-2 col-md-2">
                <img :src="classroom.classroomPic" class="img-fluid" alt="維修中" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { reactive, ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRentOrderStore } from "../stores/rentorder.js";
import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import Carousel from "../components/Carousel.vue";
const url = import.meta.env.VITE_API_JAVAURL;

const rentOrderStore = useRentOrderStore();
const { selectedClassroom } = storeToRefs(rentOrderStore);
// console.log(selectedClassroom.value)

// 取得路由物件
const router = useRouter();

// 取得下個月1號為日曆初始日期
const today = new Date();
const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
let year = nextMonth.getFullYear();
let month = String(nextMonth.getMonth()).padStart(2, "0");
let day = String(nextMonth.getDate()).padStart(2, "0");

// 如果月份為 01，年份加 1
if (month === "01") {
  year++;
}
const nextMonthFormatted = `${year}-${month}-${day}`;

// 選擇的場地 日期 時段
const selectedClassroomId = ref(0); // 預設0
const selectedDate = ref(nextMonthFormatted);
const selectedTime = ref(0);

// 日曆
const events = ref([]);

// 取得全部教室資料
const classroomData = ref([]);

// 篩選狀態為開放的教室
const openClassrooms = ref([]);

// 訂單頁面需要的場地資料
const classroomInfo = ref([]);

// 建立被選的場地物件
const selectedData = reactive({
  rentOrderid: "",
  classroomid: "",
  classroomName: "",
  classroomPic: "",
  classroomPrice: "",
  rentdate: "",
  renttime: "",
});

// 訂單
const rentOrder = reactive({
  memberid: localStorage.getItem("memberid"),
  classroomid: "",
  rentorderdate: today,
  rentdate: "",
  renttime: "",
  rentamount: "",
  rentstatus: "未付款",
});

// 計算下個月第一天
const minDate = computed(() => {
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);
  nextMonth.setDate(1);
  return nextMonth.toISOString().split("T")[0];
});

// 計算下個月最後一天
const maxDate = computed(() => {
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 2);
  nextMonth.setDate(0);
  return nextMonth.toISOString().split("T")[0];
});

// 篩選狀態為開放的場地
const getfindAllClassroomNameAndStatusAndId = async () => {
  try {
    const findAllClassroomNameAndStatusAndId = await axios.get(
      `${url}/classroom/list`
    );
    classroomData.value = findAllClassroomNameAndStatusAndId.data;

    // 使用Array.prototype.filter()篩選出classroomStatus為'開放'的對象 filter篩選出為陣列
    openClassrooms.value = classroomData.value.filter(
      (item) => item.classroomStatus === "開放"
    );
    // console.log(openClassrooms.value);
  } catch (error) {
    console.error("Error:", error);
  }
};

// 監聽 selectedClassroomId 的變化
watch(selectedClassroomId, (selectedValue) => {
  getfindAllDateTimeFromRentOrderAndclass(selectedValue);
});

// 監聽 selectedDate 的變化
watch(selectedDate, (selectedValue) => {
  // console.log(selectedValue);
});

// 監聽 selectedTime 的變化
watch(selectedTime, (selectedValue) => {
  // console.log(selectedValue);
});

// 檢查預定場地是否被使用，將選擇的資料傳到訂單頁面
const reserve = async () => {
  try {
    if (selectedClassroomId.value === 0) {
      Swal.fire({
        title: "請選擇場地",
        icon: "warning",
        confirmButtonText: "確定",
      });
      return;
    } else if (selectedDate.value === "") {
      Swal.fire({
        title: "請選擇日期",
        icon: "warning",
        confirmButtonText: "確定",
      });
      return;
    } else if (selectedTime.value === 0) {
      Swal.fire({
        title: "請選擇時段",
        icon: "warning",
        confirmButtonText: "確定",
      });
      return;
    }

    //  使用場地id搜尋日期和時段是否使用 回傳BOOLEAN
    selectedData.classroomid = selectedClassroomId.value;
    selectedData.rentdate = selectedDate.value;
    selectedData.renttime = selectedTime.value;
    // console.log(selectedData)

    const classroomAvailability = await axios.post(
      `${url}/rent/checkClassroomAvailability`,
      selectedData
    );
    const responseData = classroomAvailability.data;
    // console.log(responseData)

    if (responseData === true) {
      Swal.fire({
        title: "已被預訂",
        icon: "error",
        confirmButtonText: "確定",
      });
    } else {
      // 篩選出選擇的場地資訊並傳到訂單頁面 find篩選出為物件(只返回第一個匹配的元素)
      classroomInfo.value = classroomData.value.find(
        (item) => item.classroomId === selectedData.classroomid
      );
      // console.log(classroomInfo.value)

      selectedData.classroomName = classroomInfo.value.classroomName;
      selectedData.classroomPrice = classroomInfo.value.classroomPrice;
      selectedData.classroomPic = classroomInfo.value.classroomPic;
      // console.log(selectedData)

      // 將訂單頁面需要的資料都賦給pinia
      selectedClassroom.value = selectedData;

      // 建立訂單
      rentOrder.classroomid = selectedClassroomId.value;
      rentOrder.rentdate = selectedDate.value;
      rentOrder.renttime = selectedTime.value;
      rentOrder.rentamount = classroomInfo.value.classroomPrice;
      // console.log(rentOrder)

      // 判斷是否有登入會員
      const localStorageData = localStorage.getItem("isLogin");

      if (localStorageData === "true") {
        // 新增訂單
        const response = await axios.post(`${url}/rent/insert`, rentOrder);
        selectedData.rentOrderid = response.data;

        // 使用router.push query進行頁面跳轉資料存在網址 http://localhost:5173/rentorder?id=123
        router.push({
          path: "/rentorder",
        });
      } else {
        Swal.fire({
          title: "請登入會員",
          icon: "warning",
          confirmButtonText: "確定",
        }).then((result) => {
          if (result.isConfirmed) {
            // 點擊 "確定" 按钮，執行頁面跳转
            router.push({
              path: "/login",
            });
          }
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// 顯示日曆已預訂時段
const getfindAllDateTimeFromRentOrderAndclass = async (selectedValue) => {
  try {
    // 取得rentorder日期-時段 class日期-時段
    const findAllDateTimeFromRentOrderAndclass = await axios.get(
      `${url}/rent/list/${selectedValue}`
    ); // 替換為實際的 API URL
    const allDateTimeFromRentOrderAndclass =
      findAllDateTimeFromRentOrderAndclass.data; //data為response物件的屬性，通常是返回的JSON格式資料
    // console.log(allDateTimeFromRentOrderAndclass)

    // 處理 allDateTimeFromRentOrderAndclass 的數據，生成 FullCalendar 的事件陣列
    events.value = allDateTimeFromRentOrderAndclass.map((item) => {
      return {
        title: `${item[1]}:已預定`,
        start: item[0],
      };
    });
    // console.log(events.value)

    // 建立日曆
    const calendarEl = document.getElementById("calendar");
    const calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin],
      headerToolbar: {
        left: "",
        center: "title",
        right: "",
      },
      initialView: "dayGridMonth",
      initialDate: nextMonthFormatted,
      timeZone: "UTC",
      locale: "zh-tw",
      height: 700,
      events: events.value,
      // 將輸入的排序
      eventOrder: function (a, b) {
        const order = { "早上:已預定": 1, "下午:已預定": 2, "晚上:已預定": 3 };
        return order[a.title] - order[b.title];
      },
    });
    calendar.render();
  } catch (error) {
    console.error("Error:", error);
  }
};

onMounted(() => {
  getfindAllClassroomNameAndStatusAndId();
});
</script>

<style scoped>
.calendar {
  background-color: white;
}
</style>
