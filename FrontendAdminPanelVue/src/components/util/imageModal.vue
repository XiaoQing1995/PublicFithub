<template>
    <div class="modal fade" :id="`staticBackdropPic${parentId}`" data-bs-backdrop="static" data-bs-keyboard="false"
        tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">{{ modalTitle }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <picture>
                        <img :src="`${URL}/course/getImg?cid=${parentId}`" class="img-fluid" alt="not Found">
                        <figcaption>{{ parentImgName }}</figcaption>
                    </picture>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script setup >
const URL = import.meta.env.VITE_API_JAVAURL;
const props = defineProps({
    parentId: Number,
    parentImgName: String,
    parentImgPath: String,
    modalTitle: String,
})
</script>
    
<style></style>