<template>
  <div>
    <!--<p v-if="err!==''">{{err}}</p>  &lt;!&ndash; 用来显示报错 &ndash;&gt;-->
    <!--<template v-for="content in contents" v-if="contents.length">-->
    <!--  <p>{{content[0][0]}}</p>-->
    <!--  <table class="el-table">  &lt;!&ndash; 设置居中,如果没获取到内容则不显示 &ndash;&gt;-->
    <!--    <tr v-for="(row,key) in content" :key=row.id v-if="key!==0">-->
    <!--      <td class="el-table&#45;&#45;border" v-for="item in row" :key=item.id>{{item}}</td>-->
    <!--    </tr>-->
    <!--  </table>-->
    <!--</template>-->

  </div>
</template>

<script>
  import axios from 'axios'
  import XLSX from 'xlsx'
  import transformSheets from './js'    //导入转制函数

  export default {
    name: 'TaskList',
    props:{
      url:{
        type:String,
        default:''
      },
    },
    data: function () {
      return {
        contents: [],    //初始化数据
        err: ''
      }
    },
    created() {
      var url = this.url;  //放在public目录下的文件可以直接访问
      //读取二进制excel文件,参考https://github.com/SheetJS/js-xlsx#utility-functions
      axios.get(url, {responseType:'arraybuffer'})
        .then((res) => {
          var data = new Uint8Array(res.data);
          var wb = XLSX.read(data, {type:"array"})
          var sheets = wb.Sheets
          this.contents=[];
          for (let sheet in sheets) {
            let obj={};
            obj[sheet]=sheets[sheet];
            let arr=transformSheets(obj);
            console.log(arr);
            // arr.map((item,key)=>{
            //   let obj=item;
            //   arr.map((itemCol,keyCol)=>{
            //
            //   })
            // });
            this.contents.push(transformSheets(obj));
          }
          console.log(this.contents);
        }).catch( err =>{
        this.err = err
      })
    }
  }
</script>
<style scoped>
  table{
    width:100%;
  }
</style>

