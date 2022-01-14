<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
  },
  mounted() {
    // window.location.reload(()=>{
    //   this.$store.dispatch('user/getpower');
    // })
  }
}
</script>
