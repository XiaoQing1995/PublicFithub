<template>
    <a
      class="nav-link collapsed"
      href="#"
      data-bs-toggle="collapse"
      data-bs-target="#collapseLayoutsMember"
      aria-expanded="false"
      aria-controls="collapseLayouts"
    >
      <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
      會員管理
      <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
    </a>
    <div
      class="collapse"
      id="collapseLayoutsMember"
      aria-labelledby="headingOne"
      data-bs-parent="#sidenavAccordion"
    >
      <nav class="sb-sidenav-menu-nested nav">
        <router-link class="nav-link" to="member">會員管理</router-link>
      </nav>
    </div>
  </template>
  