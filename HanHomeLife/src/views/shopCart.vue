<template>
  <div>
    <VueHeader></VueHeader>
    <main>
      <div
        id="banner"
        style="
          background-image: url(https://c.pxhere.com/photos/a1/6d/shopping_business_retail_shopping_cart_transport_supermarket_food_purchasing-1052603.jpg!d);
        "
      >
        <h2>
          購物車
          <span class="subtitle">Shop Cart</span>
        </h2>
      </div>
      <div id="shopCart">
        <div class="wrapper">
          <div class="item" v-for="item in shopCart" :key="item.id">
            <div class="photo">
              <img :src="item.product.imageUrl" />
            </div>
            <div class="text">
              <div class="title">{{ item.product.title }}</div>
              <div class="category">分類：{{ item.product.category }}</div>
              <div class="qty">數量：{{ item.qty }}</div>
              <div class="price">NT ＄{{ item.product.price }}</div>
            </div>
            <div class="delete">
              <button
                @click="removeShopCart(item.id)"
                type="button"
                class="btn btn-danger"
              >
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
          </div>
          <div class="final_total text-right">
            總共金額：{{ sum.final_total }}
          </div>
          <!-- <div class="row mt-4">
            <div class="col-12 col-md-10 col-sm-8 mt-1">
              <input type="text" v-model="coupon_code" class="form-control" placeholder="請輸入優惠碼" />
            </div>
            <div class="col-12 col-md-2 col-sm-4 mt-1">
              <button type="button" @click="AddCouponCode()" class="btn btn-outline-secondary btn-block">使用優惠碼</button>
            </div>
          </div>-->
          <div class="text-center mt-4">
            <button type="button" class="btn btn-danger" @click="goReceiver()">
              填寫收件人資料
              <i class="ml-2 fas fa-arrow-circle-down"></i>
            </button>
          </div>
        </div>
      </div>
      <div
        id="receiver"
        v-if="receiver"
        class="row wrapper justify-content-md-center"
      >
        <div class="col-xl-8">
          <h3 class="text-center">收貨人資料</h3>
          <form @submit.prevent="createOrder">
            <div class="form-group">
              <label for="exampleFormControlInput1">信箱</label>
              <input
                v-model="form.user.email"
                type="email"
                name="email"
                class="form-control"
                placeholder="請輸入信箱"
                v-validate="'required|email'"
              />
              <span class="text-danger" v-if="errors.has('email')">{{
                errors.first("email")
              }}</span>
            </div>
            <div class="form-group">
              <label for="exampleFormControlInput1">姓名</label>
              <input
                v-model="form.user.name"
                type="text"
                name="name"
                class="form-control"
                placeholder="請輸入收件人姓名"
                v-validate="'required'"
                :class="{ 'is-invalid': errors.has('name') }"
              />
              <span class="text-danger" v-if="errors.has('name')"
                >姓名必須輸入</span
              >
            </div>
            <div class="form-group">
              <label for="exampleFormControlInput1">電話</label>
              <input
                v-model="form.user.tel"
                type="tel"
                class="form-control"
                placeholder="請輸入收件人電話"
                required
              />
            </div>
            <div class="form-group">
              <label for="exampleFormControlInput1">地址</label>
              <input
                v-model="form.user.address"
                type="address"
                name="address"
                required
                class="form-control"
                placeholder="請輸入收件人地址"
                v-validate="'required'"
                :class="{ 'is-invalid': errors.has('address') }"
              />
              <span class="text-danger" v-if="errors.has('address')"
                >地址必須輸入</span
              >
            </div>
            <div class="form-group">
              <label for="exampleFormControlTextarea1">留言</label>
              <textarea
                v-model="form.message"
                class="form-control"
                rows="5"
                name="message"
                placeholder="請輸入你的建議"
              ></textarea>
            </div>
            <div class="text-center">
              <button type="submit" class="mt-4 btn btn-danger">
                確認資料
                <i class="fab fa-shopify"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
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
      receiver: false,
      shopCart: {},
      sum: {},
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
      //coupon_code: ""
    };
  },
  methods: {
    getShopCart() {
      const url = `https://vue-course-api.hexschool.io/api/han_vue/cart`;
      this.$http.get(url).then((res) => {
        this.shopCart = res.data.data.carts;
        this.sum = res.data.data;
        //console.log(res.data.data);
      });
    },
    removeShopCart(id) {
      const self = this;
      const url = `https://vue-course-api.hexschool.io/api/han_vue/cart/${id}`;
      self.$http.delete(url).then((res) => {
        console.log(res);
        self.getShopCart();
        self.$swal("刪除成功!", "商品已移除購物車", "success");
      });
    },
    goReceiver() {
      this.receiver = true;
    },
    createOrder() {
      // eslint-disable-next-line no-unused-vars
      const url = `https://vue-course-api.hexschool.io/api/han_vue/order`;
      // eslint-disable-next-line no-unused-vars
      const orde = this.form;
      const self = this;
      this.$validator.validate().then((result) => {
        if (result) {
          self.$http.post(url, { data: orde }).then((res) => {
            //console.log("訂單已建立", res);
            if (res.data.success) {
              self.$router.push(`/customer_checkout/${res.data.orderId}`);
              self.$swal("完成!", "訂單已建立", "success");
            }
          });
        } else {
          self.$swal("欄位不完整!", "請確認後再送出", "error");
        }
      });
    },
    /*AddCouponCode() {
      const url = `https://vue-course-api.hexschool.io/api/han_vue/coupon`;
      const coupon = {
        code:this.coupon_code
      }
      this.$http.post(url,{data:coupon}).then(res => {
        console.log(res);
        this.getShopCart();
      });
    }*/
  },
  created() {
    this.getShopCart();
  },
};
</script>

