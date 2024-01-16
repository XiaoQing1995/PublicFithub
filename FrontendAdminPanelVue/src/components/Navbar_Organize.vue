<template>
  <a
    class="nav-link collapsed"
    href="#"
    data-bs-toggle="collapse"
    data-bs-target="#collapseLayoutsOrganize"
    aria-expanded="false"
    aria-controls="collapseLayouts"
  >
    <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
    組織管理
    <div class="sb-sidenav-collapse-arrow">
      <i class="fas fa-angle-down"></i>
    </div>
  </a>
  <div
    class="collapse"
    id="collapseLayoutsOrganize"
    aria-labelledby="headingOne"
    data-bs-parent="#sidenavAccordion"
  >
    <nav class="sb-sidenav-menu-nested nav">
      <router-link class="nav-link" to="department">部門分類</router-link>
      <router-link class="nav-link" to="jobtitle">職稱管理</router-link>
      <router-link class="nav-link" to="employee">員工管理</router-link>
      <router-link class="nav-link" to="specialty">專長項目</router-link>
      <router-link class="nav-link" to="coachspecialty">教練專長</router-link>
      <router-link class="nav-link" to="coachpic">教練照片</router-link>
      <router-link class="nav-link" to="backstageaccount">後台帳戶</router-link>
    </nav>
  </div>
</template>
