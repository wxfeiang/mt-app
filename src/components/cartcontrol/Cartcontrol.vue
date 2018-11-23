<template>
   
    <div class="cartcontrol">
        <!-- 减号的动画效果-->
        <transition name="move">
             <div class="cart-decrease icon-remove_circle_outline" @click="decreaseCart" v-show="food.count" > 
        </div>
        
        </transition>
       
        <div class="cart-count" v-show="food.count">{{food.count}}</div>
        <div 
            class="cart-add icon-add_circle"  @click.stop.prevent="increaseCart">
            <i class="bg"></i>
            <!-- 点击加号 阻止事件冒泡 -->
        </div>
	</div>
</template>
<script>
import Vue from "vue"; // 为了使用自定义的属性

export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    decreaseCart() {
      //  自定义了一个起始 值
      this.food.count--;
    },
    increaseCart() {
        //  在滚动的方法下激活 此方法
      if (!this.food.count) {
        Vue.set(this.food, "count", 1);  //  不存在的 添加key 和值  往数据里
      } else {
        this.food.count++;
      }
      
    }
  }
};
</script>
<style >
.cartcontrol {
  font-size: 0;
}

.cartcontrol .cart-decrease {
  display: inline-block;
  width: 26px;
  height: 26px;
  font-size: 26px;
  color: #b4b4b4;
}

.cartcontrol .cart-add .bg {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  position: absolute;
  left: 3px;
  top: 3px;
  z-index: -1;
}

.cartcontrol .cart-count {
  display: inline-block;
  width: 25px;
  text-align: center;
  font-size: 12px;
  line-height: 26px;
  vertical-align: top;
}

.cartcontrol .cart-add {
  display: inline-block;
  width: 26px;
  height: 26px;
  font-size: 26px;
  color: #ffd161;
  position: relative;
}
/* 效果  */
.move-enter-active,
.move-leave-active {
  transition: all 0.25s linear;
}
.move-enter,
.move-leave-to {
  transform: translateX(20px) rotate(180deg);
}
</style>


