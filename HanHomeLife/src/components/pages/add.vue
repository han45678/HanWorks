<template>
  <div>
    <div class="row mt-4 mb-4 justify-content-md-center">
      <div class="col-md-8 text-right mb-4">
        <router-link to="products">
          <button type="button" class="btn btn-danger mt-3">回商品列表</button>
        </router-link>
      </div>
      <div class="col-md-8 text-center mb-4">
        <h1>新增產品</h1>
      </div>
      <div class="col-md-8">
        <div class="form-row">
          <div class="form-group col-md-12 text-right">
            <div class="form-check">
              <input
                type="checkbox"
                v-model="tempProduct.is_enabled"
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
              v-model="tempProduct.title"
              placeholder="請輸入標題"
              class="form-control"
            />
          </div>
          <div class="form-group col-md-6">
            <label for="category">分類</label>
            <select
              class="form-control"
              type="unit"
              id="category"
              v-model="tempProduct.category"
              placeholder="請輸入分類"
            >
              <option value="氣炸鍋">氣炸鍋</option>
              <option value="烤箱">烤箱</option>
              <option value="果汁機">果汁機</option>
              <option value="刀具">刀具</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div class="form-group col-md-6">
            <label for="price">單位</label>
            <select
              class="form-control"
              type="unit"
              id="unit"
              v-model="tempProduct.unit"
              placeholder="請輸入單位"
            >
              <option value="台">台</option>
              <option value="組">組</option>
              <option value="個">個</option>
              <option value="把">把</option>
            </select>
          </div>
          <div class="form-group col-md-6">
            <label for="origin_price">原價</label>
            <input
              type="number"
              id="origin_price"
              v-model="tempProduct.origin_price"
              placeholder="請輸入原價"
              class="form-control"
            />
          </div>
          <div class="form-group col-md-6">
            <label for="price">售價</label>
            <input
              type="number"
              id="price"
              v-model="tempProduct.price"
              placeholder="請輸入售價"
              class="form-control"
            />
          </div>
          <div class="form-group col-md-12">
            <label for="price">輸入圖片網址</label>
            <input
              type="text"
              id="image"
              v-model="tempProduct.imageUrl"
              placeholder="請輸入圖片連結"
              class="form-control"
            />
          </div>
          <!-- <div class="form-group col-md-6">
            <label for="inputfile">或 上傳圖片</label>
            <input class="form-control" ref="file" @change="uploadFile" type="file" id="inputfile" />
          </div> -->
          <div class="form-group col-md-12 text-center">
            <img :src="tempProduct.imageUrl" />
          </div>
          <div class="col-md-12 text-center">
            <button type="button" class="btn btn-primary" @click="updateProduct">新增商品</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tempProduct: {}
    };
  },
  methods: {
    updateProduct() {
      const self = this;
      const api =
        "https://vue-course-api.hexschool.io/api/han_vue/admin/product";
      self.$http.post(api, { data: this.tempProduct }).then(response => {
        //送出的參數是物件並包著data，所以必須用大括弧包起來 //例：{data:this.tempProduct}
        //console.log(response.data);
        if (response.data.success) {
          self.$swal("新增成功！", "商品已新增", "success");
          self.$router.push("products"); //內頁加上斜線會找不到
        } else {
          self.$swal("新增失敗", "商品未新增！", "error");
        }
      });
    },
    // uploadFile() {
    //   //console.log(this)
    //   const uploadedFile = this.$refs.files.files[0];
    //   const formData = new FormData();
    //   formData.append("file-to-upload", uploadedFile);
    //   const api = `https://vue-course-api.hexschool.io/api/han_vue/admin/upload`;
    //   this.$http
    //     .post(api, formData, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data'
    //       }
    //     })
    //     .then(res => {
    //       //console.log(res.data);
    //       // if (res.data.success) {
    //       //   this.$set(this.tempProduct, "imageUrl", res.data.imageUrl);
    //       // }
    //     });
    // }
  }
};
</script>
<style scoped>
img {
  max-width: 100%;
  max-height: 500px;
}
</style>