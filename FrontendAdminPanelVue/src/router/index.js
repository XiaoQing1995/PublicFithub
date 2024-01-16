import { createRouter, createWebHistory } from "vue-router";
import { authToken, logout } from "@/api/login";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/backstageView.vue"),
      meta: {
        needLogin: true,
        loa: 1,
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/loginView.vue"),
    },
    {
      path: "/navbartop",
      name: "navbartop",
      component: () => import("../components/NavbarTop.vue"),
      meta: {
        needLogin: true,
      },
      path: "/coupons",
      name: "coupons",
      component: () => import("../views/coupons.vue"),
    },
    {
      path: "/couponcategories",
      name: "couponcategories",
      component: () => import("../views/couponcategories.vue"),
    },
    {
      path: "/orders",
      name: "orders",
      component: () => import("../views/orders.vue"),
    },
    {
      path: "/orderitem",
      name: "orderitem",
      component: () => import("../views/orderitem.vue"),
    },
    {
      path: "/navbarleft",
      name: "navbarleft",
      component: () => import("../components/NavbarLeft.vue"),
      meta: {
        needLogin: true,
      },
    },
    {
      path: "/department",
      name: "department",
      component: () => import("../views/department.vue"),
      meta: {
        needLogin: true,
        loa: 3,
      },
    },
    {
      path: "/testUploadImg",
      name: "testUploadImg",
      component: () => import("../views/testUploadImg.vue"),
      meta: {
        needLogin: true,
      },
    },
    {
      path: "/testLoadImg",
      name: "testLoadImg",
      component: () => import("../views/testLoadImg.vue"),
      meta: {
        needLogin: true,
      },
    },
    {
      path: "/employee",
      name: "employee",
      component: () => import("../views/employee.vue"),
      meta: {
        needLogin: true,
        loa: 3,
      },
    },
    {
      path: "/course",
      name: "course",
      component: () => import("../views/indexCourse.vue"),
    },
    {
      path: "/classes",
      name: "classes",
      component: () => import("../views/indexClasses.vue"),
    },
    {
      path: "/announcement",
      name: "announcement",
      component: () => import("../views/announcement.vue"),
      meta: {
        needLogin: true,
        loa: 1,
      },
    },
    {
      path: "/rentorder",
      name: "rentorder",
      component: () => import("../views/rentorder.vue"),
      meta: {
        needLogin: true,
        loa: 1,
      },
    },
    {
      path: "/activity",
      name: "activity",
      component: () => import("../views/activity.vue"),
      meta: {
        needLogin: true,
        loa: 1,
      },
    },
    {
      path: "/classroom",
      name: "classroom",
      component: () => import("../views/classroom.vue"),
      meta: {
        needLogin: true,
        loa: 1,
      },
    },
    {
      path: "/specialty",
      name: "specialty",
      component: () => import("../views/specialty.vue"),
      meta: {
        needLogin: true,
        loa: 3,
      },
    },
    {
      path: "/coachspecialty",
      name: "coachspecialty",
      component: () => import("../views/coachspecialty.vue"),
      meta: {
        needLogin: true,
        loa: 3,
      },
    },
    {
      path: "/jobtitle",
      name: "jobtitle",
      component: () => import("../views/jobtitle.vue"),
      meta: {
        needLogin: true,
        loa: 3,
      },
    },
    {
      path: "/backstageaccount",
      name: "backstageaccount",
      component: () => import("../views/backstageaccount.vue"),
      meta: {
        needLogin: true,
        loa: 3,
      },
    },
    {
      path: "/coachpic",
      name: "coachpic",
      component: () => import("../views/coachpic.vue"),
      meta: {
        needLogin: true,
        loa: 3,
      },
    },
    {
      path: "/member",
      name: "member",
      component: () => import("../views/member.vue"),
      meta: {
        needLogin: true,
        loa: 2,
      },
    },
    {
      path: "/receiver",
      name: "receiver",
      component: () => import("../views/Receiver.vue"),
      meta: {
        needLogin: true,
        loa: 1,
      },
    },
    {
      path: "/sender",
      name: "sender",
      component: () => import("../views/Sender.vue"),
      meta: {
        needLogin: true,
        loa: 1,
      },
    },
  ],
});

router.beforeResolve(async (to) => {
  if (to.meta.needLogin) {
    const isLogin = window.localStorage.getItem("isLogin");
    const loa = window.localStorage.getItem("loa");

    if (!isLogin) {
      return { name: "login" };
    }
    if (loa < to.meta.loa) {
      logout();
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
