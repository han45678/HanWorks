<template>
  <div>
    <div class="row mt-4">
      <div class="item col-md-4 mb-4" v-for="item in productsUser" :key="item.id">
        <div class="photo">
          <img :src="item.imageUrl" />
        </div>
        <div class="line">
          <div class="title">{{ item.title }}</div>
          <div class="original text-right">原價 ＄{{ item.origin_price }}</div>
          <div class="price text-right">售價 ＄{{ item.price }}</div>
        </div>
        <div class="back_black">
          <button class="button more" @click="getProduct(item)">查看更多...</button>
          <button class="button cart" @click="addtoCart(item.id)">加入購物車</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productsUser: [],
      product: {}
    };
  },
  methods: {
    getProducts() {
      const url = `https://vue-course-api.hexschool.io/api/han_vue/products/all`;
      this.$http.get(url).then(res => {
        this.productsUser = res.data.products;
        //console.log(res);
      });
    },
    getProduct(id) {
      const url = `https://vue-course-api.hexschool.io/api/han_vue/product/${id}`;
      this.$http.get(url).then(res => {
        this.product = res.data.product;
        //console.log(res.data.product);
      });
    },
    addtoCart(id, qty = 1) {
      const url = `https://vue-course-api.hexschool.io/api/han_vue/cart`;
      this.status.loadingItem = id;
      const cart = {
        product_id:id,
        qty,
      };
      this.$http.post(url,{data:cart}).then((res)=>{
        //console.log(res);
        this.status.loadingItem='';
      })
    },
  },
  created() {
    this.getProducts();
  }
};
</script>
<style lang="scss" scoped>
.item {
  padding: 15px 25px;
  .photo {
    width: 100%;
    height: 200px;
    overflow: hidden;
    position: relative;
    border: 1px solid #ccc;
    border-bottom: none;
    img {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
    }
  }
  .line {
    padding: 0 25px 15px 25px;
    border: 1px solid #ccc;
    border-top: none;
    .title {
      padding-top: 15px;
      padding-bottom: 15px;
      font-family: "Anton", "Pacifico", "Noto Serif SC", serif;
      font-weight: 700;
      font-size: 24px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .original {
      font-size: 12px;
      color: #ccc;
      text-decoration: line-through;
    }
    .price {
      font-size: 18px;
      font-weight: 900;
      color: #e80000;
    }
  }
  .back_black {
    padding: 10px 0;
    background-color: rgba(189, 189, 189, 0.3);
    text-align: center;
    .button {
      font-family: "Pacifico", "Noto Serif SC", serif;
      font-weight: 700;
      font-size: 16px;
      margin: 0 15px;
      padding: 5px 15px;
      background: transparent;
      transition: 0.6s;
      &.more {
        color: #285263;
        border: 3px solid #285263;
        &:hover {
          background-color: #285263;
          color: #fff;
        }
      }
      &.cart {
        color: #8a161e;
        border: 3px solid #8a161e;
        &:hover {
          background-color: #8a161e;
          color: #fff;
        }
      }
    }
  }
}
</style>