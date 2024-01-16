<template>
  <p>{{ receivedMessage }}</p>
</template>

<script setup>
import { useMyStore } from '@/stores/test'; // 導入你的 Store

const myStore = useMyStore();

const receivedMessage = myStore.message;
</script>
