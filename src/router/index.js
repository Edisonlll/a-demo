import Vue from 'vue'
import Router from 'vue-router'
const  Login = () => import ('../components/login.vue')
const  Home = () => import ('../components/home.vue')
const  Users = () => import ('../components/users.vue')
const  Rights = () => import ('../components/rights.vue')
const  Roles = () => import ('../components/roles.vue')
const  Goods = () => import ('../components/goods.vue')
const  Goodsadd = () => import ('../components/goodsadd.vue')
const  Params = () => import ('../components/params.vue')
const  Goodscate = () => import ('../components/goodscate.vue')
const  Order = () => import ('../components/order.vue')
const  Reports = () => import ('../components/reports.vue')
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