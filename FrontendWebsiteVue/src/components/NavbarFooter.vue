<template>
  <section>
    <div class="gc-footer-area mybg-light">
      <div class="container">
        <div class="row">
          <div class="footer-widgets">
            <!-- 公司資訊 -->
            <div class="col-lg-2 offset-lg-2 col-md-6 col-sm-6 col-6">
              <div class="single-widgets">
                <div class="widgets-content">
                  <div class="widgets-title">
                    <h4>公司資訊</h4>
                  </div>
                  <div class="widgets-link">
                    <ul>
                      <li>
                        <p>名稱:Fithub</p>
                      </li>
                      <li>
                        <p>營業時間:星期一~星期日</p>
                        <p>上午 6:00 - 晚上 00:00</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-3 col-md-6 col-sm-6 col-6 pt-5">
              <div class="single-widgets">
                <div class="widgets-content">
                  <div class="widgets-link">
                    <ul>
                      <li>
                        <br />
                        <p>地址:801高雄市前金區中正四路211號8號</p>
                      </li>
                      <li>
                        <p>電話:0910778412</p>
                      </li>
                      <li>
                        <p>信箱:axcdsa@gmail.com</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- 網站連結 -->
            <div class="col-lg-2 col-md-6 col-sm-6 col-6">
              <div class="single-widgets">
                <div class="widgets-content">
                  <div class="widgets-title">
                    <h4>網站連結</h4>
                  </div>
                  <div class="widgets-link">
                    <ul>
                      <li>
                        <router-link class="nav-link" to="/course/0">課程</router-link>
                      </li>
                      <li>
                        <router-link class="nav-link" to="/rent">場地租借</router-link>
                      </li>
                      <li>
                        <router-link class="nav-link" to="/member">會員專區</router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Follow Us -->
            <div class="col-lg-1 col-md-6 col-sm-6 col-6 text-center">
              <div class="single-widgets">
                <div class="widgets-content">
                  <div class="widgets-title">
                    <h4>Follow Us</h4>
                  </div>
                  <div class="footer-logo">
                    <a href="#"><img src="../assets/index/footer/013.png" alt="" /></a>
                    <a href="#"><img src="../assets/index/footer/023.png" alt="" /></a>
                    <a href="#"><img src="../assets/index/footer/043.png" alt="" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="background-color: black;">
      <div class="text-center">
        <router-link class="nav-link" style="color: white;" to="/disclaimer">網站聲明</router-link>
      </div>
    </div>
  </section>
</template>

<script setup></script>
