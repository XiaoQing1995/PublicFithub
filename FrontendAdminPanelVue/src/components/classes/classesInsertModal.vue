<template>
  <div
    class="modal fade"
    :id="`insertClassesModal${courseId}`"
    tabindex="-1"
    aria-labelledby="insertModal"
    aria-hidden="true"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="insertModalLabel">
            建立{{ courseName }}課程
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="resetForm"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="classDate" class="col-form-label"
              ><span class="need-input">*</span>課程時間 :</label
            >
            <input
              type="date"
              class="form-control"
              :class="validatedInputState.classDate"
              v-model="classes.classDate"
              id="classDate"
            />
            <div
              v-if="validationType.classDate == 'stringEmpty'"
              class="invalid-feedback"
            >
              請選擇日期
            </div>
            <div
              v-else-if="validationType.classDate == 'dateBefore'"
              class="invalid-feedback"
            >
              無法新增過去之課程
            </div>
          </div>

          <div class="mb-3">
            <label for="classTime" class="col-form-label"
              ><span class="need-input">*</span>課程時段 :</label
            >
            <select
              class="form-select"
              :class="validatedInputState.classTime"
              v-model="classes.classTime"
              id="classTime"
            >
              <option selected value="" style="display: none">請選擇</option>
              <option value="早上">早上</option>
              <option value="下午">下午</option>
              <option value="晚上">晚上</option>
            </select>
            <div class="invalid-feedback">請選擇時段</div>
          </div>

          <div class="mb-3">
            <label for="coach" class="col-form-label"
              ><span class="need-input">*</span>教練 :</label
            >
            <select
              class="form-select"
              :class="validatedInputState.employeeId"
              v-model="classes.employeeId"
              id="coach"
            >
              <option selected value="" style="display: none">請選擇</option>
              <option
                v-for="{ employeeid, employeename } in allCoachs"
                :value="employeeid"
              >
                {{ employeename }}
              </option>
            </select>
            <div
              v-if="validationType.employeeId == 'stringEmpty'"
              class="invalid-feedback"
            >
              請選擇教練
            </div>
            <div
              v-else-if="validationType.employeeId == 'classConflict'"
              class="invalid-feedback"
            >
              教練於該時段衝堂，請選擇其他日期或時段
            </div>
          </div>

          <div class="mb-3">
            <label for="coachSubstitute" class="col-form-label"
              >是否為代課教練 :</label
            >
            <select
              class="form-select"
              v-model="classes.coachSubstitute"
              id="coachSubstitute"
            >
              <option selected value="0">否</option>
              <option value="1">是</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="classroomSelect" class="col-form-label"
              ><span class="need-input">*</span>教室 :</label
            >
            <select
              class="form-select"
              :class="validatedInputState.classroomId"
              v-model="classes.classroomId"
              id="classroomSelect"
              @change="setclassroomCapacity"
            >
              <option selected value="" style="display: none">請選擇</option>
              <option
                v-for="{ classroomId, classroomName } in allClassrooms"
                :value="classroomId"
              >
                {{ classroomName }}
              </option>
            </select>
            <div
              v-if="validationType.classroomId == 'stringEmpty'"
              class="invalid-feedback"
            >
              請選擇教室
            </div>
            <div
              v-else-if="validationType.classroomId == 'classroomAlreadyBooked'"
              class="invalid-feedback"
            >
              該時段教室已被預訂，請選擇其他日期或時段
            </div>
          </div>

          <div class="mb-3">
            <label for="applicantsCeil" class="col-form-label"
              ><span class="need-input">*</span>課程名額上限 : ({{
                classroom.classroomName
              }}使用人數上限為{{ classroom.classroomCapacity }}人)</label
            >
            <input
              type="text"
              class="form-control"
              :class="validatedInputState.applicantsCeil"
              v-model.trim="classes.applicantsCeil"
              id="applicantsCeil"
            />
            <div
              v-if="validationType.applicantsCeil == 'stringEmpty'"
              class="invalid-feedback"
            >
              請填寫名額上限
            </div>
            <div
              v-else-if="
                validationType.applicantsCeil == 'overClassroomCapacity'
              "
              class="invalid-feedback"
            >
              已超過教室可容納人數
            </div>
            <div
              v-else-if="validationType.applicantsCeil == 'lessThanOne'"
              class="invalid-feedback"
            >
              名額上限不可低於 1 人
            </div>
          </div>

          <div class="mb-3">
            <label for="applicantsFloor" class="col-form-label"
              ><span class="need-input">*</span>最低開課人數 :</label
            >
            <input
              type="text"
              class="form-control"
              :class="validatedInputState.applicantsFloor"
              v-model.trim="classes.applicantsFloor"
              id="applicantsFloor"
            />
            <div
              v-if="validationType.applicantsFloor == 'stringEmpty'"
              class="invalid-feedback"
            >
              請填寫最低開課人數
            </div>
            <div
              v-else-if="validationType.applicantsFloor == 'negativeNumber'"
              class="invalid-feedback"
            >
              最低開課人數不可為負數
            </div>
            <div
              v-else-if="validationType.applicantsFloor == 'moreThanCeil'"
              class="invalid-feedback"
            >
              最低開課人數大於名額上限
            </div>
          </div>

          <div class="mb-3">
            <label for="price" class="col-form-label"
              ><span class="need-input">*</span>課程價格 :</label
            >
            <input
              type="text"
              class="form-control"
              :class="validatedInputState.price"
              v-model.trim="classes.price"
              id="price"
            />
            <div
              v-if="validationType.price == 'stringEmpty'"
              class="invalid-feedback"
            >
              請填寫課程價格
            </div>
            <div
              v-else-if="validationType.price == 'negativeNumber'"
              class="invalid-feedback"
            >
              課程價格不可為負數
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="resetForm"
          >
            取消
          </button>
          <button
            type="submit"
            id="sendInsertClass"
            class="btn btn-primary"
            @click="submitInsertClass(classroom.classroomCapacity)"
          >
            送出
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/*
  imports
 */
