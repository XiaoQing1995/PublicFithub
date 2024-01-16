<template>
  <n-space justify="center">
    <!-- <n-pagination :page-count="10" size="large" show-quick-jumper>
      <template #goto> Go! </template>
    </n-pagination> -->
    <n-pagination
      v-model:page="page"
      size="large"
      :page-count="props.totalPages"
      show-quick-jumper
    >
      <template #goto> 前往 </template>
    </n-pagination>
  </n-space>
</template>

<script setup>
/*
  imports
*/
import { ref, watch } from "vue";
import { NSpace, NPagination } from "naive-ui";

/*
  Props
*/
const props = defineProps({
  page: Number,
  totalPages: Number,
});

/*
  Emits
*/
const emits = defineEmits(["pageEmit"]);
const page = ref(props.page);

/*
  watcher
*/
watch(page, () => {
  console.log(page.value);
  emits("pageEmit", page.value);
});
</script>

<style scoped></style>
