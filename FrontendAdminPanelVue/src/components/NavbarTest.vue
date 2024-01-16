<template>
    <a class="nav-link collapsed " href="#" data-bs-toggle="collapse"
								data-bs-target="#collapseLayoutsTest" aria-expanded="false"
								aria-controls="collapseLayouts">
								<div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
								測試用
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
							</a>
							<div class="collapse" id="collapseLayoutsTest" aria-labelledby="headingOne"
								data-bs-parent="#sidenavAccordion">
								<nav class="sb-sidenav-menu-nested nav">
									<router-link class="nav-link" to="testUploadImg">上傳圖片</router-link>
									<router-link class="nav-link" to="testLoadImg">讀取圖片</router-link>
									<router-link class="nav-link" to="receiver">receiver</router-link>
									<router-link class="nav-link" to="sender">sender</router-link>
								</nav>
							</div>
</template>