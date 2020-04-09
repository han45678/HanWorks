<template>
  <div>
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">商品後台</a>
      <!-- <button id="menuButton" @click="openMenu">
        <span></span>
      </button>
      <input
        id="search"
        class="form-control form-control-dark w-100"
        type="text"
        placeholder="Search"
        aria-label="Search"
      /> -->
      <ul id="signout" class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a class="nav-link" href="#" @click.prevent="signout">登出</a>
        </li>
      </ul>
    </nav>
  </div>
</template>
<style scoped lang="scss">
.navbar-brand {
  font-size: 1.8rem;
}
.navbar .form-control {
  margin-left: 15px;
  margin-right: 15px;
}
#menuButton {
  display: none;
}
@media only screen and (max-width: 768px) {
  #menuButton {
    display: block;
    background: transparent;
    border: none;
    width: 30px;
    height: 30px;
    margin-right: 20px;
    padding:0;
    span {
      width: 30px;
      height: 1px;
      background-color: #fff;
      display: block;
      &::before {
        content: "";
        width: 30px;
        height: 1px;
        background-color: #fff;
        display: block;
        position: relative;
        bottom: 10px;
      }
      &::after {
        content: "";
        width: 30px;
        height: 1px;
        background-color: #fff;
        display: block;
        position: relative;
        top: 10px;
      }
    }
    &.active {
      span {
        height: 0px;
        &::before {
          bottom: 0px;
          transform:rotate(-45deg);
        }
        &::after {
          top: -1px;
          transform:rotate(45deg);
        }
      }
    }
  }
  #signout,#search{
    display: none;
  }
  #signout.active,#search.active{
    display: block;
  }
}
</style>
<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  methods: {
    signout() {
      const api = "https://vue-course-api.hexschool.io/logout";

      this.$http.post(api).then(response => {
        //console.log(response.data);
        if (response.data.success) {
          this.$router.push("/login");
        }
      });
    },
    openMenu(){
      document.getElementById("menuButton").classList.toggle("active");
      document.getElementById("sidebar").classList.toggle("active");
      document.getElementById("signout").classList.toggle("active");
      document.getElementById("search").classList.toggle("active");
     }
    
  }
};
</script>
