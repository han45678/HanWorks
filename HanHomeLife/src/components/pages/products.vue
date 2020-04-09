<template>
  <div>
    <div id="isEdit">
      <div id="isEdit_content">
        <div class="col-md-12">
          <h3>修改訂單</h3>
        </div>
        <div class="col-md-12">
          <div class="form-row">
            <div class="form-group col-md-12 text-right">
              <div class="form-check">
                <input
                  type="checkbox"
                  v-model="edit.is_enabled"
                  true-value="1"
                  false-value="0"
                  id="is_enabled"
                  class="form-check-input"
                />
                <label for="is_enabled" class="form-check-label">是否啟用</label>
              </div>
            </div>
            <div class="form-group col-md-12">
              <label for="title">標題</label>
              <input
                type="text"
                id="title"
                v-model="edit.title"
                placeholder="請輸入標題"
                class="form-control"
              />
            </div>
            <div class="form-group col-md-6">
              <label for="category">分類</label>
              <input
                type="text"
                id="category"
                v-model="edit.category"
                placeholder="請輸入分類"
                class="form-control"
              />
            </div>
            <div class="form-group col-md-6">
              <label for="price">單位</label>
              <input
                type="unit"
                id="unit"
                v-model="edit.unit"
                placeholder="請輸入單位"
                class="form-control"
              />
            </div>
            <div class="form-group col-md-6">
              <label for="origin_price">原價</label>
              <input
                type="number"
                id="origin_price"
                v-model="edit.origin_price"
                placeholder="請輸入原價"
                class="form-control"
              />
            </div>
            <div class="form-group col-md-6">
              <label for="price">售價</label>
              <input
                type="number"
                id="price"
                v-model="edit.price"
                placeholder="請輸入售價"
                class="form-control"
              />
            </div>
            <div class="form-group col-md-12">
              <label for="price">圖片位置</label>
              <input
                type="text"
                id="image"
                v-model="edit.imageUrl"
                placeholder="請輸入圖片連結"
                class="form-control"
              />
            </div>
            <div class="form-group col-md-12 text-center">
              <img :src="edit.imageUrl" />
            </div>
            <div class="col-md-12 text-center">
              <button type="button" class="btn btn-primary" @click="editSubmit">修改</button>
              <button type="button" class="btn btn-danger" @click="CancelEdit">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-right mt-4">
      <router-link to="add">
        <button type="button" class="btn btn-primary mt-3">新增產品</button>
      </router-link>
    </div>
    <table class="table mt-4">
      <thead>
        <th>縮圖</th>
        <th>分類</th>
        <th width="50%">產品名稱</th>
        <th class="text-right">原價</th>
        <th class="text-right">售價</th>
        <th class="text-center">是否啟用</th>
        <th>數量</th>
        <th class="text-center">編輯</th>
      </thead>
      <tbody>
        <tr v-for="item in $store.state.products" :key="item.id">
          <td class="photo" data-th="縮圖：">
            <img :src="item.imageUrl" />
          </td>
          <td class="classification" data-th="分類：">{{ item.category }}</td>
          <td class="name" data-th="產品名稱：">{{ item.title }}</td>
          <td class="original text-right" data-th="原價：">${{ item.origin_price }}</td>
          <td class="price text-right" data-th="售價：">${{ item.price }}</td>
          <td class="enable text-center" data-th="是否啟用：">
            <span v-if="item.is_enabled === '1'" class="text-success">啟用</span>
            <span v-else class="text-danger">未啟用</span>
          </td>
          <td class="quantity" data-th="數量：">{{ item.num }}{{ item.unit }}</td>
          <td class="operating text-center">
            <button type="button" class="btn btn-info mr-2" @click="openModel(item.id)">編輯</button>
            <button type="button" class="btn btn-danger" @click="removeProducts(item.id)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
