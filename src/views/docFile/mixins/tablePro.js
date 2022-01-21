import {request} from '@/network'
export const tablePro = {
  data(){
    return {
      tableData_pro:{
        title:[],
        data:[],
        limit:10,
        count:10
      },
      search_pro:{
        name:'',//名称
        code:'',//编号
      },
    }
  },
  methods: {
    cellClick_pro(){},
    dbclickFun_pro(row, column, event){
      let data=row.row;
      // 清空查询条件
      this.search_item={name:'',code:'',isHaveFile:false};
      // 展示条目列表
      this.reloadTableForThisPage_item(data.Id,data.Type,'','',1);
      // 条目标签获得焦点
      this.activeName='item';
    },
    reloadTableForThisPage_pro(id,Type,searchName,searchCode,page){
      this.$set(this.tableData_pro,'loading',true);
      request({
        url:this.$collections.fileManager.getTablePro,
        params:{
          ty:'GetProFileInfo_Auth',
          id:id,
          Type:Type,
          SearchName:searchName,
          SearchArchNo:searchCode,
          isSelection:true,//是否开启多选框
          page:page,
          ProId:0,
          isPro:1,//1项目列表，0条目列表
        }
      }).then(res=>{
        this.$set(this.tableData_pro,'loading',false);
        let {title,data,limit}=res.reData;
        if (res.reCode==0){
          this.$set(this.tableData_pro,'title',title);
          this.$set(this.tableData_pro,'data',data);
          this.$set(this.tableData_pro,'limit',limit);
          this.$set(this.tableData_pro,'count',res.reCount);
        }else {
          this.$set(this.tableData_pro,'title',title);
          this.$set(this.tableData_pro,'data',data);
          this.$set(this.tableData_pro,'limit',limit);
          this.$set(this.tableData_pro,'count',res.reCount);
          this.$set(this.tableData_pro,'msg',res.reMsg);
        }
      })
    },
  }
}
