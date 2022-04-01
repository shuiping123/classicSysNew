<template>
  <div id="app">
    <!--<keep-alive>-->
      <router-view/>
    <!--</keep-alive>-->
  </div>
</template>

<script>
  export default {
    name: 'App',
    created() {
    },
    mounted() {
      // window.location.reload(()=>{
      //   this.$store.dispatch('user/getpower');
      // })
    }
  }
</script>
