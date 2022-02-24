import {request} from '@/network'
export const tableVol = {
  data(){
    return {
      tableData_vol:{
        title:[],
        data:[],
        limit:10,
        count:10,
        loading:false
      },
      search_vol:{
        name:'',//名称
        code:'',//编号
        isHaveFile:false,//是否包含电子文件
      }
    }
  },
  methods: {
    cellClick_vol(){},
    dbclickFun_vol(){},
    reloadTableForThisPage_vol(id,Type,searchName,searchCode,page){
      this.$set(this.tableData_item,'loading',true);
      request({
        url:this.$collections.fileManager.getTableItem,
        params:{
          ty:'GetProFileInfo_Auth',
          id:id,
          Type:Type,
          SearchName:searchName,
          SearchArchNo:searchCode,
          isSelection:true,//是否开启多选框
          page:page,
          ProId:0,
          isPro:0,//1项目列表，0条目列表
        }
      }).then(res=>{
        this.$set(this.tableData_item,'loading',false);

        if (res.reCode==0){
          let {title,data,limit}=res.reData;
          this.$set(this.tableData_item,'title',title);
          this.$set(this.tableData_item,'data',data);
          this.$set(this.tableData_item,'limit',limit);
          this.$set(this.tableData_item,'count',res.reCount);
        }else {
          let {title,data,limit}=res.reData;
          this.$set(this.tableData_item,'title',title);
          this.$set(this.tableData_item,'data',data);
          this.$set(this.tableData_item,'limit',limit);
          this.$set(this.tableData_item,'count',res.reCount);
          this.$set(this.tableData_item,'msg',res.reMsg);
        }
      })
    },
  }
}
