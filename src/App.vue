<template>
  <div id="app"> 
    <router-view/>

    <transition enter-active-class="shake"  >
      <div id="box" class="animated" v-if="newMess!=0&&isShow" @click="getmess">
          <img src="./assets/images/icon.png">
          <p class="prom">收到新消息</p>
          <span class="num" v-if="newMess!=0">{{newMess}}</span>
      </div> 
    </transition>
    <!-- <audio src="./assets/8858.wav" id="audio"></audio> -->

  </div>
</template>

<script> 
import { getAES, getDAes } from '@/assets/js/crypto.js';
import Qs from 'qs';
import {mapState,mapGetters,mapMutations,mapActions} from "vuex";
import getDate from '@/assets/js/timestamp.js'; 
import mixin from '@/scripts/mixin.js';
export default {
  name: 'App', 
  mixins:[mixin],
  data () {
    return { 
      websock: null,
      // newMess:0,
      isShow:false, 
      sound:"",
    }
  },
  computed:{
    ...mapState(["users","currentChatCon","hasChat","KF","newMess","isSouce"]),
  }, 
  // created(){
  //   this.http.get("http://xycshop.dstlkj.com/ChatApi/get_kf")
  //   .then(res=>{ 
  //     if(res.data.code==1001){ 
  //       console.log(res.data.result)
  //       var KFdata = res.data.result;
  //       if(KFdata.picture==null||KFdata.picture==''){
  //         KFdata.picture = 'https://xycha.oss-cn-hangzhou.aliyuncs.com/dme.png'
  //       }   
  //       this.$store.commit('setKF', KFdata)   
  //       this.initWebSocket();//页面刚进入时开启长连接
  //       this.getData();  //获取数据
  //     } 
  //   }); 
  // },
  mounted(){
        this.$store.commit('setKF', {
          shop_idenfier:"0100010020",
          id:"46",
          account:"xia",
          name:"xiaxia",
          picture:"https://xycha.oss-cn-hangzhou.aliyuncs.com/dme.png"
        }) 
        this.initWebSocket();//页面刚进入时开启长连接  
        this.getData(); //获取数据
  }, 
  destroyed(){
    this.websocketClose();//页面销毁时关闭长连接
  },
  methods:{
    getData(){
      const users_storage = JSON.parse(sessionStorage.getItem("users"));
        // console.log(users_storage)
        if(users_storage){
          this.$store.commit('setUsers', users_storage)
        }else{
          // console.log("nnn")
          this.http.get("https://nxyc.dstlkj.com/Chatwith/web_new_record_list",{ 
            params:{
                data:getAES(JSON.stringify({
                    shop_identifier:this.KF.shop_idenfier,
                    user_id:this.KF.id
                }) ) } 
          }).then(res=>{   
              var dataObj = JSON.parse(getDAes(res.data.data)).data;  
              // console.log(dataObj)
              var ids = [];
              dataObj.forEach((e,i)=>{
                e.chatCon = [];
                e.unread = 0;
                e.isopenDialog = false;
                var index = ids.indexOf(e.id);
                if(index <= -1){
                  ids.push(e.id);
                  this.users.push({
                    name:e.name,
                    list:[e]
                  })
                }else{
                  this.users[index].list.push(e);
                }     
              })
              // console.log(ids); 
              // console.log(this.users) 
          })  
        }; 
        const newMess_storage = JSON.parse(sessionStorage.getItem("newMess")); 
        if(newMess_storage){
          this.$store.commit('initNewmess', newMess_storage);
          this.isShow = true;
        };
    },
    initWebSocket(){//初始化websocket 
      this.websock = new WebSocket("ws://nxyc.dstlkj.com:8787");
      this.websock.onopen = this.websocketOpen;
      this.websock.onerror = this.websocketError;
      this.websock.onmessage = this.websocketMessage;
      // this.websock.onclose = this.websocketClose;
    },
    websocketOpen(){
      console.log("连接成功");  
    },
    websocketError(e){
      console.log("连接发生错误");
    },
    websocketMessage(m){ //数据接收 
      console.log(m.data)
      var msg = eval("("+m.data+")");  
      var type = msg.type || ""; 

      switch(type){
        case "init":    
          this.http({
            method:"post",
            url:"https://nxyc.dstlkj.com/Chatwith/bind", 
            transformRequest: [function (data) {
              // 对 data 进行任意转换处理
              return Qs.stringify(data)
            }], 
            data:{data:getAES(JSON.stringify({
              user_id:this.KF.account,
              client_id:msg.client_id,
              shop_identifier:this.shop_identifier
            }))}
          })
          break;
        case 1||2||3:  
          var msg = JSON.parse(m.data);
          // console.log(msg);           
          //是否有声音提示
          if(this.isSouce){  
            this.sound = new Audio(); 
            this.sound.src = '../static/8858.wav'; 
            // this.sound.src = '/Public/static/8858.wav';  
            this.sound.play();
          } 
          //合并所有用户并查询是哪个用户下的消息
          var allUserList=[];
          this.users.forEach((e,i)=>{
            allUserList = allUserList.concat(e.list)
          })
          // console.log(allUserList);
           allUserList.forEach((e,i)=>{
              if(e.user_id==msg.user_id&&e.username==msg.user_name){ 
                if(e.isopenDialog){ 
                  this.currentChatCon.push(JSON.parse(m.data));
                } else{ 
                  e.chatCon.push(msg);
                  e.unread++;
                  //显示消息提醒 
                  this.$store.commit("setNewmess"); 
                  this.isShow = true;
                } 
              }    
              //加入最近聊天记录
              if(e.chatCon.length!=0&&this.hasChat.indexOf(e)==-1){ 
                // console.log(this.hasChat)
                this.hasChat.unshift(e); 
              } 
              if(e.user_id==msg.user_id&&e.username==msg.user_name&&this.hasChat.indexOf(e)>0){
                var hasChatNew = this.hasChat.splice(this.hasChat.indexOf(e),1);
                // console.log(hasChatNew)
                this.hasChat.unshift(hasChatNew[0])
              }
            });
             
            sessionStorage.setItem("users",JSON.stringify(this.users)); 
            sessionStorage.setItem("newMess",this.newMess); 
           
          break; 
        default:
          // console.log(m.data); 
      }
   },
 
    websocketClose(e){
      // console.log("connection closed ("+e.code+")");
      console.log("断开连接");
    },
    getmess(){
      this.isShow = false;  
    }
  }, 
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} 
#box{
    /* width: 182px; */
    height: 52px;
    box-shadow: 0 0 40px 0 #bbb;
    border: 1px solid #ddd;
    background-color: #f5f5f5;
    position: fixed;
    left: 46%;
    bottom: 0;
    box-sizing: border-box;
    padding: 8px 30px 8px 20px ;
    display: flex;
    align-items: center;
    cursor: pointer;
    /* display: none; */
}
#box img{
    width: 40px;
    border-radius: 50%;
    margin-right: 10px;
    resize: none;
}
.prom{
    font-size: 16px;
    user-select:none;
    /* 修改 */
    margin-top: 15px;
}
.num{
    display: inline-block; 
    padding: 1px 6px 0px;
    background-color: rgb(197, 14, 14);
    border-radius: 50%;
    position: absolute;
    top: 2px;
    right: 2px;
    color: #f5f5f5;
    text-align: center;
}
 
</style>
