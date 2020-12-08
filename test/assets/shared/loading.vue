<template>
  <div id="loading" v-if="loading">
      <div class="back"></div>
      <div class="left"></div>
      <div class="right"></div>
    </div>
</template>
<script>
module.exports = {
  data: () => ({
     loading: false,
  }),
};
</script>