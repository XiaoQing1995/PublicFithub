<template>
    <a class="nav-link collapsed" href="#" data-bs-toggle="collapse"
        data-bs-target="#collapseLayouts6" aria-expanded="false"
        aria-controls="collapseLayouts">
        <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
        訂單管理
        <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
	</a>
        <div class="collapse" id="collapseLayouts6" aria-labelledby="headingOne"
            data-bs-parent="#sidenavAccordion">
            <nav class="sb-sidenav-menu-nested nav">
                <router-link class="nav-link" to="orders">全部訂單</router-link>
                <router-link class="nav-link" to="orderitem">訂單項目</router-link>									
            </nav>
        </div>
</template>

<script>

</script>