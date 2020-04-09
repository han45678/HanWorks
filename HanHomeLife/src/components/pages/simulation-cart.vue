<template>
  <div>
    <div class="row mt-4">
      <div class="item col-md-4 mb-4" v-for="item in productsCart" :key="item.id">
        <div class="photo">
          <img :src="item.imageUrl" />
        </div>
        <div class="line">
          <div class="title">{{ item.title }}</div>
          <div class="original text-right">原價 ＄{{ item.origin_price }}</div>
          <div class="price text-right">售價 ＄{{ item.price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productsCart: [],
    };
  },
  methods: {
    getCart() {
      const url = `https://vue-course-api.hexschool.io/api/han_vue/cart`;
      this.$http.get(url).then(res => {
        this.productsUser = res.data.productsCart;
        //console.log(res.data.productsCart);
      });
    }
  },
  created() {
    this.getCart();
  }
};
</script>