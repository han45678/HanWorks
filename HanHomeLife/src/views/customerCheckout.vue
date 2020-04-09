<template>
  <div>
    <VueHeader></VueHeader>
    <main>
      <div
        id="banner"
        style="background-image: url(https://c.pxhere.com/photos/5d/b4/kitchen_inside_modern_furniture_contemporary_domestic_lifestyle_faucet-1248463.jpg!d"
      >
        <h2>
          資料確認
          <span class="subtitle">Data confirmation</span>
        </h2>
      </div>
      <form @submit.prevent="payOrder">
        <!-- <div id="shopCart">
        <div class="wrapper">
          <div class="item" v-for="item in order.progres" :key="item.id">
            <div class="photo">
              <img :src="item.product.imageUrl" />
            </div>
            <div class="text">
              <div class="title">{{ item.product.title }}</div>
              <div class="category">分類：{{ item.product.category }}</div>
              <div class="qty">數量：{{ item.qty }}</div>
              <div class="price">NT ＄{{ item.product.price }}</div>
            </div>
          </div>
        </div>
      </div> -->
        <div id="user_data">
          <div class="wrapper">
            <div class="item">
              <div class="name">姓名</div>
              <div class="content">{{ order.user.name }}</div>
            </div>
            <div class="item">
              <div class="name">電話</div>
              <div class="content">{{ order.user.tel }}</div>
            </div>
            <div class="item">
              <div class="name">信箱</div>
              <div class="content">{{ order.user.email }}</div>
            </div>
            <div class="item">
              <div class="name">地址</div>
              <div class="content">{{ order.user.address }}</div>
            </div>
            <div class="item">
              <div class="name">留言</div>
              <div class="content">{{ order.message }}</div>
            </div>
            <div class="final_total">總共金額：{{ order.total }}</div>
            <div class="item">
              <div class="name">付款方式</div>
              <div class="content">
                <input
                  class="form-check-input"
                  type="checkbox"
                  checked
                  disabled
                />貨到付款
              </div>
            </div>
            <div class="item">
              <div class="name">商品狀態</div>
              <div class="content">
                <span class="text-success" v-if="this.order.is_paid"
                  >確認完成</span
                >
                <span class="text-danger" v-else>尚未確認</span>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mb-5">
          <router-link to="/" class="btn btn-info" v-if="this.order.is_paid">
            回首頁
          </router-link>
          <button type="submit" class="btn btn-danger" v-else>確認</button>
        </div>
      </form>
    </main>
    <VueFooter></VueFooter>
  </div>
</template>

<script>
import VueHeader from "./shared/header";
import VueFooter from "./shared/footer";
export default {
  components: {
    VueHeader,
    VueFooter,
  },
  data() {
    return {
      order: {
        user: {},
        progres: {},
      },
      orderId: "",
    };
  },
  methods: {
    getOrder() {
      const url = `https://vue-course-api.hexschool.io/api/han_vue/order/${this.orderId}`;
      this.$http.get(url).then((res) => {
        this.order = res.data.order;
        //console.log(res.data);
      });
    },
    payOrder() {
      const self = this;
      const url = `https://vue-course-api.hexschool.io/api/han_vue/pay/${this.orderId}`;
      self.$http.post(url).then((res) => {
        if (res.data.success) {
          self.getOrder();
          self.$swal("確認成功!", "商品將在5~7天送達", "success");
        }
      });
    },
  },
  created() {
    this.orderId = this.$route.params.orderId;
    this.getOrder();
  },
  goHome() {
    this.router.push("/");
  },
};
</script>
<style scoped lang="scss">
main {
  margin-top: 90px;
  min-height: calc(100vh - 90px - 270px);
  font-weight: 900;
  font-family: "Noto Serif SC", serif;
  #user_data {
    margin: 50px 0 50px 0;
    .wrapper {
      padding: 0 30px;
      max-width: 660px;
      .item,
      .final_total {
        padding: 15px 0;
        border-bottom: 1px solid #ccc;
        .name {
          font-size: 18px;
        }
        .content {
          text-align: right;
          font-size: 16px;
        }
      }
      .final_total {
        text-align: center;
        font-size: 24px;
        color: red;
      }
    }
  }
}
</style>
