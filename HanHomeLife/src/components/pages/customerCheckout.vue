<template>
  <div>
    <div id="shopCart">
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
        <div class="final_total text-right">總共金額：{{ order.total }}</div>
      </div>
    </div>

    <div class="item">
      <div class="name">信箱</div>
      <div class="content">{{ order.user.email}}</div>
    </div>
    <div class="item">
      <div class="name">姓名</div>
      <div class="content">{{ order.user.name}}</div>
    </div>
    <div class="item">
      <div class="name">電話</div>
      <div class="content">{{ order.user.tel}}</div>
    </div>
    <div class="item">
      <div class="name">地址</div>
      <div class="content">{{ order.user.address}}</div>
    </div>
    <div class="item">
      <div class="name">留言</div>
      <div class="content">{{ order.message}}</div>
    </div>
    <div class="item">
      <div class="name">付款狀態</div>
      <span v-if="order.is_paid">尚未付款</span>
      <span v-else>付款完成</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: {
        user: {}
      },
      orderId: ""
    };
  },
  methods: {
    getOrder() {
      const url = `https://vue-course-api.hexschool.io/api/han_vue/order/${this.orderId}`;
      this.$http.get(url).then(res => {
        this.order = res.data.order;
        //console.log(res);
      });
    }
  },
  created() {
    this.orderId = this.$route.params.orderId;
    //console.log(this.orderId);
  }
};
</script>