<template>
  <div class="appheader">
    <div class="content-wrapper">
    	<div class="avatar">
    		<img width="64" height="64" :src="seller.avatar">
    	</div>
    	<div class="content">
    		<div class="title">
    			<span class="brand"></span>
    			<span class="name">{{seller.name}}</span>
    		</div>  
    		<div class="description">
    			{{seller.description}}/{{seller.deliveryTime}}分钟送达
    		</div> 
    		<div v-if="seller.supports" class="support">
    			<span class="icon" :class="classMap[seller.supports[0].type]"></span>
    			<span class="text">{{seller.supports[0].description}}</span>
    		</div>		
    	</div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个&nbsp;</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="righticon">></i>
    </div>
    <div class="top-bg">
    	<img :src="seller.avatar">
    </div>
    <transition name="fade">
    <div v-show="detailShow" class="detail">
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class="popup-title">{{seller.name}}</h1>
          <div class="star-wraaper">
            <star :size="48" :score="seller.score"></star>
          </div>   
          <div class="discout-title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div> 
          <ul v-if="seller.supports" class="supports">
            <li class="support-item" v-for="(item,index) in seller.supports">
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
          <div class="discout-title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>   
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>    
        </div>
      </div>
      <div class="detail-close" @click="hideDetail">
        <i class="icon-close"></i>        
      </div>
    </div>
    </transition>
  </div>
</template>


<script type="text/ecmascript-6">
import star from '../../components/star/star.vue';

	export default {		
		props:{
			seller:{
				type:Object
			}
		},
		data(){
			return {
				detailShow:false
			}
		},
		methods: {
			showDetail(){
				this.detailShow = true;
			},
      hideDetail(){
        this.detailShow = false;
      }
		},
		created(){
			this.classMap = ['decrease','discount','special','invoice','guarantee']
		},
    components:{
     star
    }
	}
</script>

<style scoped>
/* @import "../../common/stylus/mixin"; */

.appheader{
	color:#fff; position: relative;background:rgba(7, 17, 27, 0.5); overflow: hidden;
}
.content-wrapper{padding:24px 12px 18px 24px;font-size:0; position: relative;}
.avatar{display: inline-block;vertical-align: top}
.avatar img{border-radius:2px;}
.content{display: inline-block;font-size:14px;margin-left:16px;}
.title{margin:2px 0 8px 0;}
.brand{width:30px; height: 18px;display: inline-block;
background-image: url('brand@2x.png');vertical-align: top;
background-size:30px 18px;background-repeat: no-repeat;
}
@media 
(-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio:3) { 
  .brand{
  background-image: url('brand@3x.png');}
}
.name{margin-left:6px;font-size:16px;line-height: 18px;font-weight: bold;}
.description{margin-bottom:10px; line-height: 12px;font-size:12px;}
.support .icon{display: inline-block;width:12px;
  height:12px;margin-right:4px;background-size:12px 12px;
background-repeat:no-repeat;vertical-align: top;

}
.support .text{vertical-align: top; line-height:12px;font-size:10px;}
.support .decrease{background-image: url('decrease_1@2x.png');}
.support .discount{background-image: url('discount_1@2x.png');}
.support .guarantee{background-image: url('guarantee_1@2x.png');}
.support .invoice{background-image: url('invoice_1@2x.png');}
.support .special{background-image: url('special_1@2x.png');}
@media 
(-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio:3) { 
.support .decrease{background-image: url('decrease_1@3x.png');}
.support .discount{background-image: url('discount_1@3x.png');}
.support .guarantee{background-image: url('guarantee_1@3x.png');}
.support .invoice{background-image: url('invoice_1@3x.png');}
.support .special{background-image: url('special_1@3x.png');}
}
.support-count{ position: absolute;right:12px;bottom:18px; 
padding:0 8px;height:24px; line-height: 24px;border-radius:14px;
background:rgba(0,0,0,0.2); 
text-align: center;
}
.count{font-size:10px;font-style: normal;}
.icon-keyboard_arrow_right{font-size:10px;line-height: 24px;font-style: normal;
}
.bulletin-wrapper{height:28px; line-height: 28px;padding:0 22px 0 12px;
 white-space: nowrap;overflow: hidden;text-overflow: ellipsis; position: relative;
}
.bulletin-title{display: inline-block;width:22px; height: 12px;background-image: url('bulletin@2x.png'); background-size: 22px 12px;background-repeat: no-repeat;}
@media 
(-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio:3) { 
 .bulletin-title{background-image: url('bulletin@3x.png');vertical-align: top;margin-top:8px;}
}
.bulletin-text{font-size:10px;margin:0 4px ; vertical-align: top;}
.righticon{ position: absolute;font-size:10px; right:12px;top:0px; font-style: normal;}
.top-bg{ position: absolute;top:0;left:0;width:100%;height:100%;z-index: -1;
filter: blur(10px);
 }
 .top-bg img{object-fit: cover;width:100%; height: 100%;}
 .detail{
 	position: fixed;
 	z-index:100;
 	top:0;
 	left:0;
 	width:100%;
 	height:100%;
 	overflow: auto;
  transition:all 0.5s; 
  background:rgba(7,17,27,0.8);	
  backdrop-filter:blur(10px);
 } 
