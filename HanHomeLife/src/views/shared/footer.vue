<template>
  <div>
    <footer>
      <div class="wrapper">
        <ul>
          <li>
            <router-link to="/about">關於我們</router-link>
          </li>
          <li>
            <router-link to="/AllProducts">產品專區</router-link>
          </li>
          <li>
            <router-link to="/login">管理者專區</router-link>
          </li>
        </ul>
        <div id="time">
          <p>
            <span>
              <span class="footer_title">客服信箱：</span>
              <a href="han0910812144@gmail.com">han0910812144@gmail.com</a>
            </span>
          </p>
          <p>
            <span>
              <span class="footer_title">客服專線：</span>
              <a href="tel:0800-789-456">0800-789-456</a>
            </span>
          </p>
          <p>
            <span class="footer_title">服務時間：</span>
            <span>周一至周五 早上:10:00 ~ 晚上18:00</span>
          </p>
        </div>
        <div id="authority">
          <a href="http://gotoo.co/"
            >© 2018 HAN居家生活 All rights reserved. Designed by gotoo</a
          >
        </div>
      </div>
    </footer>
    <div id="shop_cart">
      <router-link to="/shopCart">
        <h2>購物車</h2>
        <i class="fas fa-shopping-cart"></i> 
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
footer {
  position: relative;
  width: 100%;
  background-color: #222222;
  .wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    ul {
      padding: 0px 0 50px 0;
      margin-bottom: 0;
      width: calc(100% - 340px);
      li {
        display: inline;
        a {
          font-size: 20px;
          font-family: "Noto Serif SC", serif;
          line-height: 50px;
          color: #fff;
          padding: 0 30px;
          display: inline-block;
          transition: 0.6s;
          text-decoration: none;
        }
      }
    }
    #time {
      width: 340px;
      color: #fff;
      padding-top: 50px;
      padding-bottom: 100px;
      p {
        font-size: 16px;
        a {
          color: #fff;
        }
      }
    }
    #authority {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      text-align: center;
      border-top: 1px solid #ccc;
      a {
        font-size: 16px;
        font-family: "Noto Serif SC", serif;
        line-height: 50px;
        color: #fff;
      }
    }
  }
}
@media only screen and (max-width: 980px) {
  footer {
    position: relative;
    width: 100%;
    background-color: #222222;
    .wrapper {
      padding: 0 15px;
      ul {
        width: 100%;
        padding: 50px 0 0 0;
        text-align: center;
        li {
          a {
            font-size: 16px;
            line-height: 30px;
            padding: 0 15px;
          }
        }
      }
      #time {
        width: 100%;
        text-align: center;
        p {
          font-size: 14px;
        }
        span {
          display: block;
        }
      }
      #authority {
        width: 100%;
        a {
          font-size: 12px;
        }
      }
      .footer_title {
        display: block;
      }
    }
  }
}
</style>
