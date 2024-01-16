<template>
        <input type="date" @change="inputHandler" v-model="keyword" class="form-control mb-3">
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
    