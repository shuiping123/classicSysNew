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
    dbclickFun_vol(row){
      let data = row.row;
        // 需要清空查询条件并重新查询结果
        this.$set(this.search_file, 'name', '');
        this.reloadTableForThisPage_file(data.Id, data.Type, '', 1)
        // 标签联动
        this.$set(this.tabsList[3], 'show', true);// 打开电子文件标签
        this.activeName = this.tabsList[3].name;// 并激活电子文件标签
    },
    // 点击查询
    searchFun_vol(){
      let {name,code,isHaveFile} = this.search_vol;
      let {Id,Type} = this.dbclickData_item;
      this.reloadTableForThisPage_vol(Id,Type,name,code,1);
      // 如果选中了包含的电子文件
      if(isHaveFile){
        // 清空查询条件 电子文件
        this.$set(this.search_file,'name','');
        // 标签联动 开启电子文件标签
        this.$set(this.tabsList[3], 'show',true);
        // 查询结果 电子文件
        this.reloadTableForThisPage_file(Id,Type,'',1)
      }
    },
    // 取消查询
    clearSeachFun_vol(){
      // 清空查询条件 电子文件
      this.$set(this.search_vol, 'name','');
      this.$set(this.search_vol, 'code','');
      this.$set(this.search_vol, 'isHaveFile',false);
      let {Id,Type} = this.dbclickData_item;
      // 进行取消查询
      this.reloadTableForThisPage_vol(Id,Type,'','',1);
      // 标签联动 关闭电子文件标签
      this.$set(this.tabsList[3], 'show',false);
    },
    reloadTableForThisPage_vol(id,Type,searchName,searchCode,pageNow){
      this.$set(this.tableData_vol,'loading',true);
      request({
        url:this.$collections.fileManager.getTableVol,
        params:{
          ty:'GetVolItemInfo_Auth',
          id:id,
          Type:Type,
          SearchName:searchName,
          SearchArchNo:searchCode,
          isSelection:true,//是否开启多选框
          page:1,
          pageNow:pageNow,
          ProId:0,
          isPro:0,//1项目列表，0条目列表
        }
      }).then(res=>{
        this.$set(this.tableData_vol,'loading',false);

        if (res.reCode==0){
          let {title,data,limit}=res.reData;
          this.$set(this.tableData_vol,'title',title);
          this.$set(this.tableData_vol,'data',data);
          this.$set(this.tableData_vol,'limit',limit);
          this.$set(this.tableData_vol,'count',res.reCount);
        }else {
          let {title,data,limit}=res.reData;
          this.$set(this.tableData_vol,'title',title);
          this.$set(this.tableData_vol,'data',data);
          this.$set(this.tableData_vol,'limit',limit);
          this.$set(this.tableData_vol,'count',res.reCount);
          this.$set(this.tableData_vol,'msg',res.reMsg);
        }
      })
    },
  }
}
