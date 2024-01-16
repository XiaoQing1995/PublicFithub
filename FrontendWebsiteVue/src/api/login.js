import axios from "axios"
const url = import.meta.env.VITE_API_JAVAURL

//登入程式
async function login(email, password) {
    const result = {
        status: 1,
        token: "",
        memberid: 0,
        membername: "",
        memberemail: "",
    }

    const data = {
        memberemail: email,
        memberpassword: password
    }
    const res = await axios.post(`${url}/memberlogin`, data)
    if (res.data.status) {
        result.status = 0
        result.token = res.data.token
        result.memberid = res.data.memberid
        result.membername = res.data.membername
        result.memberemail = res.data.memberemail
        
        setLoginStore({
            isLogin: true,
            token: result.token,
            memberid: res.data.memberid,
            membername: res.data.membername,
            memberemail: res.data.memberemail,
        })
    }

    return result
}

async function googleLogin(email, name) {
    const result = {
        status: 1,
        token: "",
        memberid: 0,
        membername: "",
        memberemail: "",
    }

    const data = {
        memberemail: email,
        membername: name
    }
    const res = await axios.post(`${url}/memberGooglelogin`, data)
    if (res.data.status) {
        result.status = 0
        result.token = res.data.token
        result.memberid = res.data.memberid
        result.membername = res.data.membername
        result.memberemail = res.data.memberemail
        
        setLoginStore({
            isLogin: true,
            token: result.token,
            memberid: res.data.memberid,
            membername: res.data.membername,
            memberemail: res.data.memberemail,
        })
    }

    return result
}



async function authToken(token) {
    const result = {
        status: false,
        token: "",
        memberid: "",
        membername: "",
        memberemail: "",
    }
    const data = {
        token: token
    }
    const res = await axios.post(`${url}/memberauth`, data)
    if (res.data.status) {
        result.status = true
        result.token = res.data.token
        result.memberid = res.data.memberid
        result.membername = res.data.membername
        result.memberemail = res.data.memberemail
        setLoginStore({
            isLogin: true,
            token: result.token,
            memberid: res.data.memberid,
            membername: res.data.membername,
            memberemail: res.data.memberemail,
        })
    } else {
        setLoginStore({
            isLogin: false,
            token: "",
            memberid: "",
            membername: "",
            memberemail: "",
        })
    }

    return result
}


function setLoginStore(options) {
    window.localStorage.setItem("isLogin", options.isLogin)
    window.localStorage.setItem("token", options.token)
    window.localStorage.setItem("memberid", options.memberid)
    window.localStorage.setItem("membername", options.membername)
    window.localStorage.setItem("memberemail", options.memberemail)
}


export { login, googleLogin, authToken }