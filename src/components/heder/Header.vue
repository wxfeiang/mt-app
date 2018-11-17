<template>
    <div class="header">
      {{poiInfo.name}}
    </div>
</template>
<script>
export default {
    props :{
        //接收 属性传值
        poiInfo :{
            type: Object,
            default:{

            }
        }
    }
}
</script>
