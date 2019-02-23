// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/base.css'
import moment from 'moment'
Vue.config.productionTip = false
import ELEMENT from 'element-ui'
import CusBread from './components/cusBread.vue'
import HttpServer from './http'
Vue.use(HttpServer)
Vue.use(ELEMENT)
Vue.filter('fmtdate', (v) => {
 return moment(v).format('YYYY-MM-DD')
})
Vue.component('CusBread',CusBread)
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
