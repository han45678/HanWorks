<template>
  <header>
    <div id="logo">
      <h1><a href="./">test</a></h1>
    </div>
    <div id="menu" :class="{ active: menu }">
      <nav>
        <ul>
          <li>
            <a href="./content.html">日曆</a>
          </li>
          <li>
            <a href="">選項二</a>
          </li>
          <li>
            <a href="">選項三</a>
          </li>
          <li>
            <a href="">選項四</a>
          </li>
          <li>
            <a href="">選項五</a>
          </li>
          <li>
            <a href="">選項六</a>
          </li>
        </ul>
      </nav>
    </div>
    <div id="dark" :class="{ active: menu }"></div>
    <div id="menu_button" :class="{ active: menu }" @click="menu = !menu">
      <span class="icon"></span>
    </div>
  </header>
</template>

<script>
module.exports = {
  data: () => ({
    menu: false,
  }),
};
</script>
