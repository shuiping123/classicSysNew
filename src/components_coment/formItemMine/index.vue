<template>
  <div class="el-form-item el-form-item--mini">
    <label class="el-form-item__label" :style="{width:$parent.labelWidth}">{{label}}</label>
    <div class="el-form-item__content" :style="{'margin-left': $parent.labelWidth}">
      <slot></slot>
    </div>
  </div>
</template>

<script>

  export default {
    name: "index",
    props: {
      label:{
        type:String,
        default:''
      }
    },
    data() {
      return {}
    },
    mounted() {
    },
    methods: {},
  }
</script>

<style scoped>

</style>
