<template>
  <div style="width:100%;height:100%;">
    <div ref="file" v-if="url"></div>
  </div>
</template>

<script>
  import {request} from '@/network'
  const docx = require('docx-preview');
  import jszip from 'jszip'
  window.JSZip = jszip;
  export default {
    props:{
      url:{
        type:String,
        default:'',
        required:true
      }
    },
    watch:{
      url:function(newVal){
        if (newVal){
          this.init();
        }
      },
    },
    mounted(){
      if (this.url){
        this.init();
      }
    },
    methods:{
      init(){
        request({
          url: this.url,
          method: 'get',
          baseURL:'/',
          responseType: 'blob', // 设置响应文件格式
        }).then((res) => {
          docx.renderAsync(res,this.$refs.file) // 渲染到页面预览
        })
      },
    }
  }
</script>