export default {
  data() {
    return {
      isNew: false,
      edit: {
        id: "",
        is_enabled: "0",
        title: "",
        category: "",
        unit: "",
        origin_price: "",
        price: "",
        imageUrl: ""
      }
    };
  },
  methods: {
    editSubmit() {
      const self = this;
      self.$http
        .put(
          `https://vue-course-api.hexschool.io/api/han_vue/admin/product/${this.edit.id}`,
          {
            data: {
              is_enabled: this.edit.is_enabled,
              title: this.edit.title,
              category: this.edit.category,
              unit: this.edit.unit,
              origin_price: this.edit.origin_price,
              price: this.edit.price,
              imageUrl: this.edit.imageUrl
            }
          }
        )
        .then(resp => {
          //console.log(resp);
          document.getElementById("isEdit").classList.remove("active");
          self.$store.dispatch("getAllProduct");
          self.$swal("修改成功！", "商品已修改完成", "success");
        })
        .catch(err => console.log(err));
    },
    removeProducts(id) {
      const self = this;
      const api = `https://vue-course-api.hexschool.io/api/han_vue/admin/product/${id}`;
      this.$http
        .delete(api)
        .then(response => {
          //console.log(response);
          if (response.data.success) {
            self.$swal("刪除成功！", "商品已刪除", "info");
            this.$store.dispatch("getAllProduct");
            this.getProduct(); //重新讀取列表
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    openModel(itemId) {
      //this.isEdit = true;
      // console.log(this.$store.state.products);
      document.getElementById("isEdit").classList.add("active");
      this.edit.id = itemId;
      let product = this.$store.state.products.filter(
        product => product.id === itemId
      )[0];

      this.edit.title = product.title;
      this.edit.is_enabled = product.is_enabled;
      this.edit.category = product.category;
      this.edit.unit = product.unit;
      this.edit.origin_price = product.origin_price;
      this.edit.price = product.price;
      this.edit.imageUrl = product.imageUrl;
    },
    CancelEdit() {
      document.getElementById("isEdit").classList.remove("active");
    }
  },
  created() {
    //沒有執行事件觸發，務必要在下方加入created才會執行
    this.$store.dispatch("getAllProduct");
  }
};
</script>

<style scoped lang="scss">
#isEdit {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1030;
  display: none;

  &.active {
    display: block;
  }

  #isEdit_content {
    max-width: 500px;
    height: auto;
    background: #fff;
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: auto;
    padding: 30px;
    img {
      max-height: 250px;
      max-width: 100%;
    }
    button {
      margin: 15px 5px 0 5px;
    }
  }
}

.photo img {
  max-width: 100px;
  margin: auto;
}

table thead {
  font-size: 18px;
}

table tbody tr td {
  font-size: 16px;
  vertical-align: middle !important;
}

@media only screen and (max-width: 1420px) {
  table {
    margin-top: 0 !important;
  }

  table thead {
    display: none;
  }

  table tbody {
    display: flex;
    flex-wrap: wrap;

    tr {
      width: 30%;
      margin: 30px 1.5%;
      padding: 15px;
      box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.3);
      border-radius: 15px;
      display: flex;
      flex-wrap: wrap;

      td,
      td.text-center {
        width: 100%;
        text-align: right !important;

        &::before {
          content: attr(data-th);
          width: 100%;
          display: block;
          text-align: left;
          font-weight: bolder;
          font-size: 18px;
        }
      }
    }
  }

  .name {
    order: 1;
    border: none;
    text-align: center !important;
    font-size: 24px;
    padding-top: 0;

    &::before {
      display: none;
    }
  }

  .photo {
    order: 2;
    text-align: center !important;

    img {
      width: 100%;
      max-width: 250px;
    }

    &::before {
      display: none;
    }
  }

  .price,
  .classification,
  .original,
  .enable,
  .quantity,
  .operating {
    padding: 5px;
    order: 3;
  }
}

@media only screen and (max-width: 1024px) {
  table tbody {
    tr {
      width: 47%;
    }
  }
}

@media only screen and (max-width: 768px) {
  main {
    padding-top: 67px;
  }

  table tbody tr td:before {
    margin-bottom: 15px;
  }

  table tbody {
    tr {
      width: 100%;
    }
  }
}
</style>
