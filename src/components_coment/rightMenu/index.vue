<!--右键菜单-->
<template>
  <div style="display:flex;position:fixed;background:#ffffff;z-index: 100;"
       v-show="show"
       :style="{top:pageY+'px',left:pageX+'px'}"
       @mouseleave="closeMenu">
    <el-cascader-panel ref="menu" @change="changeMenu" :props="{ expandTrigger: 'hover'}"
                       :options="data"></el-cascader-panel>
  </div>
</template>

<script>


  export default {
    name: "index",
    data() {
      return {
        show: false,//是否显示右键菜单
        pageX: 0,//x轴坐标
        pageY: 0,//y轴坐标
        data: [],//右键菜单的数据
      }
    },
    mounted() {
    },
    methods: {
      // 打开右键菜单
      openMenu(data, pageX, pageY) {
        // let fullWidth = document.body.clientWidth;
        // let fullHeight = document.body.clientHeight;
        // if (fullWidth < (pageX+180)){
        //   pageX = pageX-180
        // }
        // if (fullWidth < (pageX+180)){
        //   pageX = pageX-180
        // }

        this.pageX = pageX;
        this.pageY = pageY;
        this.data = data;
        this.show = true;
        this.$refs.menu.clearCheckedNodes();
      },
      // 关闭右键菜单
      closeMenu() {
        this.show = false;
      },
      // 点击右键菜单
      changeMenu(node) {
        if (node) {
          this.$emit('changeRightMenu', node);
        }
      },
    },
  }
</script>

<style scoped>

</style>
