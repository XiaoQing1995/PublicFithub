<template>
        <input type="search" @keyup="inputHandler" v-model="keyword" placeholder="請輸入名稱" class="form-control mb-3">
    </template>    
    <script setup>
    import { ref } from 'vue'
    const keyword = ref("")  //產品搜尋
    const emit = defineEmits(["searchInput"])
    const inputHandler = () => {
        emit("searchInput", keyword.value)
    }
    </script>    
    <style scoped></style>
    