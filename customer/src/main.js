// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store.js'
Vue.use(store);
import './assets/icon/iconfont.css'
import 'jquery'
  
import "./assets/fa/css/font-awesome.css";

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element);

import './assets/emoji/css/iconfont.css';
import { emoji } from './utils/emoji.js' ;
Vue.prototype.emoji = emoji;

import layer from 'vue-layer';
Vue.prototype.$layer = layer(Vue);
// this.$layer.config(options);

import animate from 'animate.css';
Vue.use(animate);

Vue.config.productionTip = false;

// 引入自定义指令
// import './directives.js';

if (module.hot) {
  module.hot.accept();
} 


import axios from "axios"; 
Vue.prototype.http = axios;
import qs from 'qs';
Vue.prototype.$qs = qs;

 
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
