<template>
	<div class="goods">
		 <div class="menu-wrapper"  ref="menu">
		 	<ul>
		 		<li v-for="(item,$index) in goods" class="menu-item" :class="{'current':currentIndex===$index}"  @click="selectMenu($index,$event)">
		 			<span class="text">
				 		<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
				 		{{item.name}}
				 	</span>
		 		</li>
		 	</ul>
		 </div>
		 <div class="foods-wrapper" ref="foodsWrapper">
		 	<ul>
		 		<li v-for="item in goods" class="food-list food-list-hook">
		 			<h1 class="title">{{item.name}}</h1>
		 			<ul>
		 				<li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item">
		 					<div class="icon">
		 						<img width="57" height="57" :src="food.icon" alt="">
		 					</div>
		 					<div class="content">
		 						<h2 class="name">{{food.name}}</h2>
		 						<p class="desc">{{food.description}}</p>
		 						<div class="extra">
		 							<span class="count">月售{{food.sellCount}}份</span>
		 							<span>好评率{{food.rating}}%</span>
		 						</div>
		 						<div class="price">
		 							<span class="now">￥{{food.price}}</span>
		 							<span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
		 						</div>
		 						<div class="cartcontrol-wrapper">
		 							<cartcontrol :food="food" v-on:cart-add="cartAdd"></cartcontrol>
		 						</div>
		 					</div>
		 				</li>
		 			</ul>
		 		</li>
		 	</ul>
		 </div>
		 <shopcart ref="shopcart"  :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
		 <food :food="selectedFood" ref="food"></food>
	</div>
	
</template>

<script>
import BScroll from 'better-scroll';
import shopcart from '../../components/shopcart/shopcart';
import cartcontrol from '../../components/cartcontrol/cartcontrol';
import food from '../../components/food/food';

const ERR_OK = 0;

export default {
	props:{
		seller:{
			type: Object
		}
	},
	data(){
		return{
			goods: [],
			listHeight: [],
			scrollY: 0,
			selectedFood: {}
		}
	},
	computed:{
		currentIndex(){
			for(let i=0;i<this.listHeight.length;i++){
				let height1 = this.listHeight[i];				
				let height2 = this.listHeight[i+1];	
				if(!height2 || (this.scrollY>=height1 && this.scrollY<height2)){
					return i;					
				}
			}
			return 0;
		},
		selectFoods() {
			let foods = [];
			this.goods.forEach((good)=>{
				good.foods.forEach((food) => {
					if(food.count){
						foods.push(food);
					}
				})
			});
			return foods;
		}
	},
	created(){
		this.classMap = ['decrease','discount','special','invoice','guarantee'];
		
		this.$http.get('/api/goods').then(response => {
			response = response.body;
			if(response.errno === ERR_OK){
				this.goods = response.data;	
				this.$nextTick(() => {					
					this._initScroll();	
					this._calculateHeight();
				});						
			}
		});
	},
	methods: {
		cartAdd(el) {			
			//dom元素更新后执行，因些此处能正确打印出更改之后的值;
			this.$nextTick(() => {				
				//调用shopcart组件的drop()函数
				this.$refs.shopcart.drop(el);
			})

		},
		selectMenu(index, event){
			//判断是否为PC端的话就返回，不做click:true的设置，以免触发两次点击事件
			if(!event._constructed){
				return;
			}
			//console.log(index);
			let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
			let el = foodList[index];
			this.foodsScroll.scrollToElement(el,300);
			//console.log(index);

		},
		selectFood(food, event) {
			if(!event._constructed){
				return;
			}
			this.selectedFood = food;
			this.$refs.food.show();//调用子组件的方法

		},		
		_initScroll(){
			this.menuScroll = new BScroll(this.$refs.menu, {
				click:true
			});
			this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
				click:true,
				probeType:3
			});			
			this.foodsScroll.on('scroll', (pos) => {				
				this.scrollY = Math.abs(Math.round(pos.y));
				//console.log(this.scrollY);

			})
		},
		_calculateHeight(){
			//console.log(this);
			let foodlist = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
			let height = 0;
			this.listHeight.push(height);
			for(let i=0;i<foodlist.length;i++){
				let item = foodlist[i];				
				height+=item.clientHeight;
				this.listHeight.push(height);
			}

		}
	},
	components:{
		shopcart,
		cartcontrol,
		food
	}
}
</script>

<style  scoped>
/* @import "../../common/css/mixin.css" */

