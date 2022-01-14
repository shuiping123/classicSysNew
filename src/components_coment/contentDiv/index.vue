<template>
  <div class="contentView">
    <!--表格内容-->
    <div class="borderStyle content">
      <slot name="content_top"></slot>
    </div>
    <!--表格单行的属性-->
    <div v-if="showAttr" style="width: 100%;" :style="{height: state==='open'?'40%':state==='max'?'80%':'auto'}"  class="borderStyle">
      <div class="header" style="height:100%;display: flex;flex-direction: column">
        <div class="sideTreeDiv_head">
          <span style="margin-left: 10px;">{{navTitle}}</span>
          <button type="button" @click="expandOrCollapse" class="floatBtn" :class="state==='close'?'el-icon-caret-top':'el-icon-caret-bottom'"></button>
          <button type="button" @click="fullScreen" class="floatBtn el-icon-full-screen" v-show="state!=='max'"></button>
        </div>
        <div class="sideTreeDiv_body" style="flex: 1" v-show="state!=='close'">
          <slot name="content_bottom"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "index",
    props:{
      // 下面内容分割的标题
      navTitle: {type:String,default:'标题'},
      // 是否显示下面的内容分割
      showAttr:{
        type:Boolean,
        default:true
      }
    },
    data() {
      return {
        state:'open',//实际的状态 open正常状态 close最小化 max最大化
      }
    },
    mounted() {
    },
    methods: {
      // 底边栏收起
      expandOrCollapse() {
        this.state = this.state==='close'?'open': this.state ==='open'?'close':'open';
      },
      // 最大化
      fullScreen(){
        this.state = 'max';
      },
    },
  }
</script>

<style scoped>
  .contentView {
    flex: 1;
    margin-left: 5px;
    /*height: 100%;*/
    /*overflow: hidden;*/
    display: flex;
    flex-direction: column;
  }
  /*表格内容*/
  .content {
    flex: 1;
    width: 100%;
    height: 100%;
  }

  .sideTreeDiv_head {
    position: relative;
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #004182;
    color: var(--font-color-blue);
    background: linear-gradient(#dbe7f8, #cddef1);
    background: var(--backgound-jianbian);
  }

  .floatBtn {
    background: rgba(255, 255, 255, 0.35);
    border: #cedef3 1px solid;
    color: #004182;
    color: var(--font-color-blue);
    background: var(--btn-background);
    border: var(--btn-border-color);
    /*position: absolute;*/
    /*right: 20px;*/
    float: right;
    margin-right: 10px;
    display: inline-block;
    margin-top: 5px;
    padding: 2px 5px;
  }

  .expandDiv {
    background: linear-gradient(to left top, #dbe7f8, #cddef1);
    background: var(--backgound-jianbian-left-to-right);
    color: #004182;
    color: var(--font-color-blue);
  }
</style>
