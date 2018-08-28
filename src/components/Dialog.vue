<template>
    <div>
        
        <el-dialog  
            :visible.sync="dialogTableVisible"
            :modal="false"
            :modal-append-to-body="false"
            ref="dialog"  
            :width="dialogWidth"
            :show-close="true"
            @close="closeDialog"
        >
            <el-dialog
                :width="innerDiaWidth"
                title="图片详情" 
                :visible.sync="innerVisible" 
                append-to-body>
                <img :src="detailsImg" id="innerImg" style="width:100%">
            </el-dialog>
            <main>
                <div class="chat-window">
                    <div class="top"> 
                        <img class="chat-avatar " v-if="chatPerson.hold" :src="chatPerson.hold"> 
                        <img class="chat-avatar" v-else src="../assets/images/timg.jpg">
                        <span class="chat-account">{{chatPerson.username}}</span>
                    </div>
                    <div class="con"> 
                        <ul>
                            <li 
                                v-for="(c,i) in currentChatCon"
                                :key="i"
                                v-if="c.user_id==chatPerson.user_id||c.user_id==KF.account"
                                :class="c.user_id==KF.account?'barr':'barl'" 
                            >  
                                <img class="chat_user " v-if="c.user_id==chatPerson.user_id&&chatPerson.hold" :src="chatPerson.hold"> 
                                <img class="chat_user" v-else-if="c.user_id==KF.account&&KF.picture!=null" :src="KF.picture"> 
                                <img class="chat_user" v-else src="../assets/images/timg.jpg">
                                <!-- <img class="chat_user" v-else src="https://www.workerman.net/laychat/qq-icon.png">  -->
                                <div class="chat_po">
                                    <p class="chat_time">{{c.send_time*1000|formatDate}}</p> 
                                    <div class="chat_text chat_text_max">
                                        <span v-if="c.type==1&&c.message!=null" v-html="emoji(c.message)"></span>
                                        <!-- <div class="chatimg_max"  v-if="c.type==2&&c.message!=null" > -->
                                        <img :src="c.message" v-if="c.type==2&&c.message!=null" class="chatimg_max" @load="imgload" @click="openInnerDia(c.message)">
                                        <!-- </div> -->
                                    </div> 
                                </div> 
                            </li> 
                        </ul>
                    </div>
                    <div class="inp">
                        <div class="emo">
                            <Emo></Emo> 
                            <div class="pic-upload">
                                <i class="icons iconfont icon-tubiaolunkuo-" style="margin-left:8px;margin-top:-3px;"></i>
                                <input id="file" name="file" type="file" accept="image/png,image/gif,image/jpg,image/jpeg" @change="update"/>
                            </div>
                            <!-- <i class="icons iconfont icon-iconset0196" style="margin-left:8px"></i>  -->
                            <div @click="showRecord" class="record">
                                <i class="jishi iconfont icon-jishi1"></i> 
                                <span>消息记录</span>
                            </div>
                        </div>
                        <textarea v-model="$store.state.value" @keydown.enter.prevent="confirmBtn"></textarea> 
                        <div class="btnChat">
                            <button @click="closeBtn" class="closedia">关 闭</button>
                            <button @click="confirmBtn" class="send">发 送</button>
                            <button @click="custmessBtn" class="defa"> 
                                <span class="triangle"></span>
                            </button>
                            <div class="cust" v-if="custmessShow">
                                <ul>
                                    <li 
                                        class="cust-li"
                                        v-for="(m,i) in custmess" 
                                        :key="i"
                                        @click="choseCustmess(i)"
                                    >{{m}}</li> 
                                </ul>
                            </div>
                        </div>
                    </div> 
                </div> 
                <div class="chat-record" v-show="chatRecord"> 
                    <div class="record-top">
                        <span class="customer">与&emsp;{{chatPerson.username}}&emsp;的聊天记录</span>
                        <i class="record-remove iconfont icon-cuohao" style="cursor: pointer;" @click="showRecord"></i>
                    </div>
                    <div class="record-con">
                        <p v-show="chatRecordCon.length==0">暂无聊天记录 </p> 
                        <ul>
                            <li 
                                v-for="(c,i) in chatRecordCon"
                                :key="i" 
                                :class="c.user_id==KF.account?'barr':'barl'" 
                            >  
                                <img class="chat_user " v-if="c.user_id==chatPerson.user_id&&chatPerson.hold" :src="chatPerson.hold"> 
                                <img class="chat_user" v-else-if="c.user_id==KF.account&&KF.picture!=null" :src="KF.picture"> 
                                <img class="chat_user" v-else src="../assets/images/timg.jpg"> 
                                <!-- <img class="chat_user" v-else src="https://www.workerman.net/laychat/qq-icon.png">  -->
                                <div class="chat_po">
                                    <p class="chat_time">{{c.send_time*1000|formatDate}}</p> 
                                    <div class="chat_text chat_text_min">
                                        <span v-if="c.type==1&&c.message!=null" v-html="emoji(c.message)"></span>
                                        <img :src="c.message" v-if="c.type==2&&c.message!=null" class="chatimg_min" @click="openInnerDia(c.message)">
                                    </div> 
                                </div> 
                            </li> 
                        </ul>
                    </div>
                    <div class="pager">
                        <span @click="reqPagePrev" :style="pagerPrev">上一页</span> |
                        <span @click="reqPageNext"  :style="pagerNext">下一页</span>
                    </div>
                </div>
            </main>
        </el-dialog> 
    </div>

