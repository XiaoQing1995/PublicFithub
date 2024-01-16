<template>
  <n-space>
    <n-tag size="large"> {{ props.tagText }} </n-tag>
  </n-space>
</template>

<script setup>
const props = defineProps({
  tagText: String,
});
</script>

<style scoped></style>
