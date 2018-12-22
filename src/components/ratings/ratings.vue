<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
    	<div class="overview">
    		<div class="overview-left">
    			<h1 class="score">{{seller.score}}</h1>
    			<div class="title">综合评分</div>
    			<div class="rank">高于周边商家{{seller.rankRate}}</div>
    		</div>
    		<div class="overview-right">
    			<div class="score-wrapper">
    				<span class="title">服务态度</span>
    				<star :size="36" :score="seller.serviceScore"></star>
    				<span class="score">{{seller.serviceScore}}</span>
    			</div>
    			<div class="score-wrapper">
    				<span class="title">商家评分</span>
    				<star :size="36" :score="seller.foodScore"></star>
    				<span class="score">{{seller.foodScore}}</span>
    			</div>
    			<div class="delivery-wrapper">
    				<span class="title">送达时间</span>
    				<span class="delivery">{{seller.deliveryTime}}分钟</span>
    			</div>
    		</div>
    	</div>
    	<split></split>
    	<ratingselect  @onlycontentChange="changeOnlycontent" @selectchange="changeSelect" :select-type="selectType" :only-content="onlyContent" 
	    	:ratings="ratings"></ratingselect>
	    <div class="rating-wrapper">
	    	<ul>
	    		<li v-for="rating in ratings" v-show="needShow(rating.rateType,rating.text)" class="rating-item">
	    			<div class="avatar">
	    				<img :src="rating.avatar" width="28" height="28">
	    			</div>
	    			<div class="content">
	    				<h1 class="name">{{rating.username}}</h1>
	    				<div class="star-wrapper">
	    					<star :size="24" :score="rating.score"></star>
	    					<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span> 
	    				</div>
	    				<p class="text">{{rating.text}}</p>
	    				<div class="recommend" v-show="rating.recommend.length">
	    					<span class="icon-thumb_up"></span>
	    					<span class="item" v-for="item in rating.recommend">{{item}}</span>
	    				</div>
	    				<div class="time">{{rating.rateTime | formatDate}}</div>
	    			</div>
	    			
	    		</li>
	    	</ul>
	    </div>
    </div>
  </div>
</template>

<script>
import BScroll from  'better-scroll';
import star from '../../components/star/star';
import split from '../../components/split/split';
import ratingselect from '../../components/ratingselect/ratingselect';
import {formatDate} from '../../common/js/date';
const ALL = 2;
const ERR_OK = 0;
export default {
	props: {
		seller:{
			type: Object
		}
	},
	data() {
		return {
			ratings: [],
			showFlag: false,
			selectType:ALL,
			onlyContent:true
		};
	},
	created() {
		this.$http.get('/api/ratings').then( response => {
			response = response.body;
			if(response.errno === ERR_OK){
				this.ratings = response.data;
				this.$nextTick(() => {
					this.scroll = new BScroll(this.$refs.ratings,{
						click:true
					})
				})
				
			}
		})

	},
	methods: {
		show() {
			this.showFlag = true;
			this.selectType = ALL;
			this.onlyContent = false;
			this.$nextTick(() => {
				if(!this.scroll){
					this.scroll = new BScroll(this.$refs.food,{
						click: true
					})
				}else{
					this.scroll.refresh();
				}
			})
		},
		hide() {
			this.showFlag = false
		},
		addFirst(event) {			
			if(!event._constructed){
				return;
			}
			
			this.$emit('cart-add', event.target);
			Vue.set(this.food, 'count' ,1);


		},
		changeSelect(val){
			this.selectType=val;
			/*this.$nextTick(() => {
				this.scroll.refresh();
			})*/
			
		},
		changeOnlycontent(val){
			this.onlyContent=val;
			/*this.$nextTick(() => {
				this.scroll.refresh();
			})*/
		},
		needShow(type, text) {
			if(this.onlyContent && !text){
				return false;
			}
			if(this.selectType === ALL){
				return true;
			}else{
				return type === this.selectType;
			}
		}

	},	
	filters:{
		formatDate(time){
			let date = new Date(time);
			return formatDate(date, 'yyyy-MM-dd hh:mm');
		}
	},
	components: {
		star,
		split,
		ratingselect
	}
}

</script>

