<template>
  <div class="progress">
    <div
      class="progress-bar bg-warning"
      role="progressbar"
      :style="`width: ${percent}%`"
      aria-valuenow="25"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      {{ percent }}%
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  percent: Number,
});
</script>

<style scoped></style>
