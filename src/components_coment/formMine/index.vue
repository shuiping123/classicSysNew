<template>
  <form @submit.prevent="submitFun" class="el-form">
    <slot></slot>
  </form>
</template>

<script>

  export default {
    name: "index",
    props: {
      labelWidth:{
        type:String,
        default:'80px'
      }
    },
    data() {
      return {}
    },
    mounted() {
    },
    methods: {
      submitFun(){
        this.$emit('submit')
      }
    },
  }
</script>

<style scoped>

</style>
