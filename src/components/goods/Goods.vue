<template>
    <div class="goods">
        <!-- 分类列表 -->
        <div class="menu-wrapper" ref="menuScroll">
            <ul>
                <!-- 专场 -->  
                <li class="menu-item" :class="{'current':currentIdex === 0}" @click="selectMenu(0)">
                    <p class="text">
                        <!-- 图片绑定  有的存在-->
                         <img class="icon" :src="container.tag_icon" v-if="container.tag_icon">
                          {{container.tag_name}}
                    </p>
                </li>
                <!-- 热销  循环-->
                 <li class="menu-item"  v-for="(item,index) in goods" :key="index" :class="{'current': currentIdex === index +1}" @click="selectMenu(index+1)">
                     <!-- 同步下标 -->
                    <p class="text">
                        <!-- 图片绑定  有的存在-->
                         <img class="icon" :src="item.icon" v-if="item.icon">
                          {{item.name}}
                    </p>
                  <i class="num" v-show="calculateCount(item.spus)">
                        {{calculateCount(item.spus)}}
                  </i>
                </li>
                 
            </ul>

            
        </div>
        <!-- 商品列表 -->
        <div class="foods-wrapper" ref="foodScroll">
            <ul>
                <!-- 专场   循环-->
                <li class="container-list food-list-hook">
                    <div v-for="(item,index) in container.operation_source_list" :key="index">
                        <img :src="item.pic_url">
                    </div>
                </li>
                <!-- 具体商品 -->
                <li class="food-list food-list-hook" v-for="(item,index) in goods" :key="index" >
                    <h3 class="title">{{item.name}}</h3>

                    <!-- 具体的商品列表 -->
                    <ul>
                        <li v-for="(food,index) in item.spus" :key="index" class="food-item">
                            <div class="icon" :style="head_bg(food.picture)"></div>
                            <div class="content">
                                <h3 class="name">{{food.name}}</h3>
                                <p class="desc" v-if="food.description">{{food.description}}</p>
                                 <div class="extra">
                                    <span class="saled">{{food.month_saled_content}}</span>
                                    <span class="praise">{{food.praise_content}}</span>
                                </div>
                                 <img class="product" :src="food.product_label_picture" alt="">
                                <p class="price">
                                    <span class="text">${{food.min_price}}</span>
                                    <span class="unit">/{{food.unit}}</span>
                                </p>
                            </div>
                            <!--  加减号组件 -->
                          
                             <div class="cartcontrol-wrapper">
                                <app-cart-control :food="food" ></app-cart-control>
                           </div>

                        </li>
                    </ul>

                </li>
            </ul>
        </div>
        <!-- 购物车 -->
          <app-Shopcart :poiInfo="poiInfo" :selectFoods="selectFoods"></app-Shopcart>  
    </div>
</template>
<script>
import BScroll from "better-scroll"; // 引入 better-scroll
import Shopcart from "../shopcart/Shopcart"  //购物车组件
import Cartcontrol from "../cartcontrol/Cartcontrol"   //  加减号组件
/* 属性传值 */
export default {
  components:{
    "app-Shopcart": Shopcart,
    "app-cart-control" : Cartcontrol
  },
  data() {
    return {
      container: {},
      goods: [],
      listHeight: [], // li 元素的 可视高数组
      menuScroll: {}, // 滚动对象
      foodScroll: {},
      scrollY: 0,
      poiInfo: {}  
    };
  },
  // 计算属性不能接受参数 用方法
  methods: {
    //   背景计算
    head_bg(imgName) {
      return "background-image: url(" + imgName + ");";
    },
    initScroll() {
      //  传入需要滚动的对象  绑定  和 v-model 正对表单
      this.menuScroll = new BScroll(this.$refs.menuScroll); // 实例化
      this.foodScroll = new BScroll(this.$refs.foodScroll, {
        probeType: 3,
        click: true  // 使用减价号的方法
      });
      // 滚动监听事件
      this.foodScroll.on("scroll", pos => {
        // console.log(pos.y)
        // 负数处理
        this.scrollY = Math.abs(Math.round(pos.y));
      });


    },
    calculateHeight() {
      //滚动右侧
      //  找到每一个 li 元素 [arry]
      let foodlist = this.$refs.foodScroll.getElementsByClassName(
        "food-list-hook"
      );
      // console.log(foodlist)

      let height = 0; // 起初
      this.listHeight.push(height);
      for (let i = 0; i < foodlist.length; i++) {
        let item = foodlist[i];
        // 累加可视高度
        height += item.clientHeight;
        this.listHeight.push(height);
      }
      // console.log(this.listHeight);
    }, 
     selectMenu(index){
      // console.log(index)
      let foodlist = this.$refs.foodScroll.getElementsByClassName("food-list-hook")
      let element = foodlist[index]
      // console.log(element)
      // 滚动到对应元素的位置
      this.foodScroll.scrollToElement(element,250)
    },
     calculateCount(spus){
      let count = 0
      spus.forEach((food) => {
        if(food.count > 0){
          count += food.count
        }
      })
      return count
    }  
   
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
          this.container = response.data.container_operation_source
          this.goods = response.data.food_spu_tags
           this.poiInfo = response.data.poi_info  // 购物车底部信息
          //console.log(this.goods);

          // Dom 更新完成 以后  执行
          this.$nextTick(() => {
            // 手动执行 滚动方法
            this.initScroll();
            //  同步左边  计算分类的区间
            //  监听滚动的位置  根据滚动位置确认下标
            //  通过下标实现点击左侧滚动到右侧 (同步右边)
            this.calculateHeight(); // 找每一里的可视高度
          });
        }
      });
  },
  computed: {
    currentIdex() {
      //  计算具体的区间
      for (let i = 0; i < this.listHeight.length; i++) {
        //  获取商品区间范围
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        // 是否的上述区间   数组越界 !height2
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          // console.log(i)
          return i;
        }
      }
      return 0;
    },
    //   计算添加的个数
    selectFoods(){
      let  foods = []
      this.goods .forEach((myfoods) => {
        myfoods.spus.forEach((food) =>{
          if(food.count>0){  // 个数添加了
            foods.push(food)
          }
        }) 
      });
      return foods  // 
    }
  }
};
</script>
<style scoped>
.goods {
  display: flex;
  position: absolute;
  top: 190px;
  bottom: 51px;
  overflow: hidden;
  width: 100%;
}

