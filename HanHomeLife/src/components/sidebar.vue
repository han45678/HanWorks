<template>
  <div>
    <nav id="sidebar" class="col-md-2 d-none d-md-block bg-light sidebar">
      <div class="sidebar-sticky">
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link class="nav-link" to="products">產品列表</router-link>
            <!-- <ol>
              <li>全部</li>
              <li>氣炸鍋</li>
              <li>烤箱</li>
              <li>果汁機</li>
              <li>刀具</li>
              <li>其他</li>
            </ol> -->
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="add">新增產品</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="order">客戶訂單列表</router-link>
          </li>
          <!-- <li class="nav-item">
            <router-link class="nav-link" to="simulation-customer-orders">模擬訂單</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="simulation-cart">模擬購物車</router-link>
          </li> -->
        </ul>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.sidebar {
  padding: 67px 0 0;
}
.sidebar-sticky {
  background-color: #333940;
}
.sidebar li {
  border-bottom: 1px solid #ccc;
}
.sidebar .nav-link {
  color: #fff;
  padding-left: 32px;
  font-size: 14px;
  line-height: 50px;
  font-size: 16px;

  transition: 0.6s;
}

.sidebar .nav-link:hover {
  background-color: #ccc;
  color: #000;
}

#sidebar.active {
  display: block !important;
  padding: 142px 0 0;
}
</style>