import { ref, reactive, onMounted, watch } from "vue";
import router from "../../router";
import axios from "axios";
const URL = import.meta.env.VITE_API_JAVAURL;

/*
  props
 */
const props = defineProps({
  courseId: Number,
  courseName: String,
});

/*
  Declare
*/
const classes = reactive({
  courseId: props.courseId,
  classDate: "",
  classTime: "",
  employeeId: "",
  coachSubstitute: 0,
  applicantsCeil: "15",
  applicantsFloor: "5",
  price: "150",
  classroomId: "",
});

const classroom = reactive({
  classroomId: "",
  classroomName: "",
  classroomCapacity: 30,
});

/*
  Emits
*/
const emit = defineEmits(["submitInsertClasses-emit"]);

/*
  Methods
 */

// Action for insert
const submitInsertClass = async (classroomCapacity, e) => {
  let today = new Date();
  let givenClassDate = new Date(classes.classDate);
  /*
    validation start
  */
  // classDate
  if (classes.classDate == "") {
    validatedInputState.classDate = "is-invalid";
    validationType.classDate = "stringEmpty";
    return;
  } else if (givenClassDate <= today) {
    validatedInputState.classDate = "is-invalid";
    validationType.classDate = "dateBefore";
    return;
  }
  // classTime
  if (classes.classTime == "") {
    validatedInputState.classTime = "is-invalid";
    return;
  }
  // coach
  await coachValidator(
    classes.employeeId,
    classes.classDate,
    classes.classTime
  );
  if (classes.employeeId == "") {
    validatedInputState.employeeId = "is-invalid";
    validationType.employeeId = "stringEmpty";
    return;
  } else if (coachValidationData.coachValidatingFactor) {
    validatedInputState.employeeId = "is-invalid";
    validationType.employeeId = "classConflict";
    return;
  }

  // classroom
  await classroomValidator(
    classes.classroomId,
    classes.classDate,
    classes.classTime
  );
  if (classes.classroomId == "") {
    validatedInputState.classroomId = "is-invalid";
    validationType.classroomId = "stringEmpty";
    return;
  } else if (classroomValidatingFactor.value) {
    console.log("classroom", classroomValidatingFactor.value);
    validatedInputState.classroomId = "is-invalid";
    validationType.classroomId = "classroomAlreadyBooked";
    return;
  }

  // applicantsCeil
  if (classes.applicantsCeil.trim() == "") {
    validatedInputState.applicantsCeil = "is-invalid";
    validationType.applicantsCeil = "stringEmpty";
    return;
  } else if (parseInt(classes.applicantsCeil.trim()) < 1) {
    validatedInputState.applicantsCeil = "is-invalid";
    validationType.applicantsCeil = "lessThanOne";
    return;
  } else if (parseInt(classes.applicantsCeil.trim()) > classroomCapacity) {
    validatedInputState.applicantsCeil = "is-invalid";
    validationType.applicantsCeil = "overClassroomCapacity";
    return;
  }
  // applicantsFloor
  if (classes.applicantsFloor.trim() == "") {
    validatedInputState.applicantsFloor = "is-invalid";
    validationType.applicantsFloor = "stringEmpty";
    return;
  } else if (parseInt(classes.applicantsFloor.trim()) < 0) {
    validatedInputState.applicantsFloor = "is-invalid";
    validationType.applicantsFloor = "negativeNumber";
    return;
  } else if (
    parseInt(classes.applicantsFloor.trim()) >
    parseInt(classes.applicantsCeil.trim())
  ) {
    validatedInputState.applicantsFloor = "is-invalid";
    validationType.applicantsFloor = "moreThanCeil";
    return;
  }

  // price
  if (classes.price.trim() == "") {
    validatedInputState.price = "is-invalid";
    validationType.price = "stringEmpty";
    return;
  } else if (parseInt(classes.price.trim()) < 0) {
    validatedInputState.price = "is-invalid";
    validationType.price = "negativeNumber";
    return;
  }

  /*
    validation end
  */

  // insert classes to DB
  const resInsertClasses = await axios
    .post(`${URL}/classes`, classes)
    .catch((error) => {
      console.log(error.toJSON());
    });

  //關閉Modal
  const insertModal = document.getElementById(
    `insertClassesModal${props.courseId}`
  );
  let getInstanceInsertModal = bootstrap.Modal.getInstance(insertModal);
  getInstanceInsertModal.toggle();
  router.push("/classes");
  emit("submitInsertClasses-emit");
  resetForm();
};

