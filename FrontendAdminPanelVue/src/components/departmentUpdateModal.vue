<template>
    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModal" aria-hidden="true"
        data-bs-backdrop="static">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">修改部門名稱</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        部門編號:<input type="text" class="form-control" v-model="updateDetpId" readonly>
                    </div>
                    <div class="mb-3">
                        部門名稱:<input type="text" class="form-control" v-model="updateDeptName" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">送出</button>
                </div>

            </div>
        </div>
    </div>
    <button type="submit" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#updateModal"
        @click="handleUpdate">修改</button>
</template>
  
<script setup>
const props = defineProps({
    deptId: Number,
    deptName: Number
})

const emit = defineEmits(["showUpdateModal"])



</script>