</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from "vuex";
import {formatDate} from '@/assets/js/timestamp.js'; 
import { emoji } from '../utils/emoji.js';
import Emo from "./Emo.vue";  
import { getAES, getDAes } from '@/assets/js/crypto.js';
import Qs from 'qs'; 
import mixin from '@/scripts/mixin.js';
export default {
    mixins:[mixin],
    components:{
        Emo
    },
    data () {
        return {
            dialogWidth:"680px",//弹窗宽度
            innerDiaWidth:"60%",//内弹框宽度
            chatRecord:false,//聊天记录显示
            chatRecordCon:[],//打开的聊天窗口的聊天记录
            page:0,//请求聊天记录参数
            isEquallyPage:false,//上下页page是否一样
            pageObj: { 
                cursor: "pointer",
                color: "#408553" 
            }, 
            custmess:[
                "您好,有什么需要帮助的吗?",
                "好的,不客气~" 
            ],
            custmessShow:false,  //自定义消息显示框
            watchCon:"",//监听对话内容
            allUserList:[],
            imgMsg:"",//发送图片路径
            innerVisible:false,//内层dialog显示图片
            detailsImg:""
        }
    },
    computed:{   
        ...mapState(["users","value","KF","chatPerson","currentChatCon","closeArr","closeIndex","leftDiaShow","rightDiaShow","hasChat"]),  
        dialogTableVisible : {
            get:function (){
                return this.$store.state.dialogTableVisible
            },
            set:function (v){
                this.$store.state.dialogTableVisible = v
            }
        }, 
        pagerPrev(){ 
            if(this.chatRecordCon.length==6){
                return this.pageObj;
            }else{
                return "";
            } 
        },
        pagerNext(){ 
            if(this.isEquallyPage=="true"){
                return this.pageObj;
            }else if(this.page==6){
                return "";
            }else if(this.chatRecordCon.length==0){
                return "";
            }else{
                return this.pageObj;
            }
        },
    },  
    mounted(){
        this.watchCon = $(".con")[0];
        // console.log(this.watchCon)
    },
    watch:{
        currentChatCon:function(){ 
            this.$nextTick(function(){  
                this.getScrollTop();  
            })
        }, 
        watchCon:function(){ 
            this.$nextTick(function(){   
                this.getScrollTop();  
            })
        }
    },
    methods: {  
        openInnerDia(src){//打开内部弹框
            // 创建对象
            var img = new Image(); 
            img.src = src; 
            // console.log('width:'+img.width+',height:'+img.height);
            if(img.width>700){
                this.innerDiaWidth = "70%";
            }else if(img.width<=700&&img.width>=400){
                this.innerDiaWidth = img.width+'px';
            }else{
                this.innerDiaWidth = '400px';
            }
            this.detailsImg = src;
            this.innerVisible = true; 
        }, 
        imgload(){//图片加载完毕计算滚动高度
            this.getScrollTop();
        },
        getRecordCon(r){ // 请求聊天记录
            this.http.get("https://nxyc.dstlkj.com/Chatwith/chatrecord_lsit",{ 
                params:{
                    data:getAES(JSON.stringify({ 
                    user_id:this.KF.account,
                    receive_id:r, 
                }) ) } 
            }).then(res=>{  
                var dataObj = JSON.parse(getDAes(res.data.data)); 
                if(dataObj.ret=="1001"){ 
                    this.page = dataObj.page; 
                    //当前对话的聊天记录
                    this.chatRecordCon = (dataObj.data).reverse();
                    if(this.chatRecordCon.length<6){
                        this.page = 6; 
                    }
                    // console.log(this.chatRecordCon);
                }
            })
        }, 
        reqPagePrev(){//上一页
            if(this.chatRecordCon.length==6){ 
                this.http.get("https://nxyc.dstlkj.com/Chatwith/chatrecord_lsit",{ 
                    params:{
                        data:getAES(JSON.stringify({ 
                        user_id:this.KF.account,
                        receive_id:this.chatPerson.user_id,
                        page:this.page
                    }) ) } 
                }).then(res=>{  
                    var dataObj = JSON.parse(getDAes(res.data.data)); 
                    if(dataObj.ret=="1001"){  
                        if(dataObj.data.length==0){
                            this.chatRecordCon = [];
                            this.page = this.page*1 + 6;
                            this.isEquallyPage = true;
                            // return;
                        } else{
                            this.isEquallyPage = false;
                            this.page = dataObj.page; 
                            //当前对话的聊天记录
                            this.chatRecordCon = (dataObj.data).reverse(); 
                        }
                        // console.log(this.chatRecordCon);
                        // console.log(this.page);
                    }
                })
            }else{
                return;
            } 
        }, 
        reqPageNext(){//下一页
            if(this.page==6||this.chatRecordCon.length==0){
                return ;
            }else{
                if(this.page%6==0){
                    this.page = this.page - 12; 
                }else{
                    this.page = this.page - 6 - this.page%6; 
                } 
                this.http.get("https://nxyc.dstlkj.com/Chatwith/chatrecord_lsit",{ 
                    params:{
                        data:getAES(JSON.stringify({ 
                        user_id:this.KF.account,
                        receive_id:this.chatPerson.user_id,
                        page:this.page
                    }) ) } 
                }).then(res=>{  
                    var dataObj = JSON.parse(getDAes(res.data.data)); 
                    if(dataObj.ret=="1001"){  
                        this.page = dataObj.page; 
                        //当前对话的聊天记录
                        this.chatRecordCon = (dataObj.data).reverse(); 
                    }
                        // console.log(this.chatRecordCon);
                        // console.log(this.page);
                })
            } 
        }, 
        confirmBtn(){ //发送消息   
            // console.log(this.chatPerson); 
            // console.log(this.currentChatCon);
            var value = this.value.split(" ").join("");
            if(value.length==0){  
                layer.msg('发送消息不能为空');
                return;
            }
            this.http({
                method:"post",
                url:"https://nxyc.dstlkj.com/Chatwith/message", 
                transformRequest: [function (data) { 
                    return Qs.stringify(data)
                }], 
                data:{data:getAES(JSON.stringify({
                    user_id:this.KF.account,
                    receive_id:this.chatPerson.user_id,
                    message:this.value,
                    type:"1",
                    voic_time:"0",
                    mark:"DME"
                }))}
            }).then(res=>{
                var data = JSON.parse(getDAes(res.data.data));   
                // console.log(data)
                if(data.ret==1001){
                    this.currentChatCon.push(data);
                    // console.log(this.currentChatCon);
                    this.getRecordCon(this.chatPerson.user_id);
                    this.$store.state.value = "";  
                    this.loadStorage();
                    this.loadHasChat();
                }
                if(data.ret==1002){
                    layer.msg(res.code);
                }
            })
        },
        choseCustmess(i){//自定义发送消息
            // var val = document.getElementsByClassName("cust-li")[i]
            var val =  $($(".cust-li")[i]).text(); 
            // this.value = val; 
            this.http({
                method:"post",
                url:"https://nxyc.dstlkj.com/Chatwith/message", 
                transformRequest: [function (data) { 
                    return Qs.stringify(data)
                }], 
                data:{data:getAES(JSON.stringify({
                    user_id:this.KF.account,
                    receive_id:this.chatPerson.user_id,
                    message:val,
                    type:"1",
                    voic_time:"0",
                    mark:"DME"
                }))}
            }).then(res=>{
                var data = JSON.parse(getDAes(res.data.data));
                if(data.ret==1001){ 
                    this.currentChatCon.push(data); 
                    this.getRecordCon(this.chatPerson.user_id); 
                    this.loadStorage();
                    this.loadHasChat();
                }  
                if(data.ret==1002){
                    layer.msg(res.code);
                }
            })
            this.custmessShow = false;

        },
        custmessBtn(){//自定义发送消息显示
            this.custmessShow = !this.custmessShow;
        },
        update(e){//发送上传图片   
            // const that = this;
            this.http.get("https://nxyc.dstlkj.com/Account/get_oss")
            .then(res=>{
                // console.log(res.data.dara)
                var data = res.data.dara;
                var client = new OSS.Wrapper({
                    region: "oss-cn-hangzhou",
                    secure: true, 
                    accessKeyId: data.oss_appid,
                    accessKeySecret: data.oss_secret,
                    bucket:data.oss_bucket
                })  
                const file = e.target.files[0];  
                const storeAs = e.target.files[0].name;   
                const size = e.target.files[0].size;
                // console.log(file);
                const fileVal = e.target.value;
                const fileType = fileVal.substring(fileVal.lastIndexOf(".")+1).toLowerCase();//jpg... 
                // console.log(fileType)  
                if(fileType=='png' || fileType=='gif' || fileType=='jpg' || fileType=='jpeg'){
                    layer.msg("发送中",{time:false});
                    client.multipartUpload(storeAs,file).then(res=>{  
                        if(size>=100*1024){
                            this.imgMsg = res.res.requestUrls[0].split("?")[0];
                        }else{
                            this.imgMsg = res.url;
                        } 
                        this.http({
                            method:"post",
                            url:"https://nxyc.dstlkj.com/Chatwith/message", 
                            transformRequest: [function (data) { 
                                return Qs.stringify(data)
                            }], 
                            data:{data:getAES(JSON.stringify({
                                user_id:this.KF.account,
                                receive_id:this.chatPerson.user_id,
                                message:this.imgMsg,
                                type:"2",
                                voic_time:"0",
                                mark:"DME"
                            }))}
                        }).then(res=>{
                            var data = JSON.parse(getDAes(res.data.data));  
                            this.currentChatCon.push(data); 
                            this.getRecordCon(this.chatPerson.user_id);  
                            this.loadStorage();
                            this.imgMsg = "";
                            this.loadHasChat();
                            layer.close(layer.index);
                        })  
                    }).catch(err=>{ 
                        layer.msg("发送图片失败，请重试!");
                    }) 
                }else{
                    layer.msg("发送图片格式为png , gif , jpg , jpeg");
                    return;
                }  
            }); 
        }, 
        loadHasChat(){//刷新已聊天的用户顺序
            var allUserList=[];
            this.users.forEach((e,i)=>{
                allUserList = allUserList.concat(e.list)
            }) 
            allUserList.forEach((e,i)=>{   
                if(e.chatCon.length!=0&&this.hasChat.indexOf(e)==-1){ 
                    this.hasChat.unshift(e); 
                //   console.log(this.hasChat);
                }  
                if(e.user_id==this.chatPerson.user_id&&e.username==this.chatPerson.username&&this.hasChat.indexOf(e)>0){
                    var hasChatNew = this.hasChat.splice(this.hasChat.indexOf(e),1);
                    // console.log(hasChatNew)
                    this.hasChat.unshift(hasChatNew[0])
                }
            })
        },
        loadStorage(){//刷新本地缓存
            sessionStorage.setItem("users",JSON.stringify(this.users));             
        },
        getScrollTop(){ //聊天窗口底部
            var box = $(".con")[0];  
            if(box){
                box.scrollTop = box.scrollHeight-box.clientHeight; 
            } 
        }, 
        showRecord(){// 显示消息记录
            this.getRecordCon(this.chatPerson.user_id);
            this.chatRecord = !this.chatRecord;
            if(this.chatRecord){
                this.dialogWidth = "1080px";
            }else{
                this.dialogWidth = "680px";
            } 
        }, 
        closeDialog(){//关闭聊天窗口
            this.$store.commit("setLeftShow",false); 
            this.$store.commit("setRightShow",false); 
            this.$store.commit("setDialog",false);  
            this.closeArr[this.closeIndex].isopenDialog = false;
            this.closeArr[this.closeIndex].chatCon = this.$store.state.currentChatCon;//关闭时将和本次用户聊天内容放入用户聊天数组记录中 
            this.chatRecord = false;
            this.dialogWidth = "680px";
            this.$store.state.value = ""; 
            this.$store.commit("setChatPerson",[]);
            this.chatRecordCon = []; 
            // this.$store.commit("setCurrentChatCon",[]);
            // this.$store.commit("setCloseArr",[]);
            // this.$store.commit("setCloseIndex","");  
        }, 
        closeBtn(){//点击关闭聊天窗口 
            this.$store.commit("setDialog",false);
        }, 
    },
    filters: {
        formatDate(time) {
            var date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        }
    }, 
}

