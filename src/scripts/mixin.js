
// // import { getAES, getDAes } from '@/assets/js/crypto.js';
// import {mapState} from "vuex"; 
// const mixin={
//     data(){
//         return{ 
//             allUserList:[]
//         }
//     },
//     computed:{
//         ...mapState(["hasChat","uncertified","nonBorrower","borrower","overdue"]), 
//     }, 
//     created() {   

//     },
//     methods:{  
//         changeHasChat(){
//             this.allUserList = this.uncertified.concat(this.nonBorrower).concat(this.borrower).concat(this.overdue);
//             // console.log(this.allUserList);  
//               this.allUserList.forEach((e,i)=>{   
//                 if(e.chatCon.length!=0&&this.hasChat.indexOf(e)==-1){ 
//                   this.hasChat.unshift(e); 
//                 }
//               })
//         }
//     } 
// }
// export default mixin;