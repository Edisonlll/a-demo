import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Users from '../components/users.vue'
import Rights from '../components/rights.vue'
import Roles from '../components/roles.vue'
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
      }]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if(to.name==='login'){
    next()
  }else{
    const token = localStorage.getItem("token");
    if(!token){
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