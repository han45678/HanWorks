<template>
  <div>
    <VueHeader></VueHeader>
    <main>
      <div id="about_banner" class="back">
        <!--關於我banner-->
        <div class="wrapper">
          <div class="content">
            <h2>HAN居家生活</h2>
            <p>
              <span class="red">『HAN居家生活,讓您在家可以hen居家！』</span>
            </p>
            <p class="mt-4">HAN居家生活創立於1995年</p>
            <p>主要販售居家生活用品</p>
          </div>
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
    VueFooter
  },
  data() {
    return {};
  },
  methods: {},
  created() {}
};
</script>

<style scoped lang="scss">
main {
  margin-top: 90px;
  .back {
    height: calc(100vh - 90px);
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
          .red {
            background: #d70545;
            padding: 5px 15px;
            font-size: 20px;
          }
        }
      }
    }
  }
  #about_banner {
    z-index: 1;
    background-image: url("https://cdn.pixabay.com/photo/2016/12/11/01/47/interior-1898583_960_720.jpg");
    .wrapper {
      .content {
        left: 50%;
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
    .back {
      .wrapper {
        .content {
          padding: 50px 30px;
          h2 {
            font-size: 36px;
          }
          p {
            font-size: 18px;
            .red {
              background: #d70545;
              padding: 5px 5px;
              font-size: 12px;
            }
          }
        }
      }
    }
    #about_banner {
      .wrapper {
        .content {
          left: 0;
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