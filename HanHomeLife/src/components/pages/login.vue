<template>
  <div>
    <form class="form-signin" @submit.prevent="signin">
      <h1 class="h3 mb-3 font-weight-normal">請登入</h1>
      <label for="inputEmail" class="sr-only">輸入Email</label>
      <input
        type="email"
        id="inputEmail"
        class="form-control"
        placeholder="請輸入帳號"
        v-model="user.username"
        required
        autofocus
      />
      <label for="inputPassword" class="sr-only">輸入密碼</label>
      <input
        type="password"
        id="inputPassword"
        class="form-control"
        placeholder="請輸入密碼"
        v-model="user.password"
        required
      />
      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me" /> 記住帳號
        </label>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      <p class="mt-5 mb-3 text-muted">&copy; 2017-2018</p>
    </form>
  </div>
</template>

<script>

export default {
  name: "HelloWorld",
  data() {
    return {
      user: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    signin() {//登入事件
      const api = "https://vue-course-api.hexschool.io/admin/signin";
      //admin＝讀取cookie需要
      this.$http.post(api, this.user, {
        withCredentials: true //correct
      }).then(response => {
        //console.log(response.data);
        if (response.data.success){
        //如果data裡的success是true就執行這個行為
            this.$router.push('/admin/products')
        }else{
          alert('輸入帳號密碼錯誤');
        }
      });
    }
  }
};
</script>

<style scoped>
h1{
  text-align: center;
  padding-top: 25%;
  padding-bottom: 50px;
}
html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>