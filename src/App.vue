<template>
  <div id="app">
  <!-- header -->
  <app-header :poiInfo="poiInfo"></app-header>
  <!-- nav -->
  <div class="nav">
    <app-nav></app-nav>
  </div>
  <!-- contant -->
  <div class="content">
   <router-view></router-view>
  </div>
   
  </div>
</template>

<script>
import Header from "./components/heder/Header"
import  Nav from "./components/nav/nav"
export default{
  name: "App",
  components: {
    "app-header": Header,
    "app-nav": Nav
  },
  data(){
    return {
      poiInfo :{}
    }
  },
  created(){
    // es6 请求数据
    fetch("/api/goods")
      .then(res=>{
        return res.json()
      })
      .then(response =>{
      //  console.log(Response);
        if(response.code == 0){
          this.poiInfo = response.data.poi_info
           // console.log( this.poiInfo);
        }
      })
  }
}


</script>

<style>

</style>
