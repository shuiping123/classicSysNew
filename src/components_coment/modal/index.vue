<template>
  <!--弹框-->
  <el-dialog title="收货地址" :visible.sync="dialogTableVisible">

  </el-dialog>
</template>

<script>

  export default {
    name: "index",
    data() {
      return {
        dialogTableVisible:false,
      }
    },
    mounted() {
    },
    methods: {
      // close() {
      //   this.$refs.modal.close();
      //   this.$emit('closeFun');
      // },
      open(config){
        let {title,styleObj,showHeadClose}=config;
        this.modalTitle=title;
        this.modalStyle=styleObj;
        this.showHeadClose=showHeadClose;
        this.$refs.modal.open();
      },
    },
  }
</script>

<style scoped>

</style>