<style scoped>
.ratings{
	position:absolute;
	top:174px;
	bottom:0;
	left:0;
	width:100%;
	overflow: hidden
}
.ratings .overview{
	display:flex;
	padding:18px 0;

}
.ratings .rating-wrapper{
	padding:0 18px;
}
.ratings .rating-wrapper .rating-item{
	display: flex;
	padding:18px 0;
	
}
.ratings .rating-wrapper .rating-item:after{
display:block;
position:absolute;
left:0;
bottom:0;
width:100%;
border-top:1px solid rgba(7, 17, 27, 0.1);
content:' ';
}
@media 
(-webkit-min-device-pixel-ratio: 1.5) { 
.ratings .rating-wrapper .rating-item:after{
   -webkit-transform:scaleY(0.7);
transform:scaleY(0.7);}
}
@media 
(-webkit-min-device-pixel-ratio: 2) { 
.ratings .rating-wrapper .rating-item:after{
   -webkit-transform:scaleY(0.5);
transform:scaleY(0.5);}
}
.ratings .rating-wrapper .rating-item .avatar{
	flex:0 0 28px;
	width:28px;
	margin-right:12px;
}
.ratings .rating-wrapper .rating-item .avatar img{
	border-radius:50%;
}
.ratings .rating-wrapper .rating-item .content{
	position: relative;
	flex:1;

}
.ratings .rating-wrapper .rating-item .content .time{
	position: absolute;top:0;right:12px;
	font-size:10px;
	color:rgb(147, 153, 159);
}
.ratings .rating-wrapper .rating-item .content .name{
	line-height: 12px;
	font-size:10px;
	margin-bottom:4px;
	color:rgb(7, 17, 27);
}
.ratings .rating-wrapper .rating-item .content .star-wrapper{
	margin-bottom:6px;
	
}
.ratings .rating-wrapper .rating-item .content .star-wrapper .star{
	display: inline-block;
	margin-right:6px;
	vertical-align: top
}
.ratings .rating-wrapper .rating-item .content .star-wrapper .delivery{
	display: inline-block;font-size:10px;
	
	color:rgb(147, 153, 159);
}
.ratings .rating-wrapper .rating-item .content .text{
	line-height: 18px;
	margin-bottom:8px;
	color:rgb(7, 17, 27);
	font-size:12px;
}
.ratings .rating-wrapper .rating-item .content .recommend{
	line-height: 16px;
	font-size: 0
}
.ratings .rating-wrapper .rating-item .content .recommend .icon-thumb_up, .ratings .rating-wrapper .rating-item .content .recommend .item{
	display: inline-block;
	margin:0 8px 4px 0;
	font-size: 9px;

}
.ratings .rating-wrapper .rating-item .content .recommend .icon-thumb_up{
	color:rgb(0, 160, 220);
}
.ratings .rating-wrapper .rating-item .content .recommend .item{
	padding:0 6px;
	border:1px solid rgba(7, 17, 27, 0.5);
	border-radius:1px;
	color:rgb(147, 153, 159);
	background: #fff
}
.ratings .overview-left{
	flex:0 0 137px;
	width:137px;
	border-right:1px solid rgb(7, 17, 27, .2);
	text-align:center;
	padding:6px 0;
}
@media only screen and (max-width: 320px){
	.ratings .overview-left{
		flex: 0 0 120px;
	width:120px;
	}
	
}
.ratings .overview-left .score{
	line-height: 28px;
	font-size:24px;
	color:rgb(255, 153, 0);
	margin-bottom:6px;
}
.ratings .overview-left .title{
	margin-bottom:8px;
	line-height: 12px;
	font-size:12px;
	color:rgb(7, 17, 27);

}
.ratings .overview-left .rank{
	line-height: 10px;
	font-size:10px;
	color:rgb(147, 153, 159);

}
.ratings .overview-right{
	flex:1;
	padding:6px 0 6px 24px;

}
@media only screen and (max-width:320px){
	.ratings .overview-right{
		padding-left:6px;
	}
	
}

.ratings .overview-right .score-wrapper{
	margin-bottom:8px;
	line-height: 18px;
	font-size:0;
}
.ratings .overview-right .score-wrapper .title{
	font-size:12px;
	color:rgb(7, 17, 27);
	display: inline-block;
	vertical-align: top;
	line-height: 18px;

}
.ratings .overview-right .score-wrapper .star{
display: inline-block;
	vertical-align: top;
	margin:0 12px;
}
.ratings .overview-right .score-wrapper .score{
	display: inline-block;
	vertical-align: top;
	font-size:12px;
	line-height: 18px;
	color:rgb(255, 153, 0);

}
.ratings .overview-right .delivery-wrapper{	
	font-size:0;
}
.ratings .overview-right .delivery-wrapper .title{
	font-size:12px;
	color:rgb(7, 17, 27);	
	line-height: 18px;

}
.ratings .overview-right .delivery-wrapper .delivery{
	font-size:12px;
	color:rgb(147, 153, 159);	
	line-height: 18px;margin:0 12px;

}

</style>
