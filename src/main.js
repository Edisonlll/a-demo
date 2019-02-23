// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ELEMENT from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import App from './App'
import CusBread from '@/components/cusBread.vue'
import HttpServer from '@/http.js'
import router from './router'
import moment from 'moment'


// 所有的Vue插件都是这样用
// 希望这样用
// 把不是Vue插件axios变成Vue的插件
Vue.use(HttpServer);

// 下面是Vue插件的用法
// Vue.use(VueRouter)
Vue.use(ELEMENT)

Vue.config.productionTip = false

// 全局过滤器 - 处理日期格式
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD');
})

// 全局自定义面包屑组件
// Vue.component("cusBread", CusBread);
Vue.component(CusBread.name, CusBread);

// Vue.component("myTable", CusBread);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
