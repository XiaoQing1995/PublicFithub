<template>
    <body class="sb-nav-fixed">
        <NavbarTop></NavbarTop>
        <NavbarLeft></NavbarLeft>
        <div id="layoutSidenav">
            <div id="layoutSidenav_content">
                <div class="container-fluid px-4">
                    <h1 class="mt-4" style="text-align: center;">全部公告</h1>
                    <div class="card mb-4">
                        <div class="card-body table-responsive">


                            <table class="table table-bordered">
                                <thead class="align-middle text-center">
                                    <tr class="table-primary">
                                        <th>
                                            <input type="checkbox" id="selectAllCheckbox">
                                            <button class="btn btn-outline-danger" id="deleteActivitys">刪除</button>
                                        </th>
                                        <th>名稱</th>
                                        <th>內容</th>
                                        <th>活動日期</th>
                                        <th>網址</th>
                                        <th>顯示</th>
                                        <th>負責員工</th>
                                        <th>上架日期</th>
                                        <th>下架日期</th>
                                        <th>排序</th>
                                        <th>圖片</th>
                                        <th>修改</th>
                                    </tr>
                                </thead>

                                <tbody class="align-middle">
                                    <tr>
                                        <td>1</td>
                                        <td>1</td>
                                        <td>1</td>
                                        <td>1</td>
                                        <td>1</td>
                                        <td>1</td>
                                        <td>1</td>
                                        <td>1</td>
                                        <td>1</td>
                                        <td>1</td>
                                        <td class="center"><button class="btn btn-outline-success">預覽</button></td>
                                        <td class="center"><button type="submit" class="btn btn-outline-info">修改</button>
                                        </td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</template>

<script setup>
import NavbarTop from '../components/NavbarTop.vue'
import NavbarLeft from '../components/NavbarLeft.vue'
</script>