// Action for show classroom capacity for reference
const setclassroomCapacity = (e) => {
  classroom.classroomId = e.target.value;
  for (let room of allClassrooms._rawValue) {
    if (room.classroomId == classroom.classroomId) {
      classroom.classroomName = room.classroomName;
      classroom.classroomCapacity = room.classroomCapacity;
      break;
    }
  }
};

// Reset form
const resetForm = () => {
  classes.classDate = "";
  classes.classTime = "";
  classes.employeeId = "";
  classes.coachSubstitute = 0;
  classes.applicantsCeil = "15";
  classes.applicantsFloor = "5";
  classes.price = "150";
  classes.classroomId = "";
  classroomValidatingFactor.value = false;
};

/*
  Load datas
*/

// Load classroom data
const allClassrooms = ref([]);
const loadAllClassrooms = async () => {
  const URLAPI = `${URL}/classroom/listWithoutDescriptionsAndPics`;
  const response = await axios.get(URLAPI);
  // console.log(response.data)

  //取得所有分類放進allClassroom變數
  allClassrooms.value = response.data;
  // console.log(allClassrooms)
};
// Load employee data
const allCoachs = ref([]);
const loadAllCoachs = async () => {
  const URLAPI = `${URL}/employees/coachs`;
  const response = await axios.get(URLAPI);
  // console.log(response.data)

  //取得所有分類放進allClassroom變數
  allCoachs.value = response.data;
  // console.log(allCoachs)
};

/*
  Validation
*/
const validatedInputState = reactive({
  classDate: "", // 是否爲空, 是否小於今天，是否在？個月後
  classTime: "", // 是否爲空
  employeeId: "", // 是否爲空,教練是否衝堂
  classroomId: "", // 是否爲空,是否已使用
  applicantsCeil: "", // 是否爲空，是否<1，是否> classroom capacity,沒填自動補ceil值
  applicantsFloor: "", // 是否爲空，是否<0 ,沒填自動補0，不可>=ceil
  price: "", // 是否爲空，是否<0
});

