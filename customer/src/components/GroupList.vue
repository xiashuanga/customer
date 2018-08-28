<template>
    <div >
        <div class="tit" @click="groupClick()">
            <span class="arrow iconfont icon-youjiantou" :style="arrowStyleObj"></span>
            <span class="groupName" :title="group.name">{{group.name}}</span>
            <span style="color:#777">({{group.list.length}})</span>
        </div> 
        <ul class="tit-list"  v-show="isOpen">
            <li v-for="(g,i) in group.list" :key="i" @click="openChat(i)"> 
                <img class="avatar " v-if="g.hold" :src="g.hold"> 
                <img class="avatar" v-else src="../assets/images/timg.jpg"> 
                <span class="account">{{g.username}}</span> 
                <span class="num" v-if="g.unread!=0">{{g.unread}}</span>
            </li> 
        </ul>  

    </div>

</template>

<script>
import Dialog from "./Dialog.vue";  
import {mapState,mapMutations,mapActions} from "vuex";  
export default { 
    components:{
        Dialog
    },
    props:["group"],
    data () {
        return {  
            isOpen:false, 
        }
    },
    mounted(){
        // console.log(this.group)
    },
    computed:{   
        ...mapState(["users",
            "value","currentChatCon","KF","chatPerson","leftDiaShow","hasChat","newMess"]), 
        arrowStyleObj(){
            return{
                transform:this.isOpen? "rotate(90deg)": "rotate(0deg)", 
            }
        }, 
    },  
    methods: {
        //打开关闭分组
        groupClick(){ 
            this.isOpen = !this.isOpen;
        }, 
        //打开聊天窗口
        openChat(i){
            // console.log(this.group.list[i])
            this.$store.commit("setLeftShow",true); 
            this.group.list[i].isopenDialog = true;
            this.$store.commit("reduceNewmess",this.group.list[i].unread);
            this.group.list[i].unread = 0;
            this.$store.commit("setDialog",true); 
            this.$store.commit("setChatPerson",this.group.list[i]); 
            this.$store.commit("setCurrentChatCon",this.group.list[i].chatCon); //打开聊天窗口将聊天记录赋值给要渲染的数组 
            this.$store.commit("setCloseArr",this.group.list); 
            this.$store.commit("setCloseIndex",i);  
            sessionStorage.setItem("users",JSON.stringify(this.users)); 
            sessionStorage.setItem("newMess",this.newMess);
            // console.log(this.newMess)
        }, 
    }, 
}

</script>

<style scoped>
.arrow{
    display:"inline-block";
    color:"#aaa";
    font-size:"20px";
}
.tit{  
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 10px 15px;
    user-select:none;
    cursor: pointer;
}
.tit span{ 
    margin-right: 7px;
}
.groupName{ 
    font-size: 14px;
    color: #000;
    max-width: 180px; 
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tit-list{
    list-style: none;
    padding: 0px;
    margin: 0;
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
    font-size: 14px; 
    margin-top: -10px;
    max-width: 160px; 
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

.dialog{
    width: 640px;
}

</style>