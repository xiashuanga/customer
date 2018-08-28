<template>
  <div> 
      <div class="root" ondragstart="return false"> 
        <div class="root-chat" 
          v-show="rootchat"
          @click="openChatClick"
        >
          <!-- <img src="https://www.workerman.net/laychat/qq-icon.png" style="cursor: move;">           -->
          <!-- <img v-if="KF.picture!=null" :src="KF.picture">  -->
          <img src="/Public/static/img/dme.png"> 
          <!-- <img src="../assets/images/dme.png">  -->
          <span>DME</span>
        </div>

        <!-- <div class="root-list" v-show="!rootchat"> </div> -->

        <Group v-show="!rootchat" :rootchat="rootchat" @change-rootchat="changeRootchat"></Group> 
      </div>
  </div>
</template>

<script>
import Group from "../components/Group.vue";
import {mapState} from "vuex";
export default {
  name: 'Home',
  components:{
      Group, 
  },
  data () {
    return {
      rootchat:true,
    }
  },
  computed:{
    ...mapState(["KF"]),
  },
  methods:{ 
    changeRootchat(r){  
          this.rootchat = r; 
    },
    openChatClick(){
      this.rootchat = false;
    },
  }
}
</script>
 
<style scoped> 
.root{
  position: relative;
}
.root-chat{
  position: fixed;
  bottom: 0;
  right: 0;
  width: 130px;
  height: 50px;  
  margin: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #fff;
  box-shadow: 0 0 50px 0 #bbb;
  cursor: pointer;
}
.root-chat img{ 
  width: 40px;
  height: 40px;  
  border-radius: 50%;
  box-shadow: 0 0 15px #ccc;
}
.root-chat span{ 
  line-height: 50px; 
  font-size: 18px;
}
</style> 
