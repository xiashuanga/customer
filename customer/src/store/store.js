import Vue from "vue";
import Vuex from "vuex";

import axios from "axios"; 
import { getAES, getDAes } from '@/assets/js/crypto.js'

Vue.use(Vuex);

var store = new Vuex.Store({
    state:{
        KF:"",//客服信息  
        value: '', 
        emojiChoose: [],  
        currentChatCon:[],//当前聊天对话框内容
        hasChat:[],//已经聊天的客户 
        newMess:0,//收到新消息条数
        dialogTableVisible: false,
        chatPerson:[],//打开聊天窗口的用户信息
        closeArr:[],//关闭时用户所在分组
        closeIndex:"",//关闭时用户id
        leftDiaShow:false,
        rightDiaShow:false,
        isSouce:true,//声音是否开启
        users:[],//所有用户
 
    },
    getters:{
        // getDialog: state => state.dialogTableVisible
    },
    mutations:{       
        setUsers(state,v){
            state.users = v;
        }, 
        setIsSouce(state){
            state.isSouce = !state.isSouce;
        }, 
        setLeftShow(state,v){
            state.leftDiaShow = v;
        }, 
        setRightShow(state,v){
            state.rightDiaShow = v;
        }, 
        setDialog(state,v){
            state.dialogTableVisible = v;
        }, 
        setChatPerson(state,v){
            state.chatPerson = v;
        }, 
        setCloseArr(state,v){
            state.closeArr = v;
        }, 
        setCloseIndex(state,v){
            state.closeIndex = v;
        },  


        setKF(state,v){
            state.KF = v;
        }, 
        setNewmess(state){
            state.newMess ++;
        }, 
        reduceNewmess(state,v){
            state.newMess = state.newMess - v;
        }, 
        initNewmess(state,v){
            state.newMess = v;
        }, 

        setValue(state,v){
            state.value += v;
        },
        setEmojiChoose(state,v){
            state.emojiChoose = v;
        },
        setCurrentChatCon(state,v){
            state.currentChatCon = v;
        },
        setHasChat(state,v){
            state.hasChat = v;
        }, 
    },
    actions:{  

        
    }
})



export default store;