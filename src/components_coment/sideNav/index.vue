<template>
  <div class="sideTreeDiv" @contextmenu.prevent>
    <!--最小化侧边栏-->
    <div style="width: 100%;height: 100%;text-align: center;" class="expandDiv" v-show="!isExpand">
      <button type="button" @click="expandOrCollapse" class="el-icon-s-unfold expandBtn"></button>
      <p v-html='selection?selection.text.split("").join("<br/>"):""'></p>
    </div>
    <!--展开后侧边栏-->
    <div style="width: 200px;height: 100%;display: flex;flex-direction: column;" v-show="isExpand">
      <div class="sideTreeDiv_head">
        <span style="margin-left: 10px;">{{navTitle}}</span>
        <button type="button" @click="expandOrCollapse" class="floatBtn el-icon-s-fold"></button>
      </div>
      <div class="sideTreeDiv_body">
        <div style="width: auto;height: auto;">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "sideNav",
    props: {
      navTitle: {type: String, default: '标题'},
      selection:{
        type:Object,
        default:()=>{}
      },
    },
    data() {
      return {
        isExpand: true,
      }
    },
    mounted() {
    },
    methods: {
      // 侧边栏展开收起
      expandOrCollapse() {
        this.isExpand = !this.isExpand
      },
    },
  }
</script>

<style scoped>
  .sideTreeDiv {
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

  .sideTreeDiv_body {
    width: 100%;
    height: 0;
    overflow:auto;
    flex: 1;
  }

  .sideTreeDiv .floatBtn {
    background: rgba(255, 255, 255, 0.35);
    border: #cedef3 1px solid;
    color: #004182;
    color: var(--font-color-blue);
    background: var(--btn-background);
    border: var(--btn-border-color);
    position: absolute;
    right: 5px;
    display: inline-block;
    margin-top: 5px;
    padding: 2px 5px;
  }

  .sideTreeDiv .expandDiv {
    background: linear-gradient(to left top, #dbe7f8, #cddef1);
    background: var(--backgound-jianbian-left-to-right);
    color: #004182;
    color: var(--font-color-blue);
  }

  .sideTreeDiv .expandBtn {
    background: rgba(255, 255, 255, 0.35);
    border: #cedef3 1px solid;
    color: #004182;
    color: var(--font-color-blue);
    background: var(--btn-background);
    border: var(--btn-border-color);
    margin: 5px;
    padding: 2px 5px;
  }
</style>
