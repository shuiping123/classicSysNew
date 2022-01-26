<template>
  <!--弹框-->
  <Dialog ref="modal"
          :closed="true"
          :title="modalTitle"
          :dialogStyle="modalStyle"
          :modal="true"
          :closable="showHeadClose"
          :draggable="true"
          :resizable="true">
    <form ref="form" @submit.prevent style="height: 100%;display: flex;flex-direction: column">
      <div style="flex:1;">
        <slot name="modalContent"></slot>
      </div>
    </form>
  </Dialog>
</template>

<script>

  export default {
    name: "index",
    data() {
      return {
        modalTitle:'标题',
        modalStyle:{width:'400px'},
        showHeadClose:false,
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
