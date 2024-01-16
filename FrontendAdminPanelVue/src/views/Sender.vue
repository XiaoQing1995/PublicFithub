<template>
  <button @click="sendMessage">Send Message</button>
</template>

<script setup>
import { useMyStore } from '@/stores/test'; // 導入你的 Store
const myStore = useMyStore();

const sendMessage = () => {
  myStore.setMessage('Hello from TEST!');
};

</script>
