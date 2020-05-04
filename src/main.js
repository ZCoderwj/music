// Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// fastclick解决网页延迟300ms的问题
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'


// 网页的入口
import 'common/stylus/index.styl'


// 整个body下div按钮的点击都会没有300ms的延迟
fastclick.attach(document.body)

// 图片懒加载插件
Vue.use(VueLazyLoad , {
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
