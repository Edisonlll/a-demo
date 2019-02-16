// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/base.css'
import moment from 'moment'
Vue.config.productionTip = false
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
Vue.use(ElementUI)
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
/* eslint-disable no-new */
Vue.filter('fmtdate', (v) => {
 return moment(v).format('YYYY-MM-DD')
})
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
