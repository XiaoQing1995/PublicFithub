<template>
    <a class="nav-link collapsed" href="#" data-bs-toggle="collapse"
        data-bs-target="#collapseLayouts5" aria-expanded="false"
        aria-controls="collapseLayouts">
        <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
        優惠券管理
        <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
	</a>
        <div class="collapse" id="collapseLayouts5" aria-labelledby="headingOne"
            data-bs-parent="#sidenavAccordion">
            <nav class="sb-sidenav-menu-nested nav">
                <router-link class="nav-link" to="coupons">全部優惠券</router-link>
                <router-link class="nav-link" to="couponcategories">優惠券分類</router-link>									
            </nav>
        </div>
</template>

<script>

</script>