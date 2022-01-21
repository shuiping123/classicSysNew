import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css
import '@/assets/css/style.css' // 引入私人通用css

import App from './App'
import store from './store'
import router from './router'

import current from '@/assets/js/current';
import collections from '@/assets/js/collections';
Vue.prototype.$current=current;
Vue.prototype.$collections=collections;

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log


import * as filters from './filters' // global filters
import {messages} from '@/assets/js/language/index'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: store.state.settings.language, // 语言标识
  messages
});
import 'vx-easyui/dist/themes/default/easyui.css';
import 'vx-easyui/dist/themes/icon.css';
import 'vx-easyui/dist/themes/vue.css';
import EasyUI from 'vx-easyui';
Vue.use(EasyUI);

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})


// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

let thisVue = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})
export default thisVue;
