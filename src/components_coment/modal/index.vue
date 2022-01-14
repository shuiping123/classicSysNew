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
    <form ref="form" @submit.prevent="submitFun" style="height: 100%;display: flex;flex-direction: column">
      <div style="flex:1;">
        <slot name="modalContent"></slot>
      </div>
      <div v-if="showBottom" class="dialog-button" style="margin-top: 0px;">
        <button type="submit" class="normalBtn sizeMine_mini">{{language.determine}}</button>
        <button type="button" class="normalBtn sizeMine_mini" @click="close()">{{language.cancel}}</button>
      </div>
    </form>
  </Dialog>
</template>

<script>

  export default {
    name: "index",
    props: {
      modalTitle: {
        type: String,
        default: '标题'
      },
      modalStyle:{
        type:Object,
        default(){
          return {width:'400px'};
        }
      },
      // 设置是否显示下面的确定取消按钮
      showBottom:{
        type:Boolean,
        default:true,
      },
      // 是否显示顶上的取消按钮
      showHeadClose:{
        type:Boolean,
        default:false,
      }
    },
    computed:{
      language(){
        return this.$store.state.language=="zh"?{
          determine:'确定',
          cancel:"取消"
        }:{
          determine:"Determine",
          cancel:"Cancel",
        }
      },
    },
    data() {
      return {
      }
    },
    mounted() {
    },
    methods: {
      submitFun() {
        this.$emit('submitFun')
      },
      close() {
        this.$refs.modal.close();
        this.$emit('closeFun');
      },
      open(){
        this.$refs.modal.open();
      }
    },
  }
</script>

<style scoped>

</style>
