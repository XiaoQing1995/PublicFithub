<script setup>
import axios from "axios";
import { ref, reactive, onMounted, computed } from "vue";
import router from "@/router";
import Swal from 'sweetalert2'

const url = import.meta.env.VITE_API_JAVAURL;

const registerData = reactive({
  memberemail: "",
  memberpassword: "",
  memberphoneno: "",
  membername: "",
  membergender: "",
  membercity: "",
  memberzone: "",
  memberaddress: "",
  memberbirthday: "",
});

const checkpassword = reactive({
  check: true,
  againpassword: '',
});



const verify = reactive({
  email: "",
  verificationcode: "",
});

const verifystatus = ref(false)

const countdown = ref(0);
let timer;

const verifybutton = reactive({
  button: "發送驗證碼",
});

const register = async () => {
  //  
  // console.log(!verifystatus.value)

  if (
    !registerData.memberemail.trim() ||
    !registerData.memberpassword.trim() ||
    !registerData.memberphoneno.trim() ||
    !registerData.membername.trim() ||
    !registerData.membergender.trim() ||
    !registerData.membercity.trim() ||
    !registerData.memberzone.trim() ||
    !registerData.memberaddress.trim() ||
    !registerData.memberbirthday.trim()
  ) {
    Swal.fire({
      title: '請輸入正確資料',
      icon: 'warning',
      confirmButtonText: '確定'
    })
    return;
  }

  if (!verifystatus.value) {
    Swal.fire({
      title: '請驗證信箱',
      icon: 'warning',
      confirmButtonText: '確定'
    })
    return;
  }

  if (!checkpassword.check) {
    return;
  }

  try {
    const response = await axios.post(`${url}/members`, registerData);
    if (response.status == 200) {

      Swal.fire({
        title: '註冊成功，請登入',
        icon: 'success',
        confirmButtonText: '確定'
      }).then((result) => {
        if (result.isConfirmed) {
          // 點擊 "確定" 按钮，執行頁面跳转
          router.push({ name: "login" })
        }
      });
    }
  } catch (error) {
  }
};

const sendVerificationCode = async () => {
  if (!registerData.memberemail.trim()) {
    Swal.fire({
      title: '請輸入email',
      icon: 'warning',
      confirmButtonText: '確定'
    })
    return;
  }
  verify.email = registerData.memberemail;

  try {

    const response = await axios.post(`${url}/verificationcode`, verify);
    if (response.status == 200) {
      startCountdown();
      Swal.fire({
        title: '發送成功，請至信箱收取驗證碼',
        icon: 'success',
        confirmButtonText: '確定'
      })
      // alert("發送成功，請至信箱收取驗證碼")
    }
  } catch (error) {
    if (error.response.status == 400) {
      Swal.fire({
        title: 'email已經被使用',
        icon: 'warning',
        confirmButtonText: '確定'
      })
    } else {
      Swal.fire({
        title: '請輸入正確email',
        icon: 'warning',
        confirmButtonText: '確定'
      })
    }
  }
}

const checkVerificationCode = async () => {
  if (!registerData.memberemail.trim() ||
    !verify.verificationcode.trim()) {
    Swal.fire({
      title: '請輸入email及驗證碼',
      icon: 'warning',
      confirmButtonText: '確定'
    })
    return;
  }
  verify.email = registerData.memberemail;

  try {
    const response = await axios.post(`${url}/verificationcode/check`, verify);
    verifystatus.value = true;
    Swal.fire({
      title: '驗證成功',
      icon: 'success',
      confirmButtonText: '確定'
    })
  } catch (error) {
    verifystatus.value = false;
    Swal.fire({
      title: '驗證碼錯誤',
      icon: 'warning',
      confirmButtonText: '確定'
    })
  }
}

const test = ref({})

const startCountdown = () => {

  countdown.value = 60; // 设置倒计时秒数
  test.value = timer = setInterval(() => {
    var verifybtn = document.getElementById('verifybtn')
    if (countdown.value > 0) {
      verifybtn.disabled = true;
      verifybutton.button = "重新發送驗證碼(" + countdown.value + ")"
      countdown.value -= 1;
    } else {
      clearInterval(timer); // 倒计时结束时清除定时器
      verifybutton.button = "發送驗證碼"
      verifybtn.disabled = false;
    }
  }, 1000); // 每秒减少1秒
};

const inputpassword = () => {
  if (registerData.memberpassword === checkpassword.againpassword) {
    checkpassword.check = true
  } else {
    checkpassword.check = false
  }
}


