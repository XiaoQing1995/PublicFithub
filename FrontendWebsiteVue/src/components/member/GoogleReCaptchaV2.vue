<script setup>
import { reactive } from 'vue';
import vueRecaptcha from 'vue3-recaptcha2';
import axios from "axios"

const url = import.meta.env.VITE_API_JAVAURL

const test ={
    response_token:'',
}

const emit = defineEmits(["recaptcha"]);

const instance_vueRecaptchaV2 = reactive({
    // 請換成你註冊的 SiteKey
    // Please change to your SiteKey.
    data_v2SiteKey: '6LdVjScoAAAAAB0J23F9xuSGdZHPG7wLiPU7H0Z1',

    recaptchaVerified: async (response_token) => {
        test.response_token = response_token;
        // console.log(response_token);
        // 連接後端API，給後端進行認證
        // Connect to your Backend service.
        const response = await axios.post(`${url}/memberloginrecaptcha`, test)
        if(response.status == 200){
            emit('recaptcha', 'true');
        }
    },
    recaptchaExpired: () => {
        // 驗證過期後進行的動作
        // After recaptcha is expired, the action you can do.
        emit('recaptcha', 'false');
        // console.log('驗證過期啦QAQ');
    },
    recaptchaFailed: () => {
        // 驗證失敗進行的動作
        // After recaptcha is failed, the action you can do.
        emit('recaptcha', 'false');
        // console.log('驗證失敗啦QAQ')
    },
});
</script>

<template>
    <vue-recaptcha :sitekey="instance_vueRecaptchaV2.data_v2SiteKey" size="normal" theme="light" hl="zh-TW"
        @verify="instance_vueRecaptchaV2.recaptchaVerified" @expire="instance_vueRecaptchaV2.recaptchaExpired"
        @fail="instance_vueRecaptchaV2.recaptchaFailed" />
</template>