<template>
  <div id="app">
  <!-- header -->
  <app-header :poiInfo="poiInfo"></app-header>
  <!-- nav -->
  <div class="nav">
    <app-nav :commentNum="commentNum"></app-nav>
  </div>
  <!-- contant -->
  <div class="content">
    <keep-alive>
      <!-- 对路由状态的缓存 -->
     <router-view></router-view>
   </keep-alive>
  </div>
   
  </div>
</template>

<script>
import Header from "./components/heder/Header";
import Nav from "./components/nav/nav";
export default {
  name: "App",
  components: {
    "app-header": Header,
    "app-nav": Nav
  },
  data() {
    return {
      poiInfo: {},
      commentNum: 0 // 总评价显示
    };
  },
  created() {
    // es6 请求数据
    fetch("/api/goods")
      .then(res => {
        return res.json();
      })
      .then(response => {
        //  console.log(Response);
        if (response.code == 0) {
          this.poiInfo = response.data.poi_info;
          // console.log( this.poiInfo);
        }
      });

    // 请求ratings ratings
    fetch("/api/ratings")
      .then(res => {
        return res.json();
      })
      .then(response => {
        if (response.code == 0) {
          this.commentNum = response.data.comment_num;
         // console.log(this.commentNum);
        }
      });
  }
};
</script>

<style>
</style>
