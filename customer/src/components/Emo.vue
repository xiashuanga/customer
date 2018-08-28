<template>
  <div class="appa">
    <!-- <el-input
      type="textarea"
      :autosize="{ minRows: 10, maxRows: 20}"
      placeholder="请输入内容"
      resize="none"
      v-model="value">
    </el-input> -->
    <div class="icon clearfix">
      <i class="icon iconfont icon-face" @click="showEmoji = !showEmoji"></i>
      <!-- <el-button type="success" size="small" @click="submit" class="submit">提交</el-button> -->
      <transition name="fade" mode="">
        <div class="emoji-box" v-if="showEmoji" >
          <!-- <el-button 
            class="pop-close" 
            :plain="true" 
            type="danger" 
            size="mini" 
            icon="close"
            @click="showEmoji = false"></el-button> -->
            <i class="iconfont icon-cuohao pop-close" 
              style="cursor: pointer;" 
              @click="showEmoji = false"
            ></i>
            <vue-emoji
              @select="selectEmoji">
            </vue-emoji>
          <!-- <span class="pop-arrow arrow"></span> -->
        </div>       
      </transition>
    </div>
    <!-- <transition-group tag="div" name="list" class="comment">
      <p v-for="(item,index) in data" :key="index" class="item">
        <span v-html="emoji(item)"></span>
      </p>
    </transition-group> -->
  </div>
</template>

<script>
import vueEmoji from './emoji.vue';
import {mapState,mapGetters,mapMutations,mapActions} from "vuex";

export default {
  name: 'appa',
  data () {
    return {
      // value: '',
      showEmoji: false,
      // data: []
    }
  },
  methods: {
    selectEmoji (code) { 
      this.showEmoji = false;
      // this.value += code
      this.$store.commit("setValue",code);
      // console.log(this.$store.state.value)
    },
    // submit () {
    //   this.data.push(this.value)
    //   this.value = ''
    // }
  },
  components: {
    vueEmoji
  }
}
</script>

<style lang="scss">

ul{
  margin: 0;
  padding: 0;
  list-style: none;
}
.appa {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  // margin: 60px auto ;
  // width: 500px;
  .icon {
    position: relative;
    // margin-top: 20px;
    .iconfont {
      cursor: pointer;
      color: #777;
      font-size: 21px;
    }
    .emoji-box {
      position: absolute;
      z-index: 10;
      left: -10px;
      top: -210px;
      box-shadow: 4px 0 10px 1px rgba(0, 0, 0, 0.2);
      background: white;
      .pop-close {
        position: absolute;
        border: none;
        // color: #FF4949;
        right: 12px;
        top: 12px;
        z-index: 10;
        font-size: 12px;
      } 
    } 
  }
}

.clearfix {
  &:after {
    content: '';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity .5s; }
.fade-enter, .fade-leave-active { opacity: 0; }
.fade-move { transition: transform .4s; }

.list-enter-active, .list-leave-active { transition: all .5s; }
.list-enter, .list-leave-active { opacity: 0; transform: translateX(30px); }
.list-leave-active { position: absolute !important; }
.list-move { transition: all .5s;}
</style>
