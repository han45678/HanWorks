<template>
  <a href="#" @click.prevent="signout">登出</a>
  <!--prevent等同於event.preventDefault() 可以預防網址出現 # -->
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    signout() {
      const api = "https://vue-course-api.hexschool.io/logout";

      this.$http.post(api).then((response) => {
        //console.log(response.data);
        if (response.data.success){
            this.$router.push('/login')
        }
      });
    }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
