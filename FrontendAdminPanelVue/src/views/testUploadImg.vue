<template>
  <div id="layoutSidenav">
    <div id="layoutSidenav_content">
      <div class="container-fluid px-4">
        <h1 class="mt-4" style="text-align: center">測試用</h1>
        <div class="card mb-4">
          <div class="card-body table-responsive">
            <button type="submit" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#insertModal">
              新增部門
            </button>
            <table id="departmentsTable" class="table table-bordered">
              <thead class="align-middle text-center">
                <div>
                  <input id="inputImg" type="file" multiple accept="image/jpeg" />
                  <button @click="uploadImage()">上傳</button>
                </div>
              </thead>
              <tbody class="align-middle text-center"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const selectedFile = ref(null);
const url = import.meta.env.VITE_API_JAVAURL;


onMounted(() => {
  var inputImg = document.getElementById('inputImg')

  inputImg.addEventListener('change', function (e) {
    selectedFile.value = e.target.files;

  })
});

const uploadImage = async () => {
  if (!selectedFile.value || selectedFile.value.length === 0) {
    return;
  }

  for (let i = 0; i < selectedFile.value.length; i++) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result;
      const jsonPayload = { employeeid: 4, cpicfile: base64Image };

      try {
        const response = await axios.post(`${url}/coachpics`, jsonPayload);
      } catch (error) {
        console.error(error);
      }
    };

    reader.readAsDataURL(selectedFile.value[i]);
  }

};
</script>
