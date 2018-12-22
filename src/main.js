// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'
import appheader from './components/appheader/appheader'
import goods from './components/goods/goods'
import ratings from './components/ratings/ratings'
import seller from './components/seller/seller'

Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(VueResource);

//配置路由
const router = new VueRouter({
	linkActiveClass:'active',
	routes:[		
			{path:"/goods",component:goods},
			{path:"/ratings",component:ratings},
			{path:"/seller",component:seller},
			// 重定向
		    {
		        path: '/', 
		        redirect: '/goods' 
		    }
		],
		mode:"history"
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
