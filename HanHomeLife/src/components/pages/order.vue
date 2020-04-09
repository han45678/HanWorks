<template>
  <div>
    <div class="mt-5">
      <div v-for="perDay in orders" :key="perDay.id">
        <div class="details">
          <div class="item confirm">
            <span class="text-success" v-if="perDay.is_paid">已確認</span>
            <span class="text-danger" v-else>未確認</span>
          </div>
          <div class="receiver">
            <div class="item">
              <div class="title">收貨人：</div>
              <div class="content">{{ perDay.user.name }}</div>
            </div>
            <div class="item">
              <div class="title">連絡電話：</div>
              <div class="content">{{ perDay.user.tel }}</div>
            </div>
            <div class="item">
              <div class="title">電子信箱：</div>
              <div class="content">{{ perDay.user.email }}</div>
            </div>
            <div class="item">
              <div class="title">地址：</div>
              <div class="content">{{ perDay.user.address }}</div>
            </div>
            <div class="item">
              <div class="title">買家留言：</div>
              <div class="content">{{ perDay.message }}</div>
            </div>
            <div class="item">
              <div class="title">消費金額：</div>
              <div class="content">
                <span class="text-danger">{{ perDay.total }}</span>
              </div>
            </div>
          </div>
          <div class="checklist_title">購買清單</div>
          <div class="products" v-for="item in perDay.products" :key="item.id">
            <div class="photo">
              <img :src="item.product.imageUrl" />
            </div>
            <div class="content">
              <div class="item">
                <span>產品：</span>
                {{ item.product.title }}
              </div>
              <div class="item">
                <span>價格：</span>
                {{ item.product.price }}
              </div>
              <div class="item">
                <span>分類：</span>
                {{ item.product.category }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav id="page" aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{'disabled':!pagination.has_pre}">
          <a class="page-link" href="#" @click.prevent="getOrder(pagination.current_page - 1)">上一頁</a>
        </li>
        <li
          class="page-item"
          v-for="page in pagination.total_pages"
          :key="page"
          :class="{'active':pagination.current_page === page}"
        >
          <a class="page-link" href="#" @click.prevent="getOrder(page)">{{page}}</a>
        </li>
        <li class="page-item" :class="{'disabled':!pagination.has_next}">
          <a class="page-link" href="#" @click.prevent="getOrder(pagination.current_page + 1)">下一頁</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
export default {
  data() {
    return {
      orders: {},
      pagination: {}
    };
  },
  methods: {
    getOrder(page = 1) {
      const url = `https://vue-course-api.hexschool.io/api/han_vue/orders?page=${page}`;
      this.$http.get(url).then(res => {
        let orders = res.data.orders;

        let perDay = orders.map((data, index) => {
          let products = data.products;

          let keys = Object.keys(products).map(key => products[key]);

          return keys;
        });

        let processOrder = orders.map((data, index) => {
          data.products = perDay[index];
          return data;
        });

        this.orders = processOrder;

        this.pagination = res.data.pagination;
      });
    }
  },
  created() {
    //沒有執行事件觸發，務必要在下方加入created才會執行
    this.getOrder();
  }
};
</script>

<style scoped lang="scss">
.details {
  background-color: #e0e0e0;
  margin-bottom: 15px;
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .receiver {
    width: calc(100% - 150px);
    display: flex;
    flex-wrap: wrap;

    .item {
      width: 50%;
      font-size: 16px;
      display: flex;
      flex-wrap: wrap;
      line-height: 30px;

      .title {
        width: 100px;
        font-size: 16px;
        font-weight: bolder;
      }

      .content {
        width: calc(100% - 150px);
        font-size: 16px;
      }
    }
  }

  .confirm {
    text-align: center;
    padding: 0;
    width: 150px;
    font-size: 20px;
    font-weight: bolder;
  }
  .checklist_title {
    width: 100%;
    text-align: center;
    font-size: 16px;
    line-height: 30px;
    background-color: #757575;
    color: #fff;
    margin-top: 30px;
    &::after {
      content: "▾";
    }
  }
  .products {
    width: 50%;
    padding: 0 30px;
    display: flex;
    margin-top: 30px;
    .photo {
      width: 70px;
      margin-right: 30px;
      img {
        width: 100%;
      }
    }
    .content {
      width: calc(100% - 100px);
      .item {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
#page {
  .page-link {
    color: #000;
  }
  .page-item.disabled .page-link {
    color: #ccc;
  }
  .page-item.active .page-link {
    z-index: 3;
    color: #fff;
    background-color: #000;
    border-color: #000;
  }
}
@media only screen and (max-width: 1199px) {
  .details {
    .receiver {
      width: 100%;

      .item {
        width: 100%;

        .title {
          width: 100%;
        }

        .content {
          text-align: right;
          width: 100%;
        }
      }
    }
    .confirm {
      width: 100%;
    }
    .products {
      width: 100%;
      padding: 0 5px;
      display: flex;
      margin-top: 30px;
      .photo {
        width: 70px;
        margin-right: 15px;
        img {
          width: 100%;
        }
      }
      .content {
        width: calc(100% - 85px);
      }
    }
  }
}
</style>