.goods .menu-wrapper {
  flex: 0 0 85px;
  background: #f4f4f4;
}

.goods .foods-wrapper {
  flex: 1;
  /* background: blue; */
}

/* Menu item */
.goods .menu-wrapper .menu-item {
  padding: 16px 23px 15px 10px;
  border-bottom: 1px solid #e4e4e4;
  position: relative;
}

.goods .menu-wrapper .menu-item .text {
  font-size: 13px;
  color: #333333;
  line-height: 17px;
  vertical-align: middle;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods .menu-wrapper .menu-item .text .icon {
  width: 15px;
  height: 15px;
  vertical-align: middle;
}

/* 专场样式 */
.goods .foods-wrapper .container-list {
  padding: 11px 11px 0 11px;
  border-bottom: 1px solid #e4e4e4;
}

.goods .foods-wrapper .container-list img {
  width: 100%;
  margin-bottom: 11px;
  border-radius: 5px;
}

/* 具体分类商品布局 */
.goods .foods-wrapper .food-list {
  padding: 11px;
}

.goods .foods-wrapper .food-list .title {
  height: 13px;
  font-size: 13px;
  background: url(./img/btn_yellow_highlighted@2x.png) no-repeat left center;
  background-size: 2px 10px;
  padding-left: 7px;
  margin-bottom: 12px;
}

.goods .foods-wrapper .food-list .food-item {
  display: flex;
  margin-bottom: 25px;
  position: relative; 
}
.goods .foods-wrapper .food-list .food-item .cartcontrol-wrapper {
  position: absolute;
  right: 0;
  bottom: 0;
}
.goods .foods-wrapper .food-list .food-item .icon {
  flex: 0 0 63px;
  background-position: center;
  background-size: 120% 100%;
  background-repeat: no-repeat;
  margin-right: 11px;
  height: 75px;
}
.goods .foods-wrapper .food-list .food-item .content {
  flex: 1;
}

/* 具体内容样式 */
.goods .foods-wrapper .food-list .food-item .content .name {
  font-size: 16px;
  line-height: 21px;
  color: #333333;
  margin-bottom: 10px;
  padding-right: 27px;
}

.goods .foods-wrapper .food-list .food-item .content .desc {
  font-size: 10px;
  line-height: 19px;
  color: #bfbfbf;
  margin-bottom: 8px;

  /* 超出部分显示省略号*/
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods .foods-wrapper .food-list .food-item .content .extra {
  font-size: 10px;
  color: #bfbfbf;
  margin-bottom: 7px;
}
.goods .foods-wrapper .food-list .food-item .content .extra .saled {
  margin-right: 14px;
}
.goods .foods-wrapper .food-list .food-item .content .product {
  height: 15px;
  margin-bottom: 6px;
}
.goods .foods-wrapper .food-list .food-item .content .price {
  font-size: 0;
}
.goods .foods-wrapper .food-list .food-item .content .price .text {
  font-size: 14px;
  color: #fb4e44;
}
.goods .foods-wrapper .food-list .food-item .content .price .unit {
  font-size: 12px;
  color: #bfbfbf;
}

/* 滚动 当前选中 */
.goods .menu-wrapper .menu-item.current {
  background: white;
  font-weight: bold;
  margin-top: -1px;
}
.goods .menu-wrapper .menu-item:first-child.current {
  margin-top: 1px;
}



.goods .menu-wrapper .menu-item .num {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  color: white;
  background: red;
  text-align: center;
  font-size: 7px;
  line-height: 13px;
}
</style>


