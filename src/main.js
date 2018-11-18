// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import VueRouter from "vue-router";

// 引入路由
import Goods from "@/components/goods/Goods";
import Ratings from "@/components/ratings/ratings";
import Seller from "@/components/seller/Seller";

Vue.config.productionTip = false;
Vue.use(VueRouter);
const routes = [{
    path: "/",
    redirect: "/goods"
  },
  {
    path: "/goods",
    component: Goods
  },
  {
    path: "/ratings",
    component: Ratings
  },
  {
    path: "/seller",
    component: Seller
  },
  {
    path: '*',
    redirect: '/'
  }

];
const router = new VueRouter({
  routes,
  mode: 'history'  ,// 解决再次刷新
  linkActiveClass: "active" //  路由默认选中得样式
})

/* eslint-disable no-new */

new Vue({
  el: "#app",
  router,
  components: {
    App
  },
  template: "<App/>"
});

