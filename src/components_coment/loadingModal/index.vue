<template>
  <!--loading的弹框-->
  <modal
    :modalTitle="modalTitle"
    ref="modal"
    :show-bottom="false"
    :show-head-close="false"
    :modalStyle="{ width: '300px' }">
    <div
      slot="modalContent"
      style="
          height: 100px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
      <div class="flex:1;">
        <span class="el-icon-loading" style="color: #4288ff"></span>
        <span>{{msg}}</span>
      </div>
    </div>
  </modal>
</template>

<script>
  import modal from '@/components_coment/modal';

  export default {
    name: "loadingModal",
    props: {
      modalTitle:{
        type:String,
        default:'加载中'
      },
      msg: {
        type: String,
        default:'加载中'
      },
    },
    data() {
      return {}
    },
    components: {modal},
    mounted() {
    },
    methods: {
      close(){
        this.$refs.modal.close();
      },
      open(){
        this.$refs.modal.open();
      }
    },
  }
</script>

<style scoped>

</style>
