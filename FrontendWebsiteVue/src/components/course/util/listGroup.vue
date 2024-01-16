<template>
  <div class="list-group d-flex justify-content-center my-5">
    <RouterLink
      to="/course/0"
      :disabled="pageCourseCategoryId == 0"
      class="list-group-item list-group-item-action"
      :class="{ disabled: pageCourseCategoryId == 0 }"
      >全部課程</RouterLink
    >
    <RouterLink
      v-for="{ categoryId, categoryName, index } in allCourseCategories"
      :to="`/course/${categoryId}`"
      :disabled="categoryId == pageCourseCategoryId"
      class="list-group-item list-group-item-action"
      :class="{ disabled: categoryId == pageCourseCategoryId }"
      >{{ categoryName }}</RouterLink
    >
    <!-- <button class="list-group-item list-group-item-action" disabled>
      套餐
    </button> -->
  </div>
</template>

<script setup>
/*
  imports
*/
import { RouterLink } from "vue-router";

/*
  props
*/

const props = defineProps({
  urlPattern: String,
  allCourseCategories: Object,
  pageCourseCategoryId: Number,
});
</script>

<style scoped></style>
