<template>
  <div>
    <VueHeader></VueHeader>
    <main>
      <div id="banner">
        <div class="text">
          <h1><span>HAN</span>居家生活</h1>
        </div>
        <div class="item">
          <img
            src="https://cdn.pixabay.com/photo/2020/01/23/02/29/dining-table-4786765_960_720.jpg"
            alt="HAN居家生活"
          />
        </div>
      </div>
      <div id="GasFryer" class="product_carousel wrapper">
        <h2>
          氣炸鍋
          <span class="subtitle">Gas fryer</span>
        </h2>

        <div
          class="item"
          v-for="item in HomeGasFryer.slice(0, 4)"
          :key="item.id"
          @click="getProduct(item.id)"
        >
          <div class="photo">
            <img :src="item.imageUrl" />
          </div>
          <div class="category text-center">{{ item.category }}</div>
          <div class="title text-center">{{ item.title }}</div>
          <div class="price text-center">NT ＄{{ item.price }}</div>
        </div>
        <div class="sort_button">
          <router-link to="/gasFryer">
            <button>觀看更多</button>
          </router-link>
        </div>
      </div>
      <div id="discount" class="back">
        <!--優惠活動-->
        <div class="wrapper">
          <div class="content">
            <h2>超殺優惠!!!</h2>
            <p>週年慶即將開跑！最便宜、最優惠、最殺、高CP值,</p>
            <p>都在HAN居家生活！</p>
          </div>
        </div>
      </div>
      <div id="oven" class="product_carousel wrapper">
        <h2>
          烤箱
          <span class="subtitle">Oven</span>
        </h2>
        <div
          class="item"
          v-for="item in HomeOven.slice(0, 4)"
          :key="item.id"
          @click="getProduct(item.id)"
        >
          <div class="photo">
            <img :src="item.imageUrl" />
          </div>
          <div class="category text-center">{{ item.category }}</div>
          <div class="title text-center">{{ item.title }}</div>
          <div class="price text-center">NT ＄{{ item.price }}</div>
        </div>
        <div class="sort_button">
          <router-link to="/oven">
            <button>觀看更多</button>
          </router-link>
        </div>
      </div>
      <div id="about" class="back">
        <!--關於我-->
        <div class="wrapper">
          <div class="content">
            <h2>HAN居家生活</h2>
            <p>HAN居家生活讓您不需花大錢</p>
            <p>也能擁有高生活品質！</p>
          </div>
        </div>
      </div>
      <div id="juicer" class="product_carousel wrapper">
        <h2>
          果汁機
          <span class="subtitle">Juicer</span>
        </h2>
        <div
          class="item"
          v-for="item in HomeJuicer.slice(0, 4)"
          :key="item.id"
          @click="getProduct(item.id)"
        >
          <div class="photo">
            <img :src="item.imageUrl" />
          </div>
          <div class="category text-center">{{ item.category }}</div>
          <div class="title text-center">{{ item.title }}</div>
          <div class="price text-center">NT ＄{{ item.price }}</div>
        </div>
        <div class="sort_button">
          <router-link to="/juicer">
            <button>觀看更多</button>
          </router-link>
        </div>
      </div>
      <div id="operating_hours" class="back">
        <!--營運時間-->
        <div class="wrapper">
          <div class="content">
            <h2>營運時間</h2>
            <p>服務時間：周一至周五 早上:10:00 ~ 晚上18:00</p>
            <p>客服專線：周一至周五 早上:10:00 ~ 晚上18:00</p>
          </div>
        </div>
      </div>
      <div id="cutter" class="product_carousel wrapper">
        <h2>
          刀具
          <span class="subtitle">Cutter</span>
        </h2>
        <div
          class="item"
          v-for="item in HomeCutter.slice(0, 4)"
          :key="item.id"
          @click="getProduct(item.id)"
        >
          <div class="photo">
            <img :src="item.imageUrl" />
          </div>
          <div class="category text-center">{{ item.category }}</div>
          <div class="title text-center">{{ item.title }}</div>
          <div class="price text-center">NT ＄{{ item.price }}</div>
        </div>
        <div class="sort_button">
          <router-link to="/cutter">
            <button>觀看更多</button>
          </router-link>
        </div>
      </div>
      <router-view></router-view>
    </main>
    <VueFooter></VueFooter>
    <div id="pm" v-if="pm">
      <div id="pm_content">
        <div class="shut" @click="shut()"></div>
        <h3 class="title">{{ product.title }}</h3>
        <div class="photo">
          <img :src="product.imageUrl" />
        </div>
        <div class="category">分類：{{ product.category }}</div>
        <div class="origin_price">原價：{{ product.origin_price }}</div>
        <div class="price">售價：{{ product.price }}</div>
        <div class="qty">
          <label for="select">購買數量：</label>
          <select id="select" v-model="defaultNum">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <button
          type="button"
          @click="addtoCart"
          class="btn btn-primary btn-lg btn-block"
        >
          加入購物車
        </button>
      </div>
    </div>
    <!-- <img :src="smartCart" alt=""> -->
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable vue/no-unused-components */
import VueHeader from "./shared/header";
import VueFooter from "./shared/footer";

