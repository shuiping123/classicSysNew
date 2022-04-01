<template>
  <div style="width:100%;padding: 10px 10px 0 10px">
    <div style="width: 100%;padding: 5px">
      <div class="modalFrame">
        <div class="modalFrameTitle">{{modalTitle}}</div>
        <div class="modalFrameContent">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "index",
    props:{
      modalTitle: {
        type:String,
        default:'标题'
      },
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
  /*表单框*/
  .modalFrame {
    width: 100%;
    border: #b9b9b9 1px solid;
    position: relative;
    padding: 10px;
    padding-top: 15px;
  }

  /*表单框标题*/
  .modalFrameTitle {
    color: #004182;
    color: var(--font-color-blue);
    position: absolute;
    top: -15px;
    left: 10px;
    padding: 5px;
    background: #ffffff;
  }


</style>
<style>
  /*表单框内容*/
  .modalFrameContent p{
    padding: 2px!important;
    margin: 0!important;
  }
  /*.modalFrameContent button{*/
  /*  height: 25px!important;*/
  /*}*/
  /*.modalFrameContent input[type=text]{*/
  /*  height: 25px!important;*/
  /*}*/
  /*.modalFrameContent input[type=number]{*/
  /*  width: 50px!important;*/
  /*  height: 25px!important;*/
  /*}*/
</style>
