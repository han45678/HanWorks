<template>
  <div>
    <header>
      <div class="wrapper">
        <div id="logo">
          <router-link to="/">
            <span>HAN</span>
            家居生活
          </router-link>
        </div>
        <button id="menu_button" @click="PhoneMenu()">
          <span></span>
        </button>
        <nav id="nav">
          <ul>
            <li id="about">
              <router-link to="/about">關於我們</router-link>
            </li>
            <li>
              <router-link to="/gasFryer">氣炸鍋</router-link>
            </li>
            <li>
              <router-link to="/oven">烤箱</router-link>
            </li>
            <li>
              <router-link to="/juicer">果汁機</router-link>
            </li>
            <li>
              <router-link to="/cutter">刀具</router-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  </div>
</template>
<script>
export default {
  methods: {
    PhoneMenu() {
      document.getElementById("nav").classList.toggle("active");
      document.getElementById("menu_button").classList.toggle("active");
    }
  }
};
</script>

<style scoped lang="scss">
header {
  width: 100%;
  height: 90px;
  background-color: #fcfcfc;
  //margin-bottom: 15px;
  box-shadow: 0px 10px 60px -22px #242424;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  .wrapper {
    position: relative;
    display: flex;
    padding: 0 15px;
    #logo {
      a {
        line-height: 90px;
        width: 250px;
        font-size: 24px;
        font-family: "Pacifico", "Noto Serif SC", serif;
        font-weight: 900;
        color: #000;
        text-decoration: none;
        span {
          background-color: #d70545;
          color: #fff;
          padding: 0 10px;
          font-size: 32px;
          font-weight: normal;
        }
      }
    }
    #menu_button {
      outline: none;
      display: none;
    }
    nav {
      width: calc(100% - 250px);
      text-align: right;
      ul {
        margin-bottom: 0;
        li {
          display: inline;
          a {
            font-size: 16px;
            font-family: "Pacifico", "Noto Serif SC", serif;
            line-height: 90px;
            color: #808080;
            padding: 0 30px;
            display: inline-block;
            transition: 0.6s;
            text-decoration: none;
            &:hover {
              background-color: #242424;
              color: #fff;
            }
          }
          &.active {
            a {
              background-color: #242424;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
@media only screen and (max-width: 810px) {
  header {
    .wrapper {
      #menu_button {
        width: 30px;
        height: 30px;
        border: none;
        position: absolute;
        padding: 0;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        display: block;
        background-color: transparent;
        span {
          width: 100%;
          height: 1px;
          background-color: #575757;
          display: block;
          transition: 0.6s;
          &::before {
            content: "";
            width: 100%;
            height: 1px;
            background-color: #575757;
            display: block;
            position: absolute;
            top: 2.5px;
            transition: 0.6s;
          }
          &::after {
            content: "";
            width: 100%;
            height: 1px;
            background-color: #575757;
            display: block;
            position: absolute;
            bottom: 2.5px;
            transition: 0.6s;
          }
        }
        &.active {
          span {
            height: 0px;
            &::before {
              height: 1px;
              transform: rotate(45deg);
              top: 14.5px;
            }
            &::after {
              height: 1px;
              transform: rotate(-45deg);
              top: 14.5px;

              bottom: unset;
            }
          }
        }
      }
      nav {
        background-color: #fcfcfc;
        position: absolute;
        width: 100%;
        height: calc(100vh - 90px);
        right: -100%;
        top: 90px;
        transition: 0.6s;
        &.active {
          right: 0;
        }
        ul {
          margin-bottom: 0;
          border-top: 1px solid #ccc;
          li {
            display: block;
            text-align: center;
            border-bottom: 1px solid #ccc;
            a {
              display: block;
              &:hover {
                &::before {
                  content: "—    ";
                }
                &::after {
                  content: "    —";
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