</script>

<style scoped>

main{ 
    /* width: 600px; */
    border: 1px solid #f1f2f3;
    box-shadow: 0 0 10px 0 #f5f5f5;
    display: flex;
}
/* 聊天窗口 */
.chat-window{
    width: 660px;
    /* height: 520px; */
    /* margin-right: 8px; */
}
/* 聊天记录窗口 */
.chat-record{
    width: 400px;
    /* height: 520px; */
    /* background-color: pink; */
    box-sizing: border-box;
    border-left: 1px solid #f1f1f1;
}
.record-top{
    height: 75px;
    line-height: 30px;
    position: relative;
    background-color: #f7f7f7;
    border-bottom: 1px solid #f5f5f5;
    box-sizing: border-box;
    padding:20px 10px;
}
.record-con{
    width: 100%;
    height: 415px;
    /* background-color: pink; */
    box-sizing: border-box;
    padding: 8px;
    overflow-y: auto;
    overflow-x: hidden; 
}
.pager{
    height: 35px;
    line-height: 40px;
}
.pager>span{
    user-select:none;
} 
.record-remove{
    position: absolute;
    right: 8px;
}
.top{ 
    height: 75px;
    background: #f5f5f5; 
    display: flex;
    box-sizing: border-box;
    margin: 0;
    padding: 20px 10px;
} 
.chat-avatar{
    width: 50px;
    height: 50px;
    margin-right: 8px; 
    border-radius: 50%;
}
.avatar_rotate{
    /* background-size: 100% 100%; */
    background-position: center center;
    transform: rotate(90deg); 
}
.chat-account{
    font-size: 17px;  
}
.con{
    width: 100%;
    height: 282px;
    box-sizing: border-box;
    padding: 8px;
    overflow-y: auto;
    overflow-x: hidden;
    /* background-color: pink;  */
}
.inp{
    width: 100%; 
}
.record{
    margin-left:450px;
    cursor: pointer;
    user-select:none;
}
.icons{
    font-size: 24px;
    cursor: pointer;
}
.jishi{
    font-size: 20px;
    cursor: pointer;
}
.emo{
    width: 100%;
    height: 38px;
    border-top: 1px solid #ddd;
    /* border-bottom: 1px solid #ddd; */
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 8px;
} 
.pic-upload{
    /* width: 30px; */
    display: flex;
    /* overflow: hidden; */
    /* position: relative; */
} 
.pic-upload>i{
    /* position: absolute; */
    left: 0;top: 0;
}
.pic-upload>input{
    display: block;
    width: 25px;
    position: relative; 
    left: -25px; 
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer;
}
textarea{
    width: 100%;
    height: 73px;
    font-size: 14px;
    line-height: 17px;
    /* background-color: lightblue;  */
    box-sizing: border-box;
    border: none;
    padding: 5px 10px;
    resize:none; 
    outline:none;
}
.btnChat{
    height: 46px;
    display: flex;
    justify-content: flex-end;
    padding-top: 5px;
    position: relative;
}
.btnChat>button{ 
    border: none;
    background-color: rgb(94, 197, 129);
    color: #f5f5f5; 
    cursor: pointer;
}
.btnChat>button:hover{ 
    background-color: rgba(102, 211, 138, 0.9); 
} 
.btnChat>button:focus{ 
    outline:none; 
} 
.btnChat>.closedia{
    width:68px;
    height: 32px; 
    margin-right: 5px;
    border-radius: 5px;
}
.btnChat>.send{
    width:68px;
    height: 32px; 
    border-right:1px solid #ccc;  
    /* margin-right: 1px; */
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;    
}
.btnChat>.defa{
    width:25px;
    height: 32px; 
    margin-right: 5px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;     
}
.defa>.triangle { 
    display: inline-block;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 8px solid #fff; 
}
.cust{ 
    position: absolute;
    top: 37px;right: 5px;
    box-shadow: 0 0 10px 0 #ddd;
    background-color: #fff;
}

