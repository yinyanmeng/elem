<template>
  <div id="app">
    <appheader :seller="seller"></appheader>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 缓存 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import {urlParse} from './common/js/util';
import appheader from './components/appheader/appheader.vue';

const ERR_OK = 0;

export default{
  data(){
    return {
      seller: {
        id:(() => {
          let queryParam = urlParse();
          console.log(queryParam);
          return queryParam.goods_id;
        })()
      }
    };
  },
  created(){
    // GET /someUrl
    this.$http.get('/api/seller?id='+this.seller.id).then(response => {
      response = response.body;
      console.log(response);
      if(response.errno === ERR_OK){
       /* this.seller = response.data;*/
        this.seller=Object.assign({} ,this.seller ,response.data);
        console.log(this.seller.id);
      }
    }, response => {
      // error callback
    });
  },
  name: 'App',  
  components:{
   appheader
  }
}

</script>

<style>
/* #app .tab{ 
  display: flex;
  width:100%;
  height:40px;
  line-height: 40px;
  border-bottom:1px solid rgba(7,17,27,0.1);
} */
#app .tab{
  display: flex;
  width:100%;
  height:40px;
  line-height: 40px; 
  position: relative;
}
#app .tab .tab-item{
  flex:1;
  text-align: center;
}
#app .tab .tab-item a{
  display: block;
  font-size:14px;
  color:rgb(77, 85, 93);
}
#app .tab .tab-item a.active{color:rgb(240, 20, 20);}

#app .tab:after{
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
#app .tab:after{
   -webkit-transform:scaleY(0.7);
transform:scaleY(0.7);}
}
@media 
(-webkit-min-device-pixel-ratio: 2) { 
#app .tab:after{
   -webkit-transform:scaleY(0.5);
transform:scaleY(0.5);}
}
</style>