<style scoped lang="scss">
main {
  position: relative;
  z-index: 1;
  background-color: #fff;
}
#shopCart {
  .wrapper {
    padding: 50px 50px;
    .item {
      border-bottom: 1px solid #ccc;
      padding-bottom: 30px;
      margin-bottom: 30px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      .photo {
        width: 200px;
        padding-right: 50px;
        img {
          width: 100%;
        }
      }
      .text {
        width: calc(100% - 250px - 60px);
        .title {
          font-size: 20px;
          font-weight: 900;
          font-family: "Noto Serif SC", serif;
          margin-bottom: 15px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .category {
          font-size: 16px;
          font-weight: 900;
          font-family: "Noto Serif SC", serif;
          //color: #a1a1a1;
          margin-bottom: 5px;
        }
        .qty {
          font-size: 16px;
          font-weight: 900;
          font-family: "Noto Serif SC", serif;
          margin-bottom: 5px;
        }
        .price {
          font-size: 16px;
          font-weight: 900;
          font-family: "Noto Serif SC", serif;
          margin-bottom: 5px;
        }
      }
      .delete {
        width: 60px;
        text-align: center;
      }
    }
    .final_total {
      font-size: 24px;
      font-weight: 900;
      font-family: "Noto Serif SC", serif;
      color: #d70545;
    }
  }
}
#receiver {
  padding: 50px 50px;
  font-weight: 600;
  font-family: "Noto Serif SC", serif;
}
@media only screen and (max-width: 768px) {
  #shopCart {
    padding: 50px 15px;
    .wrapper {
      padding: 50px 0px;
      .item {
        align-items: initial;
        .photo {
          width: 115px;
          text-align: center;
          padding-right: 15px;
          img {
            max-width: 80px;
            margin: auto;
          }
        }
        .text {
          width: calc(100% - 115px);
          .title {
            font-size: 14px;
            margin-bottom: 5px;
          }
          .category {
            font-size: 12px;
            margin-bottom: 0px;
          }
          .qty {
            font-size: 12px;
            margin-bottom: 0px;
          }
          .price {
            font-size: 12px;
            margin-bottom: 0px;
          }
        }
        .delete {
          text-align: right;
          margin-top: 30px;
          width: 100%;
        }
      }
    }
  }
  #receiver {
    padding: 50px 15px;
  }
}
</style>
