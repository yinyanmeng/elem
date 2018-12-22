<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
    	<div class="content-left">
    		<div class="logo-wrapper">
    			<div class="logo" :class="{'highlight':totalCount>0}">
    				<i class="icon-shopping_cart"></i>
    			</div>
    			<div class="num" v-show="totalCount>0">{{totalCount}}</div>
    		</div>
    		<div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
    		<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
    	</div>
    	<div class="content-right" @click.stop.prevent="pay">
    		<div class="pay" :class="payClass">
    			{{payDesc}}
    		</div>
    	</div>
    </div>
    <div class="ball-container">
		 <transition name="drop" v-for="(ball, index) in balls" :key="index"  @before-enter="beforeEnter"   @enter="enter"  @after-enter="afterEnter">
			  <div v-show="ball.show" class="ball">
			   <div class="inner inner-hook" ></div>
			  </div>
		 </transition>
	</div>
	<transition name="fold">
	<div class="shopcart-list" v-show="listShow">
		<div class="list-header">
			<h1 class="title">购物车</h1>
			<span class="empty" @click="empty">清空</span>
		</div>
		<div class="list-content" ref="listContent">
			<ul>
				<li class="food" v-for="food in selectFoods">
					<span class="name">{{food.name}}</span>
					<div class="price">
						<span>￥{{food.price*food.count}}</span>
					</div>
					<div class="cartcontrol-wrapper">
						<cartcontrol :food="food"></cartcontrol>
					</div>
				</li>
			</ul>
		</div>
	</div>
    </transition>
     <transition name="fade">
    	  	<div class="list-mask" @click="hideList" v-show="listShow"></div>
     </transition> 
  </div>
  
</template>

<script>
import BScroll from 'better-scroll';
import cartcontrol from '../../components/cartcontrol/cartcontrol';

export default {
	props:{
		selectFoods:{
			type:Array,
			default() {
				return [
					{
						price: 10,
						count: 1
					}
				];
			}
		},
		deliveryPrice:{
			type: Number,
			default: 0
		},
		minPrice:{
			type:Number,
			default: 0
		}
	},
	data(){
		return {			
			balls : [
				{
					show: false
				},
				{
					show: false
				},
				{
					show: false
				},
				{
					show: false
				},
				{
					show: false
				}
			],
			dropBalls:[],
			fold:true
		}
	},
	computed:{
		totalPrice() {
			let total = 0;
			this.selectFoods.forEach((food) => {
				total += food.price * food.count;

			});
			return total;
		},
		totalCount() {
			let count = 0;
			this.selectFoods.forEach((food) => {
				count += food.count;
			})
			return count;
		},
		payDesc() {
			if(this.totalPrice === 0){
				return `￥${this.minPrice}元起送`;
			}else if(this.totalPrice < this.minPrice){
				let diff = this.minPrice - this.totalPrice;
				return `还差￥${diff}元起送`;
			}else{
				return '去结算';
			}

		},
		payClass() {
			if(this.totalPrice < this.minPrice){
				return 'not-enough';
			}else{
				return 'enough';
			}
		},
		listShow() {
			if(!this.totalCount){
				this.fold = true;
				return false;
			}
			let show = !this.fold;
			if(show) {
				this.$nextTick(() => {
					if(!this.scroll){
						this.scroll = new BScroll(this.$refs.listContent, {
							click: true
						});
					}else{
						this.scroll.refresh();
					}
					
				})
			}
			return show;
		}
	},
	methods: {
		drop(el) {			
			for(let i=0;i<this.balls.length;i++){
				let ball=this.balls[i];
				if(!ball.show){
					ball.show = true;
					ball.el=el;
					this.dropBalls.push(ball);
					return;

				}
			}
		},
		toggleList() {
			if(!this.totalCount) {
				return;
			}
			this.fold = !this.fold;
		},
		hideList() {
			this.fold = true;
		},
		empty(){
			this.selectFoods.forEach((food) => {
				food.count = 0;
			})
		},
		pay() {
			if(this.totalPrice < this.minPrice) {
				return;
			}
			window.alert(`支付${this.totalPrice}元`);

		},
		beforeEnter(el){
				 let count = this.balls.length;
				   while (count--) {
				    let ball = this.balls[count];
				    if(ball.show) {				    	
				     let rect = ball.el.getBoundingClientRect();
				     let x = rect.left - 32;
				     let y = -(window.innerHeight - rect.top - 22);				     
				     el.style.webkitTransform = `translate3d(0,${y}px,0)`;
				     el.style.transform = `translate3d(0,${y}px,0)`;
				     let inner = el.getElementsByClassName('inner-hook')[0];
				     inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
				     inner.style.transform = `translate3d(${x}px,0,0)`;
					}
				}

			},
			enter(el, done){
				/* eslint-disable no-unused-vars */
				let rf = el.offsetHeight;
				this.$nextTick(() => {
					el.style.webKitTransform = 'translate3d(0, 0, 0)';
						el.style.transform = 'translate3d(0, 0, 0)';
						let inner = el.getElementsByClassName('inner-hook')[0];
						inner.style.webkitTransform = 'translate3d(0, 0, 0)';
						inner.style.transform = 'translate3d(0, 0, 0)';
						el.addEventListener('transitionend', done) // Vue为了知道过渡的完成，必须设置相应的事件监听器。

				})

			},
			afterEnter(el){
				let ball = this.dropBalls.shift();
				if(ball){
					ball.show = false;
					el.style.display = 'none';
				}

			}

	},
	components:{
		cartcontrol
	}

};
</script>

