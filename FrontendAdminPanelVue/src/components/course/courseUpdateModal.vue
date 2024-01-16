<template>
  <div class="modal fade" :id="`updateModal${courseId}`" tabindex=" -1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="updateModalLabel">修改課程資料</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body text-left">
          <form
            :id="`updateCourseForm${courseId}`"
            method="post"
            enctype="multipart/form-data"
            action="#"
          >
            <div class="mb-3">
              <label for="categoryId" class="col-form-label"
                ><span class="need-input">*</span>課程分類 :</label
              >
              <select
                class="form-select"
                v-model="course.categoryId"
                :id="`categoryIdUpdate${courseId}`"
              >
                <option
                  selected
                  :value="`${courseCategories.categoryId}`"
                  style="display: none"
                >
                  {{ courseCategories.categoryName }}
                </option>
                <option
                  v-for="{ categoryId, categoryName } in allCourseCategories"
                  :value="categoryId"
                >
                  {{ categoryName }}
                </option>
              </select>
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
              <label for="message-text" class="col-form-label"
                >課程圖片 :</label
              >
              <div class="text-center">
                <img
                  v-if="!selectedFile.state"
                  :src="`${URL}/course/getImg?cid=${courseId}`"
                  class="img-fluid"
                  alt="not Found"
                />
                <img
                  v-else-if="selectedFile.state"
                  :src="selectedFile.fileBase64"
                  class="img-fluid"
                  alt="not Found"
                />
                <div class="text-muted">圖片預覽</div>
              </div>
              <input
                class="form-control"
                type="file"
                accept="image/*"
                @change="fileChange"
              />
            </div>

            <div class="mb-3">
              <label for="message-text" class="col-form-label"
                >課程描述 :</label
              >
              <textarea
                class="form-control"
                :class="validatedInputState.courseDescription"
                rows="6"
                v-model.trim="course.courseDescription"
              ></textarea>
              <div class="invalid-feedback">字數限制為120字</div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            id="updateCourseSend"
            class="btn btn-primary"
            @click="submitUpdateCourse"
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
const URL = import.meta.env.VITE_API_JAVAURL;
import { ref, reactive, watch } from "vue";
import axios from "axios";

/*
  props
*/
const props = defineProps({
  courseId: Number,
  courseCategories: Object,
  courseName: String,
  courseImgPath: String,
  courseDescription: String,
  allCourseCategories: Object,
});

/*
  Declare
*/

const course = reactive({
  courseId: props.courseId,
  courseName: props.courseName,
  courseImgPath: props.courseImgPath,
  categoryId: props.courseCategories.categoryId,
  courseDescription: props.courseDescription,
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
formData.append("cId", props.courseId);
formData.append("courseImgPath", props.courseImgPath);
formData.append("_method", "put");
const fileChange = (e) => {
  selectedFile.value.state = false;
  selectedFile.value.file = e.target.files[0];
  // console.log(selectedFile.value.file);
  formData.append("photoContent", selectedFile.value.file);
  // console.log(formData.get("photoContent"));

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
const emit = defineEmits(["submitUpdateCourse-emit"]);

/*
  Methods
 */
// Action for update
const submitUpdateCourse = async (e) => {
  // validation
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
    console.log(formData.photoContent);
    const resUploadFile = await axios
      .put(`${URL}/course/uploadImg`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((error) => {
        console.log(error.toJSON());
      });
    // console.log(resUploadFile);
    course.courseImgPath = resUploadFile.data;
  }
  // console.log(course.courseImgPath);
  // console.log("I am" + props.courseId);

  // put courseData to DB
  const resUpdateCourse = await axios
    .put(`${URL}/course`, course)
    .catch((error) => {
      console.log(error.toJSON());
    });

  //關閉Modal
  const upadteModal = document.getElementById(`updateModal${props.courseId}`);
  let getInstanceUpdateModal = bootstrap.Modal.getInstance(upadteModal);
  getInstanceUpdateModal.toggle();

  // 傳送event至parent componont
  emit("submitUpdateCourse-emit");
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
</style>
