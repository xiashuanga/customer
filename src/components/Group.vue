<template>
    <div class="root-list">
        <header>
            <div id="top">
                <span class="customer">{{KF.name}}</span>
                <i class="iconfont icon-cuohao" style="cursor: pointer;" @click="closeList"></i>
            </div>
            <input type="text" id="intro" 
                placeholder="编辑签名"
                v-model="intro" 
                @focus="introFocus"
                @blur="introBlur"
                :class="{active:isActive}"
            > 
        </header>
        <div class="tab"> 
            <div class="tabitem" 
                v-for="(tab,i) in tabsName" 
                :key="i"
                :class="{borderbottom:tab.isBorderActive}"
                @click="tabsSwitch(i)"
            >
                <span :class="tab.name"></span>
            </div>

        </div> 
        <div class="contain">
            <div class="tab-card" v-show="tabIndex==0">
                <div class="peo"  style="display: block;">
                    <GroupList 
                        v-for="(u,i) in users"
                        :key="i"
                        :group="u"
                    ></GroupList>                     
                </div>
            </div> 
            <div class="tab-card" v-show="tabIndex==1"> 
                <ul class="tit-list">
                    <li v-for="(h,i) in hasChat" :key="i" @click="openhasChat(i)"> 
                        <img class="avatar " v-if="h.hold" :src="h.hold"> 
                        <img class="avatar" v-else src="../assets/images/timg.jpg"> 
                        <span class="account">{{h.username}}</span>
                        <span class="num" v-if="h.unread!=0">{{h.unread}}</span>
                    </li> 
                </ul>
                
            </div>
            <!-- <div class="tab-card" v-show="tabIndex==2">333</div> -->
        </div>

        <Dialog v-if="leftDiaShow" ></Dialog>
        <Dialog v-if="rightDiaShow" ></Dialog>
        
            <!-- <i class="foot iconfont icon-sousuo"></i>  -->
        <footer>
            <!-- <i class="foot iconfont icon-shengyin1" v-if="isSouce" @click="toggleSouce"></i>
            <i class="foot iconfont icon-guanbishengyin" v-else @click="toggleSouce"></i> -->
            <i class="foot fa fa-volume-up" title="关闭声音提示" v-if="isSouce" @click="toggleSouce"></i>
            <i class="foot fa fa-volume-off" title="开启声音提示"  v-else @click="toggleSouce"></i> 
        </footer>
    </div>

</template>

<script>
  
import GroupList from "./GroupList.vue"; 
import { getAES, getDAes } from '@/assets/js/crypto.js'
import {mapState,mapGetters,mapMutations,mapActions} from "vuex"; 
import Dialog from "./Dialog.vue"; 
export default {   
    components:{
        GroupList,Dialog
    }, 
    data () {
        return {
            intro:"",
            isActive:false,
            tabsName: [
                {
                    name: "tabicon iconfont icon-icon_people_fill",
                    isBorderActive: true
                },  
                {
                    name: "tabicon iconfont icon-liaotianduihua",
                    isBorderActive: false
                }
            ],
            borderbottom: false,  
            tabIndex:0,
            allUserList:[]
        }
    }, 
    props:["rootchat"], 
    computed:{
        ...mapState(["users","hasChat","newMess","leftDiaShow","KF","rightDiaShow","isSouce"]), 
    }, 
    methods: {
        toggleSouce(){ 
            this.$store.commit("setIsSouce");
        },
        openhasChat(i){ 
            this.$store.commit("setRightShow",true); 
            this.$store.commit("setDialog",true);  
            this.hasChat[i].isopenDialog = true;
            this.$store.commit("reduceNewmess",this.hasChat[i].unread);
            this.hasChat[i].unread = 0;
            this.$store.commit("setChatPerson",this.hasChat[i]); 
            this.$store.commit("setCurrentChatCon",this.hasChat[i].chatCon); //打开聊天窗口将聊天记录赋值给要渲染的数组  
            this.$store.commit("setCloseArr",this.hasChat); 
            this.$store.commit("setCloseIndex",i); 
            sessionStorage.setItem("users",JSON.stringify(this.users)); 
            // console.log(this.newMess)
            sessionStorage.setItem("newMess",this.newMess);
        },
        closeList(){ 
            this.$emit("change-rootchat",true)
        },
        introFocus(){
            this.isActive = true;
        },
        introBlur(){
            this.isActive = false;
        },
        tabsSwitch(index){   
            this.tabIndex = index; 
            var tabCard = Array.from($(".tab-card")) ;  
            for(var i = 0; i < tabCard.length; i++) {  
                this.tabsName[i].isBorderActive = false;
            }                 
            this.tabsName[index].isBorderActive = true;
            tabCard[index].style.display = "block";
            
            this.users.forEach((e,i)=>{
                this.allUserList = this.allUserList.concat(e.list)
            }) 
              this.allUserList.forEach((e,i)=>{   
                if(e.chatCon.length!=0&&this.hasChat.indexOf(e)==-1){ 
                  this.hasChat.unshift(e);  
                } 
              })
        }, 
    },
}

