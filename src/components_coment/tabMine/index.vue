<template>
  <div class="tabsMine form-inline">
    <div class="tabItem" v-for="(item,key) in data"
         @click="$emit('update:active_tab',item.name)"
         :class="item.name==active_tab?'activeTab':''"
         v-show="item.show">
      {{item.label}}
      <i class="el-icon-close deleteBtn" v-if="item.showClose" @click.stop="closeTabFun(key)"></i>
    </div>
    <div class="tabItem" style="flex:1"></div>
  </div>
</template>

<script>

  export default {
    name: "index",
    props: {
      active_tab: {
        type: String,
        default: 'first'
      },
      data: {
        type: Array,
        default: () => [
          {name: 'first', label: '标题1', show: true, showClose: true}
        ]
      }
    },
    data() {
      return {}
    },
    mounted() {
    },
    methods: {
      closeTabFun(closeKey) {
        if (this.active_tab == this.data[closeKey].name) {
          let data = this.data.filter((item, key) => {
            return key != closeKey
          });
          this.$emit('update:active_tab', data[0].name);
        }
        this.data[closeKey].show = false;
      },
    },
  }
</script>

<style scoped>
  .tabsMine {
    font-size: 14px;
  }

  .tabItem .deleteBtn:hover {
    background: red;
    color: #ffffff;
  }

  .tabsMine .tabItem {
    padding: 10px 16px;
    margin-left: -1px;
    border: #e6ebf5 1px solid;
    cursor: pointer;
  }

  .tabsMine .activeTab {
    border-bottom: none;
    color: #409eff;
  }

</style>
<style>

</style>
