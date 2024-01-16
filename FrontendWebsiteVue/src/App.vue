<script setup>
import NavbarFooter from "./components/NavbarFooter.vue";
import NavbarTop from "./components/NavbarTop.vue";
import { RouterLink, RouterView } from "vue-router";
import { NDialogProvider, NMessageProvider } from "naive-ui";
</script>

<template>
  <NavbarTop></NavbarTop>
  <n-dialog-provider>
    <n-message-provider>
      <RouterView></RouterView>
    </n-message-provider>
  </n-dialog-provider>
  <NavbarFooter></NavbarFooter>
</template>

<style scoped></style>
