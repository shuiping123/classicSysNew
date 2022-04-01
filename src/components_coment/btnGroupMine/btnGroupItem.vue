<template>
  <li v-if="!type">
    <button type="button" class="clearStyleBtn" @click="clickFun" :disabled="disabled"><slot></slot></button>
  </li>
  <!--当type为line时-->
  <li v-else role="separator" class="divider"></li>
</template>

<script>

  export default {
    name: "btnGroupItem",
    props: {
      type:{
        type:String,
        default:''
      },
      disabled: {
        type: Boolean,
        default:false
      }
    },
    data() {
      return {}
    },
    mounted() {
    },
    methods: {
      clickFun(){
        this.$emit('click');
      },
    },
  }
</script>

<style scoped>
  li {
    cursor: pointer;
    text-align: -webkit-match-parent;
    line-height:30px;
  }
  li,button{
    cursor: pointer;
  }
</style>