<style scoped>
.list-mask{
	position: fixed;
	top:0;
	left:0;
	width:100%;
	height:100%;
	z-index:-2;	
	backdrop-filter:blur(10px);
	opacity:1;
	background: rgba(7, 17, 27, 0.6);
	transition:all 0.5s;
}
.fade-enter, .fade-leave { 
	opacity:0;
	background: rgba(7, 17, 27, 0);
}
.shopcart{position: fixed;left:0;bottom:0;z-index:50;width:100%; height: 48px;}
.shopcart .content{
	display: flex; background: #141d27;
}

.shopcart .ball-container .ball{
	position: fixed;
	left:32px;
	bottom:22px;
	z-index: 200;
	transition: all .6s cubic-bezier(.17,.67,.19,1.09);

}
.shopcart .ball-container .ball .inner{
	width:16px;
	height:16px;
	border-radius:50%;
	background: rgb(0, 160, 220);
	transition:all 0.4s linear;	
}
.shopcart .content .content-left{
	flex:1;
}
.shopcart .content .content-left .logo-wrapper{
	display: inline-block;
	position: relative;
	top:-10px;
	margin:0 12px;padding:6px;
	width:56px;
	height:56px;
	box-sizing: border-box;
	vertical-align: top;
	border-radius:50%;
	background: #141d27;
	vertical-align: top;
}
.shopcart .content .content-left .logo-wrapper .num{
	position: absolute;
	top:0;
	right:0;
	width:24px;
	height:16px;
	text-align:center;
	border-radius:16px;
	font-size:9px;
	font-weight: 700;
	color:#fff;
	background: rgb(240, 20, 20);
	box-shadow:0 4px 8px 0 rgba(0, 0, 0, 0.4);
}
.shopcart .content .content-left .logo-wrapper .logo{
	width:100%;height:100%;border-radius:50%; background: #2b343c; text-align:center;
}
.shopcart .content .content-left .logo-wrapper .highlight{
	background: rgb(0, 160, 220);

}
.shopcart .content .content-left .logo-wrapper .highlight .icon-shopping_cart{
	color:#fff;
}

.shopcart .content .content-left .logo-wrapper .icon-shopping_cart{
	font-size:24px;
	color:#80858a;
	line-height: 44px
}
.shopcart .content .content-left .price{
	display: inline-block;
	vertical-align: top;
	line-height: 24px;
	margin-top:12px;
	padding:0 12px 0 0;
	box-sizing:border-box;
	border-right:1px solid rgba(255, 255, 255, 0.1);
	font-size:16px;
	font-weight: 700;
	color:rgba(255, 255, 255, 0.4);
}
.shopcart .content .content-left .highlight{color:#fff;}
.shopcart .content .content-left .desc{
	display: inline-block;
	vertical-align: top;
	line-height: 24px;
	margin:12px 0 0 12px;
	color:rgba(255, 255, 255, 0.4);
	font-size:10px;
	
}

.shopcart .content .content-right{
	flex:0 0 105px;/*flex-grow放大flex-shrink缩小flex-basis本来大小*/
	width:105px;

}
.shopcart .content .content-right .pay{
	height:48px;
	line-height: 48px;
	text-align:center;
	font-size:12px;
	color:rgba(255, 255, 255, 0.4);
	font-weight: 700;
	background: #2b333b	

}
.shopcart .content .content-right .not-enough{
	background: #2b333b;
}
.shopcart .content .content-right .enough{
	background: #00b43c;
	color:#fff;
}
.shopcart .shopcart-list{
	position: absolute;
	left:0;
	top:0;
	z-index: -1;
	width:100%;transition: all 0.5s;
	transform: translate3d(0, -100%, 0);
	
	
}


.fold-enter, .fold-leave { 
	transform:translate3d(0, 0, 0);
}

.shopcart .shopcart-list .list-header{
	height:40px;
	line-height: 40px;
	padding:0 18px;
	background: #f3f5f7;
	border-bottom:1px solid rgba(7, 17, 27, 0.1);
}
.shopcart .shopcart-list .list-header .title{
	float:left;
	font-size:14px;
	color: rgb(7, 17, 27);
}
.shopcart .shopcart-list .list-header .empty{
	float:right;
	font-size:12px;
	color: rgb(0, 160, 220);
}
.shopcart .shopcart-list .list-content{
	padding:0 18px;
	max-height:217px;
	background: #fff;
	overflow: hidden;
}
.shopcart .shopcart-list .list-content:after{

}
.shopcart .shopcart-list .list-content .food{
	position: relative;
	padding:12px 0;
	box-sizing: border-box;
}
.shopcart .shopcart-list .list-content .food:after{
	display:block;
	position:absolute;
	left:0;
	bottom:0;
	width:100%;	
	content:' ';
	border-bottom:1px solid rgba(7, 17, 27, 0.1);
}
@media 
(-webkit-min-device-pixel-ratio: 1.5) { 
.shopcart .shopcart-list .list-content .food:after{
   -webkit-transform:scaleY(0.7);
transform:scaleY(0.7);}
}
@media 
(-webkit-min-device-pixel-ratio: 2) { 
.shopcart .shopcart-list .list-content .food:after{
   -webkit-transform:scaleY(0.5);
transform:scaleY(0.5);}
}
.shopcart .shopcart-list .list-content .food .name{
	line-height: 24px;
	font-size:14px;
	color:rgb(7, 17, 27);
}
.shopcart .shopcart-list .list-content .food .price{
	position: absolute;
	right:90px;
	bottom:12px;
	line-height: 24px;
	font-size:14px;
	font-weight: bold;
	color:rgb(240, 20, 20);
}
.shopcart .shopcart-list .list-content .food .cartcontrol-wrapper{
	position: absolute;
	right:0;
	bottom:6px;
}
</style>