.fade-enter, .fade-leave{
       opacity:0;
  background:rgba(7,17,27,0);
}
 /*弹框*/
 .clearfix{
  display: inline-block;
}
.clearfix:after{
  display: block;
  content: '.';
  height:0;
  line-height: 0;
  clear:both;
  visibility:hidden;
}
.detail-wrapper{
  width:100%;
  min-height: 100%;
 }
 .detail-main{
  margin-top: 64px;
  padding-bottom:64px;
 }
.detail-close{
  position: relative;
  width:32px;
  height:32px;
  margin:-64px auto 0 auto;
  clear:both;
  font-size:32px;  
}
.popup-title{ line-height: 16px; text-align:center;font-size:16px;font-weight: 700 }
.star-wraaper{
  margin-top:18px;padding:2px 0; text-align:center;
}
.discout-title{
  display:flex;
  width:80%;
  margin:28px auto 24px auto;
}
.discout-title .line{
  flex:1;
  position: relative;
  top:-6px;
  border-bottom:1px solid rgba(255, 255, 255, 0.2);
}
.discout-title .text{
  font-size: 14px;
  padding:0 12px;
  font-weight:700;
}
.supports{
  width:80%;
  margin:0 auto;
}
.supports .support-item{
  padding:0 12px;
  margin-bottom:12px;
  
}
.supports .support-item:last-child{
  margin-bottom:0;
}
.supports .support-item .icon{
  display: inline-block;
  width:16px;
  height:16px;
  vertical-align: middle;
  margin-right:6px;
  background-size: 16px 16px;
  background-repeat: no-repeat;
}
.supports .support-item .decrease{background-image: url('decrease_2@2x.png');}
.supports .support-item .discount{background-image: url('discount_2@2x.png');}
.supports .support-item .guarantee{background-image: url('guarantee_2@2x.png');}
.supports .support-item .invoice{background-image: url('invoice_2@2x.png');}
.supports .support-item .special{background-image: url('special_2@2x.png');}
@media 
(-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio:3) { 
.supports .support-item .decrease{background-image: url('decrease_2@3x.png');}
.supports .support-item .discount{background-image: url('discount_2@3x.png');}
.supports .support-item .guarantee{background-image: url('guarantee_2@3x.png');}
.supports .support-item .invoice{background-image: url('invoice_2@3x.png');}
.supports .support-item .special{background-image: url('special_2@3x.png');}
}
.supports .support-item .text{
  line-height: 12px;
  font-size:12px;
}
.bulletin{
  width:80%;
  margin:0 auto;
}
.bulletin .content{ 
  line-height: 24px;
  font-size:12px;
}

</style>