//import SmartCart from '../../src/assets/image/smart-cart.png'

export default {
  components: {
    VueHeader,
    VueFooter
  },
  data() {
    return {
      //smartCart: SmartCart,
      productsUser: [],
      product: {},
      defaultNum: 1,
      pm: false,
      status: {
        loadingItem: ""
      }
    };
  },
  computed: {
    HomeGasFryer: function() {
      return this.productsUser
        .filter(product => product.is_enabled === "1")
        .filter(product => product.category === "氣炸鍋");
    },
    HomeOven: function() {
      return this.productsUser
        .filter(product => product.is_enabled === "1")
        .filter(product => product.category === "烤箱");
    },
    HomeJuicer: function() {
      return this.productsUser
        .filter(product => product.is_enabled === "1")
        .filter(product => product.category === "果汁機");
    },
    HomeCutter: function() {
      return this.productsUser
        .filter(product => product.is_enabled === "1")
        .filter(product => product.category === "刀具");
    }
  },
  methods: {
    getProducts() {
      const url = `https://vue-course-api.hexschool.io/api/han_vue/products/all`;
      this.$http.get(url).then(res => {
        this.productsUser = res.data.products;
        //console.log(this.productsUser);
      });
    },
    shut() {
      this.pm = false;
      this.product = "";
    },
    getProduct(id) {
      //抓取單一資料
      const url = `https://vue-course-api.hexschool.io/api/han_vue/product/${id}`;
      this.$http.get(url).then(res => {
        this.product = res.data.product;
        //console.log(res);
        this.pm = true;
      });
    },
    addtoCart(id, qty = "1") {
      const self = this;
      const url = `https://vue-course-api.hexschool.io/api/han_vue/cart`;
      self.status.loadingItem = this.product.id;
      const cart = {
        product_id: this.product.id,
        qty: this.defaultNum
      };
      self.$http.post(url, { data: cart }).then(res => {
        //console.log(res);
        self.shut();
        self.pm = false;
        self.product = "";
        self.$swal("完成了!", "商品已加入購物車", "success");
        this.defaultNum= 1;
        this.status.loadingItem = "";
      });
    }
  },
  created() {
    this.getProducts();
  }
};
</script>
<style lang="scss">
#pm {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  left: 0;
  top: 0;
  z-index: 10;
  #pm_content {
    max-width: 768px;
    height: auto;
    max-height: 80vh;
    padding: 30px;
    background: #fff;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: auto;
    overflow: auto;
    .shut {
      position: absolute;
      right: 0;
      top: 0;
      width: 30px;
      height: 30px;
      cursor: pointer;
      background-color: #d70545;
      z-index: 1;
      &::before {
        content: "";
        width: 100%;
        height: 2px;
        background-color: #fff;
        display: block;
        top: 15px;
        position: relative;
        transform: rotate(45deg);
      }
      &::after {
        content: "";
        width: 100%;
        height: 2px;
        background-color: #fff;
        display: block;
        top: 13px;
        position: relative;
        transform: rotate(-45deg);
      }
    }
    .title {
      font-family: "Noto Serif SC", serif;
      font-size: 24px;
      font-weight: 700;
      text-align: center;
      padding-bottom: 30px;
    }
    .photo {
      float: left;
      width: 50%;
      img {
        width: 100%;
      }
    }
    .category {
      width: 50%;
      float: left;
      line-height: 50px;
      font-family: "Noto Serif SC", serif;
      font-size: 18px;
      font-weight: 700;
      padding-left: 50px;
    }
    .origin_price {
      width: 50%;
      float: left;
      line-height: 50px;
      font-family: "Noto Serif SC", serif;
      font-size: 20px;
      font-weight: 700;
      color: #a1a1a1;
      padding-left: 50px;
      text-decoration: line-through;
    }
    .price {
      width: 50%;
      float: left;
      line-height: 50px;
      font-family: "Noto Serif SC", serif;
      font-size: 24px;
      font-weight: 700;
      color: #ff0000;
      padding-left: 50px;
    }
    .qty {
      width: 50%;
      float: left;
      padding-left: 50px;
      line-height: 50px;
      font-family: "Noto Serif SC", serif;
      font-size: 14px;
      font-weight: 700;
      margin-top: 25px;
    }
    button {
      width: calc(50% - 70px);
      float: left;
      margin-left: 50px;
      margin-top: 50px;
      margin-right: 20px;
      background-color: #d70545;
      border: 5px solid #d70545;
      transition: 0.6s;
      &:hover {
        color: #d70545;
        background-color: transparent;
      }
    }
  }
}
@media only screen and (max-width: 768px) {
  #pm {
    #pm_content {
      padding: 50px 15px 50px 15px;
      margin: auto 15px;
      .title {
        font-size: 24px;
        margin: 0;
        padding-bottom: 25px;
      }
      .photo {
        width: 100%;
        text-align: center;
        img {
          width: 100%;
          max-width: 300px;
        }
      }
      .category {
        width: 100%;
        font-size: 18px;
        text-align: center;
        padding-left: 0;
      }
      .origin_price {
        width: 100%;
        font-size: 20px;
        text-align: center;
        padding-left: 0;
      }
      .price {
        width: 100%;
        font-size: 24px;
        text-align: center;
        padding-left: 0;
      }
      .qty {
        width: 100%;
        font-size: 14px;
        text-align: center;
        padding-left: 0;
      }
      button {
        width: calc(100% - 30px);
        margin-left: 15px;
        margin-right: 15px;
        margin-top: 25px;
      }
    }
  }
}
</style>
<style scoped lang="scss">
main {
  margin-top: 90px;
  #banner {
    width: 100%;
    height: calc(100vh - 90px);
    overflow: hidden;
    position: relative;
    z-index: 1;
    .text {
      width: 320px;
      height: 320px;
      position: absolute;
      z-index: 1;
      border: 10px double #fff;
      display: flex;
      align-items: center;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      h1 {
        width: 100%;
        font-size: 64px;
        color: #fff;
        font-weight: 900;
        font-family: "Noto Serif SC", serif;
        text-align: center;
        text-shadow: black 0.1em 0.1em 0.5em;
        span {
          display: block;
          font-size: 100px;
          color: #fff;
          font-family: "Pacifico", "Noto Serif SC", serif;
          text-align: center;
        }
      }
    }
    .item {
      img {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        min-width: 100%;
        min-height: 100vh;
      }
    }
  }
  .product_carousel {
    padding: 100px 0;
    display: flex;
    flex-wrap: wrap;
    h2 {
      width: 100%;
      font-family: "Noto Serif SC", serif;
      font-size: 36px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 50px;
      position: relative;
      ::before {
        content: "";
        display: block;
        width: 150px;
        height: 1px;
        background-color: #000;
        position: absolute;
        top: 52.5px;
        left: 0;
        right: 0;
        margin: auto;
      }
      .subtitle {
        width: 100%;
        display: block;
        font-family: "Noto Serif SC", serif;
        font-size: 18px;
        font-weight: 900;
        color: #d70545;
        margin-top: 10px;
        padding-top: 10px;
      }
    }
    .item {
      width: 20%;
      margin: 15px 2.5%;
      cursor: pointer;
      position: relative;
      &::before {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        opacity: 0;
        transition: 0.6s;
      }
      &::after {
        content: "查看產品詳細";
        display: block;
        position: absolute;
        width: 120px;
        height: 120px;
        line-height: 120px;
        background-color: #d70445;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        border-radius: 120px;
        opacity: 0;
        transition: 1.5s;
        text-align: center;
        color: #fff;
        font-size: 16px;
        font-family: "Noto Serif SC", serif;
        font-weight: 700;
      }
      &:hover {
        &::before {
          opacity: 1;
        }
        &::after {
          opacity: 1;
        }
      }
      .photo {
        img {
          max-width: 100%;
        }
      }
      .category {
        font-size: 14px;
        color: #a1a1a1;
        padding: 10px 0;
      }
      .title {
        font-family: "Roboto", "Pacifico", "Noto Serif SC", serif;
        font-size: 16px;
        font-weight: 600;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .price {
        padding-top: 10px;
        font-size: 20px;
        font-weight: bolder;
        color: #ff0000;
      }
    }
    .sort_button {
      margin-top: 50px;
      margin-left: auto;
      margin-right: auto;
      a {
        button {
          width: 250px;
          line-height: 50px;
          background-color: #d70545;
          border: 5px solid #d70545;
          color: #fff;
          font-family: "Roboto", "Pacifico", "Noto Serif SC", serif;
          font-size: 18px;
          font-weight: 600;
          border-radius: 30px;
          border-top-left-radius: 3px;
          border-bottom-right-radius: 3px;
          transition: 0.6s;
          &:hover {
            color: #d70545;
            background-color: transparent;
          }
        }
      }
    }
  }
  .back {
    height: 500px;
    background-position: 50%;
    background-size: cover;
    background-attachment: fixed;
    color: #fff;
    position: relative;
    .wrapper {
      height: 100%;
      position: relative;
      .content {
        padding: 50px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        h2 {
          font-size: 54px;
          font-family: "Noto Serif SC", serif;
          font-weight: 700;
          padding-bottom: 30px;
          text-shadow: black 0.1em 0.1em 0.5em;
        }
        p {
          font-size: 24px;
          font-family: "Noto Serif SC", serif;
          font-weight: 700;
          text-shadow: black 0.1em 0.1em 0.5em;
        }
      }
    }
  }
  #discount {
    background-image: url("https://c.pxhere.com/photos/a1/6d/shopping_business_retail_shopping_cart_transport_supermarket_food_purchasing-1052603.jpg!d");
    .wrapper {
      .content {
        right: 50%;
      }
    }
  }
  #about {
    background-image: url("https://images.pexels.com/photos/6256/water-kitchen-black-design.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940");
    .wrapper {
      .content {
        left: 50%;
      }
    }
  }
  #operating_hours {
    background-image: url("https://images.pexels.com/photos/1419922/pexels-photo-1419922.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940");
    .wrapper {
      .content {
        right: 50%;
      }
    }
  }
}
@media only screen and (max-width: 768px) {
  main {
    #banner {
      .text {
        width: 220px;
        height: 220px;
        h1 {
          font-size: 42px;
          span {
            font-size: 66px;
          }
        }
      }
      .item {
        img {
          left: -85%;
        }
      }
    }
    .product_carousel {
      .item {
        width: 45%;
        margin: 2.5%;
      }
    }
    .back {
      .wrapper {
        .content {
          h2 {
            font-size: 36px;
            font-weight: 700;
          }
          p {
            font-size: 16px;
            font-weight: 700;
          }
        }
      }
    }
    #discount {
      .wrapper {
        .content {
          right: 0;
        }
      }
    }
    #about {
      .wrapper {
        .content {
          left: 0;
        }
      }
    }
    #operating_hours {
      .wrapper {
        .content {
          right: 0;
        }
      }
    }
  }
}
</style>
