<template>
  <div class="modal fade" id="insertModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="insertModalLabel">新增課程資料</h5>
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
            <label for="categoryId" class="col-form-label"
              ><span class="need-input">*</span>課程分類 :</label
            >
            <select
              class="form-select"
              :class="validatedInputState.categoryId"
              v-model="course.categoryId"
              id="categoryId"
            >
              <option selected value="" style="display: none">請選擇</option>
              <option
                v-for="{ categoryId, categoryName } in allCourseCategories"
                :value="categoryId"
              >
                {{ categoryName }}
              </option>
            </select>
            <div class="invalid-feedback">請選擇課程分類</div>
          </div>

          <div class="mb-3">
            <label for="message-text" class="col-form-label"
              ><span class="need-input">*</span>課程名稱 :</label
            >
            <input
              type="text"
              class="form-control"
              :class="validatedInputState.courseName"
              v-model.trim="course.courseName"
            />
            <div class="invalid-feedback">請填寫課程名稱</div>
          </div>

          <div class="mb-3">
            <label for="message-text" class="col-form-label">課程圖片 :</label>
            <div class="my-2 text-center">
              <img
                v-if="selectedFile.state"
                :src="selectedFile.fileBase64"
                class="img-fluid"
                alt="not Found"
              />
              <div class="text-muted">圖片預覽</div>
            </div>
            <input
              class="form-control my-2"
              type="file"
              accept="image/*"
              @change="fileChange"
            />
          </div>

          <div class="mb-3">
            <label for="message-text" class="col-form-label">課程描述 :</label>
            <textarea
              class="form-control"
              :class="validatedInputState.courseDescription"
              rows="6"
              v-model.trim="course.courseDescription"
            ></textarea>
            <div class="invalid-feedback">字數限制為120字</div>
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
            id="sendInsertCourse"
            class="btn btn-primary"
            @click="submitInsertCourse"
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
import { ref, reactive, watch } from "vue";
import axios from "axios";
const URL = import.meta.env.VITE_API_JAVAURL;

/*
  props
*/
// solution 1
// const props = defineProps(['courseCategories'])

// solution 2
const props = defineProps({
  allCourseCategories: Object,
});

/*
  Declare
*/
const course = reactive({
  categoryId: "",
  courseName: "",
  courseDescription: "",
  courseImgPath: "",
});

/*
  Img handler
  */

const formData = new FormData();
const selectedFile = ref({
  file: null,
  fileBase64: null,
  state: false,
});
const fileChange = (e) => {
  // Form solution
  selectedFile.value.state = false;
  // console.log(e.target.files);
  selectedFile.value.file = e.target.files[0];
  // console.log(selectedFile.value.file);
  // console.log(file);
  formData.append("photoContent", selectedFile.value.file);
  // console.log(formData);

  // base64 solution
  base64Encoder();
};

// base64 encoder
const base64Encoder = () => {
  if (!selectedFile.value || selectedFile.value.length === 0) {
    return;
  }
  const file = selectedFile.value.file;
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = (event) => {
    console.log(event.target.result);
    selectedFile.value.fileBase64 = event.target.result;
    selectedFile.value.state = true;
    // 將 base64Data 直接塞入 course 陣列中的物件
    // course.courseImgPath = base64Data;
  };
};

/*
  Emits
*/
const emit = defineEmits(["submitInsertCourse-emit"]);

/*
  Methods
 */

// Action for insert
const submitInsertCourse = async () => {
  // validation
  if (course.categoryId == "") {
    validatedInputState.categoryId = "is-invalid";
    return;
  }
  if (course.courseName == "") {
    validatedInputState.courseName = "is-invalid";
    return;
  }
  if (course.courseDescription.trim().length > 120) {
    // 字數限制120字
    validatedInputState.courseDescription = "is-invalid";
    return;
  }

  // save img and get image path
  if (formData.get("photoContent") != null) {
    const resUploadFile = await axios
      .post(`${URL}/course/uploadImg`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((error) => {
        console.log(error.toJSON());
      });
    // console.log(resUploadFile);
    course.courseImgPath = resUploadFile.data;
    // console.log(course.courseImgPath);
  }

  // save courseData to DB
  const resInsertCourse = await axios
    .post(`${URL}/course`, course)
    .catch((error) => {
      console.log(error.toJSON());
    });

  //關閉Modal
  const insertModal = document.getElementById(`insertModal`);
  let getInstanceInsertModal = bootstrap.Modal.getInstance(insertModal);
  getInstanceInsertModal.toggle();

  // 傳送event至parent componont
  emit("submitInsertCourse-emit");
};

// Reset form
const resetForm = () => {
  course.categoryId = "";
  course.courseName = "";
  course.courseDescription = "";
};

/*
  Validation
*/
const validatedInputState = reactive({
  courseName: "", // 是否爲空
  categoryId: "", // 是否爲空
  courseDescription: "", // 字數120字
  courseImgPath: "", // 圖片大小
});

// validation watcher
watch(course, (newCourse) => {
  if (newCourse.categoryId !== "") {
    validatedInputState.categoryId = "";
  }
  if (newCourse.courseName.trim() !== "") {
    validatedInputState.courseName = "";
  }
  if (newCourse.courseDescription.trim().length <= 120) {
    // 字數限制120字
    validatedInputState.courseDescription = "";
  }
});
</script>

<style scoped>
.need-input {
  color: red;
}

.img-modal {
  width: 100%;
  height: 100%;
}
</style>
