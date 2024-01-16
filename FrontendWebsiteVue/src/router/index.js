import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/index.vue";
import { authToken } from "@/api/login";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/rent",
      name: "rent",
      component: () => import("../views/rent.vue"),
    },
    {
      path: "/rentorder",
      name: "rentorder",
      component: () => import("../views/rentorder.vue"),
    },
    {
      path: "/activity",
      name: "activity",
      component: () => import("../views/activity.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/login.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/register.vue"),
    },
    {
      path: "/member",
      name: "member",
      component: () => import("../views/member.vue"),
      meta: {
        needLogin: true,
      },
    },
    {
      path: "/editprofile",
      name: "editprofile",
      component: () => import("../views/editprofile.vue"),
      meta: {
        needLogin: true,
      },
    },
    {
      path: "/editpassword",
      name: "editpassword",
      component: () => import("../views/editpassword.vue"),
      meta: {
        needLogin: true,
      },
    },
    {
      path: "/forgotpassword",
      name: "forgotpassword",
      component: () => import("../views/forgotpassword.vue"),
    },
    {
      path: "/resetpassword/:token",
      name: "resetpassword",
      component: () => import("../views/resetpassword.vue"),
    },
    {
      path: "/showorder",
      name: "showorder",
      component: () => import("../views/showorder.vue"),
      meta: {
        needLogin: true,
      },
    },
    {
      path: "/showrentorder",
      name: "showrentorder",
      component: () => import("../views/showrentorder.vue"),
      meta: {
        needLogin: true,
      },
    },
    {
      path: "/course/:categoryid",
      name: "courseCategory",
      component: () => import("../views/course.vue"),
    },
    {
      path: "/course/detail/:courseid",
      name: "courseDetail",
      component: () => import("../views/courseDetail.vue"),
    },
    {
      path: "/cart",
      name: "cart",
      component: () => import("../views/cart.vue"),
    },
    {
      path: "/checkout",
      name: "checkout",
      component: () => import("../views/checkout.vue"),
    },
    {
      path: "/ordercheck",
      name: "ordercheck",
      component: () => import("../views/orderCheck.vue"),
    },
    {
      path: "/disclaimer",
      name: "disclaimer",
      component: () => import("../views/disclaimer.vue"),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition && to.meta.keepAlive) {
      return savedPosition;
    }
    return { left: 0, top: 0 };
  },
});

router.beforeResolve(async (to) => {
  if (to.meta.needLogin) {
    const isLogin = window.localStorage.getItem("isLogin");
    if (!isLogin) {
      return { name: "login" };
    }

    const token = window.localStorage.getItem("token");
    const authResult = await authToken(token);
    if (!authResult.status) {
      return { name: "login" };
    }
  }
});

export default router;
