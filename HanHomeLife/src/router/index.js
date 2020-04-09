import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import dashboard from '../components/dashboard.vue'
import login from '../components/pages/login.vue'
import products from '../components/pages/products.vue'
import order from '../components/pages/order.vue'
import add from '../components/pages/add.vue'
import edit from '../components/pages/edit.vue'
// import simulationCustomerOrders from '../components/pages/simulation-CustomerOrders.vue'
// import simulationCart from '../components/pages/simulation-cart.vue'

import About from '../views/About.vue'
import gasFryer from '../views/gasFryer.vue'
import oven from '../views/oven.vue'
import juicer from '../views/juicer.vue'
import cutter from '../views/cutter.vue'
import AllProducts from '../views/AllProducts.vue'
import shopCart from '../views/shopCart.vue'
import customerCheckout from '../views/customerCheckout.vue'

Vue.use(VueRouter)

const routes = [{
    path: '*',
    redirect: '/'
    //避免進入沒定義的頁面(在網址列上亂打)
  },

  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/AllProducts',
    name: 'AllProducts',
    component: AllProducts,
  },
  {
    path: '/gasFryer',
    name: 'gasFryer',
    component: gasFryer,
  },
  {
    path: '/oven',
    name: 'oven',
    component: oven,
  },
  {
    path: '/juicer',
    name: 'juicer',
    component: juicer,
  },
  {
    path: '/cutter',
    name: 'cutter',
    component: cutter,
  },
  {
    path: '/shopCart',
    name: 'shopCart',
    component: shopCart,
  },
  {
    path: '/customer_checkout/:orderId',
    name: 'customerCheckout',
    component: customerCheckout,
  },

  //後台管理者登入
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/admin',
    name: 'admin',
    component: dashboard,
    meta: {
      requiresAuth: true
    }, //內層需要每地都加才有用
    children: [{
        path: 'products', // 前面路徑都會加上斜線,內層勿加,不然找不到
        name: 'products',
        component: products,
        meta: {
          requiresAuth: true
        }, //內層需要每地都加才有用
      },
      {
        path: 'add', // 前面路徑都會加上斜線,內層勿加,不然找不到
        name: 'add',
        component: add,
        meta: {
          requiresAuth: true
        }, //內層需要每地都加才有用
      },
      {
        path: 'edit', // 前面路徑都會加上斜線,內層勿加,不然找不到
        name: 'edit',
        component: edit,
        meta: {
          requiresAuth: true
        }, //內層需要每地都加才有用
      },
      {
        path: 'order', // 前面路徑都會加上斜線,內層勿加,不然找不到
        name: 'order',
        component: order,
        meta: {
          requiresAuth: true
        }, //內層需要每地都加才有用
      },
      // {
      //   path: 'simulation-customer-orders', // 前面路徑都會加上斜線,內層勿加,不然找不到
      //   name: 'simulation-CustomerOrders',
      //   component: simulationCustomerOrders,
      //   meta: {
      //     requiresAuth: true
      //   }, //內層需要每地都加才有用
      // },
      // {
      //   path: 'simulation-cart', // 前面路徑都會加上斜線,內層勿加,不然找不到
      //   name: 'simulation-cart',
      //   component: simulationCart,
      //   meta: {
      //     requiresAuth: true
      //   }, //內層需要每地都加才有用
      // }
    ],
  }
]

const router = new VueRouter({
  routes
})

export default router