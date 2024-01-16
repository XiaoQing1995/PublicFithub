<template>
  <table class="table table-bordered">
    <thead class="align-middle text-center">
      <tr>
        <th>名稱</th>
        <th>優惠碼</th>
        <th>截止日期</th>
        <th>使用門檻</th>
        <th>優惠券折扣</th>
        <th>已使用量</th>
      </tr>
    </thead>

    <tbody class="align-middle text-center">
      <tr v-for="(coupon, couponindex) in coupons" :key="couponindex">
        <td>{{ coupon.couponname }}</td>
        <td class="text-primary">{{ coupon.couponcode }}</td>
        <td>{{ coupon.couponenddate }}</td>
        <td>{{ coupon.couponthreshold }}</td>
        <td>{{ coupon.coupondiscount }}</td>
        <td>
          {{ ((coupon.couponused / coupon.couponceil) * 100).toFixed(2) }}%
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import axios from "axios";
import { reactive, ref, onMounted } from "vue";
const URL = import.meta.env.VITE_API_JAVAURL;
//建立優惠券物件
const coupon = reactive({
  couponcategoriesid: "",
  couponname: "",
  couponstate: "",
  coupongeneratedate: "",
  couponenddate: "",
  couponcode: "",
  couponamount: "",
  couponceil: "",
  coupondiscount: "",
  couponused: "",
  couponthreshold: "",
});

const coupons = ref([]); // 儲存SelectAll的優惠券

// 從伺服器獲取 JSON 格式優惠券資料
const getcoupons = async () => {
  try {
    const response = await axios.get(`${URL}/coupons`); // 替換為實際的 API URL
    coupons.value = response.data; //data為response物件的屬性，通常是返回的JSON格式資料
    console.log(coupons.value);
  } catch (error) {
    console.error("Error getcoupons data:", error);
  }
};

onMounted(() => {
  getcoupons();
});
</script>

<style scoped></style>