</script>

<style scoped>

.root-list{
  position: fixed;
  bottom: 0;
  right: 0;
  width: 262px;
    /* 修改 */
  /* height: 522px;   */
  margin: 5px 10px; 
  background-color: #fff;
  box-shadow: 0 0 50px 0 #bbb; 
  overflow: hidden;
}

header{
    background-color: #f5f5f5;
    padding: 15px 20px 0;
}
#top{
    display: flex;
    justify-content: space-between; 
}
.customer{
    font-size: 18px;
    color: rgb(75, 95, 116);
}
#intro{
    box-sizing: border-box;
    width: 105%;
    margin: 10px 0 8px;
    background-color: #f5f5f5;
    /* border: none; */
    border: 1px solid #f5f5f5; 
    color: #333;     
    /* 修改 */
    padding: 3px;
    outline: none;
}
#intro:hover{ 
    border: 1px solid #ccc; 
}
.active{
    border: 1px solid #ccc !important;
    background-color: #fff !important;
}
.tab{
    width: 100%;
    background-color: #f5f5f5;
    display: flex;
    justify-content: space-between; 
    color: #666;
}
.tabitem{
    /* width: 33.33%; */
    width: 50%;
    /* padding: 5px 0; */ 
    text-align: center;
    cursor: pointer;
}
.tabitem:hover span{ 
    color: #888;
}
.borderbottom{ 
    border-bottom: solid rgb(89, 209, 129);
}
.tabicon{
    font-size: 25px;
}
.contain{
    width: 100%;
    height: 369px;
    background-color: #fff;
    overflow-y: auto;
    overflow-x: hidden;
}
.tab-card{
    /* display: none; */
}

.tit-list{
    list-style: none;
    padding: 0px;
    margin: 10px 0;
}
.tit-list li{
    height: 52px;
    /* border-bottom: solid 1px #ccc;  */
    display: flex;
    align-items: center;
    padding-left: 10px;
    cursor: pointer;
    position: relative;
}
.tit-list li:hover{
    background-color: #f5f5f5;
} 
.avatar{
    width: 38px;
    height: 38px;
    margin-right: 8px; 
    border-radius: 50%;
}
.avatar_rotate{
    /* background-size: 100% 100%; */
    background-position: center center;
    transform: rotate(90deg); 
}
.account{
    font-size: 13px; 
    margin-top: -10px;
}
.num{
    display: inline-block; 
    padding: 1px 6px 0px;
    background-color: #bbb;
    border-radius: 50%; 
    position: absolute;
    top: 12px;
    right: 13px;
    color: #f5f5f5;
    text-align: center;
    font-size: 13px;
}



footer{
    width: 100%;
    height: 33px;
    background-color: #f5f5f5;
    display: flex; 
    align-items: center;
}
footer>i{
    display: inline-block; 
    width: 20%;  
    cursor: pointer;
}
.foot {
    color: #555;
    font-size: 22px;
    
}
</style>