.cust ul{
    width: 100%; 
    margin: 10px 0;
}
.cust-li{
    padding: 0px 20px;
    height: 28px; 
    line-height: 28px;
    /* background-color: #eee; */
    text-align: left;
}
.cust-li:hover{ 
    background-color: #f1f1f1; 
    cursor: pointer;
}
/* 显示聊天内容样式 */
.con ul{
    width: 100%;
} 
.barr{ 
    margin-top: 0;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;  
    /* justify-content: flex-end; */
    flex-direction: row-reverse; 
} 
.barr .chat_user{
    width: 40px;
    height: 40px;
    border-radius: 50%;  
    /* margin: 10px 20px 0 0; */
    margin: 10px 0 0 20px ;
    box-shadow: 0 0 15px 0 #eee;
}
.barr .chat_po{
    position: relative;  
    text-align: right;
}
.barr .chat_text::after {
    content: '';
    position: absolute; 
    /* left: -10px; */
    right: -10px; 
    top: 13px;
    width: 0;
    height: 0;
    border-style: solid dashed dashed;
    border-color: #e2e2e2 transparent transparent; 
    overflow: hidden;
    border-width: 10px; 
    border-top-color: #5FB878;
} 
.chatimg_max{
    max-width: 400px;
    max-height: 180px;
    cursor: pointer;
}
.chatimg_min{
    max-width: 200px;
    max-height: 90px;
    cursor: pointer;
}
.barl{ 
    margin-top: 0;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;  
} 
.barl .chat_user{
    width: 40px;
    height: 40px;
    border-radius: 50%;  
    margin: 10px 20px 0 0;
    /* margin: 10px 0 0 20px ; */
    box-shadow: 0 0 15px 0 #eee;
}
.barl .chat_po{
    position: relative;  
    text-align: left;
}

.chat_time{
    margin: 0;
    font-size: 12px;
    color: #999;
    line-height: 20px;  
}
.chat_text{ 
    position: relative;
    display: inline-block;
    text-align: left;
    vertical-align: middle;
    line-height: 22px; 
    padding: 7px 10px 4px;
    background-color: #5fb878;
    border-radius: 3px; 
    color: #fff; 
    word-break: break-all;
}
.chat_text_min{
    max-width: 250px; 
}
.chat_text_max{
    max-width: 500px; 
}
.barl .chat_text::after {
    content: '';
    position: absolute; 
    left: -10px;
    /* right: -10px; */ 
    top: 13px;
    width: 0;
    height: 0;
    border-style: solid dashed dashed;
    border-color: #e2e2e2 transparent transparent; 
    overflow: hidden;
    border-width: 10px; 
    border-top-color: #5FB878;
}
</style>