.goods{
	position: absolute;
	width:100%;
	top:174px;
	bottom:46px;
	display: flex;
	overflow: hidden;
}
.goods .menu-wrapper{
flex:0 0 80px;/*
flex-grow　　项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
flex-shrink　　项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
flex-basis　　在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。
*/
width:80px;
background: #f3f5f7;
}
.goods .foods-wrapper{
	flex:1;
}
.menu-wrapper .menu-item{
	display: table;
	height:54px;
	width:56px;
	line-height: 14px; position: relative;padding:0 12px;
}
.menu-wrapper .current{
	position: relative;
	margin-top:-1px;
	z-index: 10;
	background: #fff;
	font-weight: 700;
	
}

.menu-wrapper .menu-item .icon{
	 display: inline-block;
  width:12px;
  height:12px;
  vertical-align: middle;
  margin-right:2px;
  background-size: 12px 12px;
  background-repeat: no-repeat;

}
.menu-wrapper .menu-item .decrease{background-image: url('decrease_3@2x.png');}
.menu-wrapper .menu-item .discount{background-image: url('discount_3@2x.png');}
.menu-wrapper .menu-item .guarantee{background-image: url('guarantee_3@2x.png');}
.menu-wrapper .menu-item .invoice{background-image: url('invoice_3@2x.png');}
.menu-wrapper .menu-item .special{background-image: url('special_3@2x.png');}
@media 
(-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio:3) { 
.menu-wrapper .menu-item .decrease{background-image: url('decrease_3@3x.png');}
.menu-wrapper .menu-item .discount{background-image: url('discount_3@3x.png');}
.menu-wrapper .menu-item .guarantee{background-image: url('guarantee_3@3x.png');}
.menu-wrapper .menu-item .invoice{background-image: url('invoice_3@3x.png');}
.menu-wrapper .menu-item .special{background-image: url('special_3@3x.png');}
}
.menu-wrapper .menu-item .text{
	font-size:12px;
	display: table-cell;
	width:56px;
	vertical-align: middle;	
}
.menu-wrapper .menu-item:after{
display:block;
position:absolute;
left:0;
bottom:0;
width:100%;
border-top:1px solid rgba(7,17,27,0.1);
content:' ';
}
@media 
(-webkit-min-device-pixel-ratio: 1.5) { 
.menu-wrapper .menu-item:after{
   -webkit-transform:scaleY(0.7);
transform:scaleY(0.7);}
}
@media 
(-webkit-min-device-pixel-ratio: 2) { 
.menu-wrapper .menu-item:after{
   -webkit-transform:scaleY(0.5);
transform:scaleY(0.5);}
}
.menu-wrapper .current:after{
	border:none;
}
.foods-wrapper{
	flex:1;
}
.foods-wrapper .title{
	padding-left:14px;
	height: 26px;
	line-height: 26px;
	border-left:2px solid #d9dde1;
	font-size:12px;
	color:rgb(147, 153, 159);
	background: #f3f5f7;
}
.foods-wrapper .food-item{
	display: flex;
	margin:18px;
	padding-bottom:18px;
	position: relative;
}
.foods-wrapper .food-item:last-child{
	border:none;
	margin-bottom:0;
}
.foods-wrapper .food-item:after{
display:block;
position:absolute;
left:0;
bottom:0;
width:100%;
border-top:1px solid rgba(7,17,27,0.1);
content:' ';
}
@media 
(-webkit-min-device-pixel-ratio: 1.5) { 
.foods-wrapper .food-item:after{
   -webkit-transform:scaleY(0.7);
transform:scaleY(0.7);}
}
@media 
(-webkit-min-device-pixel-ratio: 2) { 
.foods-wrapper .food-item:after{
   -webkit-transform:scaleY(0.5);
transform:scaleY(0.5);}
}
.foods-wrapper .food-item .icon{
	flex:0 0 57px;
	margin-right:10px;
}
.foods-wrapper .food-item .content{
	flex:1;

}
.foods-wrapper .food-item .content .name{
	margin:2px 0 8px 0;
	height:14px;
	line-height: 14px;
	font-size:14px;
	color:rgb(7, 17, 27);	
}
.foods-wrapper .food-item .content .desc, 
.foods-wrapper .food-item .content .extra{	
	line-height: 10px;
	font-size:10px;
	color:rgb(147, 153, 159);
}
.foods-wrapper .food-item .content .desc{
	margin-bottom:8px;
	line-height: 12px;
}
.foods-wrapper .food-item .content .extra .count{
	margin-right:12px;
}
.foods-wrapper .food-item .content .cartcontrol-wrapper{
	position: absolute;
	right:0;
	bottom: 12px;

}
.foods-wrapper .food-item .content .price{
	font-weight: 700;
	line-height: 24px;
}
.foods-wrapper .food-item .content .price .now{
	margin-right:8px;
	font-size: 14px;
	color:rgb(240, 20, 20);
}
.foods-wrapper .food-item .content .price .old{
	text-decoration: line-through;
	font-size: 10px;
	color:rgb(147, 153, 159);
}
</style>
