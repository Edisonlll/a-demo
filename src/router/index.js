import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Users from '../components/users.vue'
import Rights from '../components/rights.vue'
import Roles from '../components/roles.vue'
import Goods from '../components/goods.vue'
import Goodsadd from '../components/goodsadd.vue'
import Params from '../components/params.vue'
import Goodscate from '../components/goodscate.vue'
import Order from '../components/order.vue'
import Reports from '../components/reports.vue'
import {
  Message
} from 'element-ui';
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [{
        name: 'users',
        path: 'users',
        component: Users
      },
      {
        name: 'rights',
        path: '/rights',
        component: Rights
      },
      {
        name: 'roles',
        path: '/roles',
        component: Roles
      },
      {
        name: 'goods',
        path: '/goods',
        component: Goods
      },
      {
        name: 'goodsadd',
        path: '/goodsadd',
        component: Goodsadd
      },
      {
        name: 'params',
        path: '/params',
        component: Params
      },
      {
        name:'goodscate',
        path:'/categories',
        component:Goodscate
      },
      {
        name:'order',
        path:'/orders',
        component:Order
      },
      {
        name:'reports',
        path:'/reports',
        component:Reports
      }]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
  } else {
    const token = localStorage.getItem("token");
    if (!token) {
      Message.warning('请先登录')
      router.push({
        name: 'login'
      })
      return;
    }
    next()
  }
})

export default router;