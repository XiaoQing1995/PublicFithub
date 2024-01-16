<template>
    <div id="layoutSidenav">
      <div id="layoutSidenav_content">
        <div class="container-fluid px-4">
          <h1 class="mt-4" style="text-align: center">測試用</h1>
          <div class="card mb-4">
            <div class="card-body table-responsive">
              <button
                type="submit"
                class="btn btn-outline-info"
                data-bs-toggle="modal"
                data-bs-target="#insertModal"
              >
                新增部門
              </button>
              <table id="departmentsTable" class="table table-bordered">
                <thead class="align-middle text-center">
                  <div>
                    <button @click="loadImage()">讀取</button>
                    <img style="width: 600px;" :src="imageData" alt="Uploaded Image">
                    <img style="width: 600px;" :src="imageData2" alt="Uploaded Image">
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
import { ref , onMounted } from "vue";
import axios from "axios";

const selectedFile = ref(null);
const imageData = ref(null);
const imageData2 = ref(null);
const url = import.meta.env.VITE_API_JAVAURL;


const loadImage = async () => {

    try {
      const response = await axios.get(`${url}/coachpics/9`);
      imageData.value = `data:image/jpeg;base64,${response.data.cpicfile}`
      imageData2.value = `data:image/png;base64,${response.data.cpicfile}`
    } catch (error) {
      console.error(error);
    }

};
</script>