// validation watcher
watch(classes, (newClasses) => {
  if (newClasses.classDate !== "") {
    validatedInputState.classDate = "";
    validationType.classDate = "";
  }
  if (newClasses.classTime !== "") {
    validatedInputState.classTime = "";
  }
  if (newClasses.employeeId !== "") {
    validatedInputState.employeeId = "";
  }
  if (newClasses.classroomId !== "") {
    validatedInputState.classroomId = "";
    validationType.classroomId = "";
  }
  if (
    newClasses.applicantsCeil.trim() !== "" &&
    parseInt(newClasses.applicantsCeil.trim()) >= 1
  ) {
    validatedInputState.applicantsCeil = "";
    validationType.applicantsCeil = "";
  }
  if (
    newClasses.applicantsFloor.trim() !== "" &&
    parseInt(newClasses.applicantsFloor.trim()) >= 0 &&
    parseInt(newClasses.applicantsFloor.trim()) <=
      parseInt(newClasses.applicantsCeil.trim())
  ) {
    validatedInputState.applicantsFloor = "";
    validationType.applicantsFloor = "";
  }
  if (
    newClasses.price.trim() !== "" &&
    parseInt(newClasses.price.trim()) >= 0
  ) {
    validatedInputState.price = "";
    validationType.price = "";
  }
});

// Validation Type
const validationType = reactive({
  classDate: "",
  employeeId: "",
  classroomId: "",
  applicantsCeil: "",
  applicantsFloor: "",
  price: "",
});

// coachValidator
const coachValidationData = reactive({
  classes: [],
  coachValidatingFactor: false,
});
const coachValidator = async (employeeid, selectedDate, selectedTime) => {
  const URLAPICOACH = `${URL}/employees/findClassesInDateRangeAndEmployeeid`;
  const resCoach = await axios
    .get(URLAPICOACH, {
      params: {
        employeeid: employeeid,
        classDate: selectedDate,
        classTime: selectedTime,
      },
    })
    .catch((error) => {
      console.log(error.toJSON());
    });
  if (resCoach.data != undefined) {
    coachValidationData.classes = resCoach.data;
  }

  if (coachValidationData.classes.length != 0) {
    coachValidationData.coachValidatingFactor = true;
    return;
  }
  coachValidationData.coachValidatingFactor = false;
};

// classroomValidator
const classroomValidationData = reactive({
  classes: [],
  rentOrder: [],
});

const classroomValidatingFactor = ref(false);
const classroomValidator = async (classroomId, selectedDate, selectedTime) => {
  // console.log(classroomId, selectedDate, selectedTime);
  const URLAPIRENTORDER = `${URL}/classroom/getClassroomInUseRentOrder`;
  const resRentOrder = await axios
    .get(URLAPIRENTORDER, {
      params: {
        classroomId: classroomId,
        rentdate: selectedDate,
        renttime: selectedTime,
      },
    })
    .catch((error) => {
      console.log(error.toJSON());
    });
  console.log(resRentOrder);
  console.log(resRentOrder.data);
  if (resRentOrder.data != undefined) {
    classroomValidationData.rentOrder = resRentOrder.data;
  }

  const URLAPICLASSES = `${URL}/classroom/getClassroomInUseClasses`;
  const resClasses = await axios
    .get(URLAPICLASSES, {
      params: {
        classroomId: classroomId,
        classDate: selectedDate,
        classTime: selectedTime,
      },
    })
    .catch((error) => {
      console.log(error.toJSON());
    });
  console.log(resClasses);
  console.log(resClasses.config);
  console.log(resClasses.data);
  if (resClasses.data != undefined) {
    classroomValidationData.classes = resClasses.data;
  }
  if (classroomValidationData.classes.length != 0) {
    console.log(classroomValidationData.classes.length);
    classroomValidatingFactor.value = true;
    return;
  }
  if (classroomValidationData.rentOrder.length != 0) {
    console.log(classroomValidationData.rentOrder.length);
    classroomValidatingFactor.value = true;
    return;
  }
  classroomValidatingFactor.value = false;
};

/*
  Life Cycle Hooks
*/

onMounted(() => {
  loadAllClassrooms();
  loadAllCoachs();
});
</script>

<style scoped>
.need-input {
  color: red;
}
</style>