const goBack = () => {

  router.back();
}

router.beforeResolve(async (to) => {
  clearInterval(test.value)
  console.log("test")
});

</script>

<template>
  <section class="page-section" style="background-color: #E8E1D4;">
    <div style="height: 100px;background-color: #E8E1D4;"></div>
    <div class="container">
      <div class="row d-flex justify-content-center align-items-center">
        <div class="col-lg-6">
          <div class="card" style="border-radius: 1rem;">
            <div class="row g-0">
              <div class="col-lg-12 d-flex align-items-center">
                <div class="card-body  text-black">
                  <h1 class="text-center">會員註冊</h1>
                  <hr>
                  <!-- 信箱 -->
                  <div>
                    <div>
                      <input type="button" value="測試資料" class="btn btn-secondary ms-1" />
                    </div>
                    <label class="form-label mb-1">信箱</label><span v-if="!registerData.memberemail"
                      class="text-danger">*</span>
                    <input type="email" class="form-control form-control-lg" v-model="registerData.memberemail"
                      placeholder="abc123456@example.com" />
                    <div class="my-1">
                      <input type="button" class="btn btn-secondary" v-model="verifybutton.button"
                        @click="sendVerificationCode" id="verifybtn">
                    </div>
                    <input type="text" placeholder="輸入驗證碼" v-model="verify.verificationcode">
                    <input type="button" class="btn btn-secondary ms-1" value="驗證" @click="checkVerificationCode">
                  </div>

                  <!-- 密碼 -->
                  <div class="mb-1">
                    <label class="form-label">密碼</label>
                    <span v-if="!registerData.memberpassword" class="text-danger">*</span>
                    <input type="password" class="form-control" v-model="registerData.memberpassword"
                      @keyup="inputpassword" />
                  </div>

                  <!-- 再次確認密碼 -->
                  <div class="mb-1">
                    <label class="form-label">再次確認密碼</label>
                    <span v-if="!checkpassword.againpassword" class="text-danger">*</span>
                    <input type="password" class="form-control" v-model="checkpassword.againpassword"
                      @keyup="inputpassword">
                    <span v-if="!checkpassword.check" class="text-danger">密碼不相符</span>
                  </div>

                  <!-- 手機號碼 -->
                  <div class="mb-1">
                    <label class="form-label">手機號碼</label>
                    <span v-if="!registerData.memberphoneno" class="text-danger">*</span>
                    <input type="email" class="form-control" v-model="registerData.memberphoneno" />
                  </div>

                  <!-- 姓名 -->
                  <div class="mb-1">
                    <label class="form-label">姓名</label>
                    <span v-if="!registerData.membername" class="text-danger">*</span>
                    <input type="email" class="form-control" v-model="registerData.membername" />
                  </div>

                  <!-- 性別 -->
                  <div class="mb-1">
                    <label class="form-label">性別</label>
                    <span v-if="!registerData.membergender" class="text-danger">*</span>
                    <input style="width: 1em;" type="radio" name="gender" value="男"
                      v-model="registerData.membergender" />男
                    <input style="width: 1em;" type="radio" name="gender" value="女"
                      v-model="registerData.membergender" />女
                  </div>

                  <!-- 縣市 -->
                  <div class="mb-1">
                    <label class="form-label">縣市</label>
                    <span v-if="!registerData.membercity" class="text-danger">*</span>
                    <input type="text" class="form-control" v-model="registerData.membercity" />
                  </div>

                  <!-- 地區 -->
                  <div class="mb-1">
                    <label class="form-label">地區</label>
                    <span v-if="!registerData.memberzone" class="text-danger">*</span>
                    <input type="text" class="form-control" v-model="registerData.memberzone" />
                  </div>

                  <!-- 地址 -->
                  <div class="mb-1">
                    <label class="form-label">地址</label>
                    <span v-if="!registerData.memberaddress" class="text-danger">*</span>
                    <input type="text" class="form-control" v-model="registerData.memberaddress" />
                  </div>

                  <!-- 生日 -->
                  <div class="mb-1">
                    <label class="form-label">生日</label>
                    <span v-if="!registerData.memberbirthday" class="text-danger">*</span>
                    <input type="date" class="form-control" v-model="registerData.memberbirthday" />
                  </div>

                  <div class="mb-1 mt-3">
                    <button class="btn btn-dark btn-lg btn-block" type="button" @click="goBack">返回</button>
                    <button class="btn btn-dark btn-lg btn-block ms-1" type="button" @click="register">註冊</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
