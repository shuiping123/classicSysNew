import {request} from "@/network";

export const powerTableData={
  data(){
    return {
      tableData:{
        title:[],
        data:[],
        msg:' ',
        loading:false,
      },
      currentTable:null,
      multipleSelection:[],//复选框选中的数据
      rightClick_powerList:null,//权限列表，当前右键的值
      rightPowerTree:{
        loading:false,
        data:[],
      },//右侧  操作权限的树形数据
    }
  },
  computed: {
    showOptionButton(){
      let {optionRole} = this.$store.state.stateMine.UsrRole;
      return optionRole.IsSysSet;
    }
  },
  methods: {
    // 右键表格
    rightClick(arg){
      let {row, column, event} = arg;
      this.rightClick_powerList=row;
      // 显示右键菜单
      let menu = [
        {
          value: 'edit',
          label: '修改权限',
        },
        {
          value: 'del',
          label: '删除',
        },
      ];
      this.$refs.rightMenu.openMenu(menu, event.pageX, event.pageY);
    },
    // 高亮项发生改变
    currentChange(row){
      this.currentTable=row;
      if (row){
        this.getRightPowerTreeData(row.AuthId);
      }
    },
    // 获取  下方  已有权限列表  表格数据
    getTableData(id,type){
      this.$set(this.tableData,'loading',true);
      request({
        url:this.$collections.powerRole.tableAjax,
        params:{
          ty:'GetAuthLst',
          UsrId:id,
          DepId:id,
          type:type
        }
      }).then(res=>{
        this.$set(this.tableData,'loading',false);
        if (res.reCode!=2){
          let {title,data,msg} =res.reData;
          this.$set(this.tableData,'data',data);
          this.$set(this.tableData,'title',title);
          this.$set(this.tableData,'msg',msg);
          if (data.length > 0) {
            this.$refs.powerList_already.setCurrentRow(data[0]);
          }else {
            this.$refs.powerList_already.setCurrentRow(null);
          }
        }
      }).catch(rej => {this.$set(this.tableData,'loading',false);})
    },
    // 获取  右侧 操作权限 树形图数据
    getRightPowerTreeData(AuthId){
      this.$set(this.rightPowerTree,'loading',true);
      request({
        url:this.$collections.powerRole.rightPower,
        params:{
          ty:'GetHasAuthLst',
          AuthId:AuthId
        }
      }).then(res=>{
        this.$set(this.rightPowerTree,'loading',false);
        if (res.reCode == 0){
          this.$set(this.rightPowerTree,'data',res.reData);
        }else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(rej=>{this.$set(this.rightPowerTree,'loading',false);})
    },
    // 点击添加权限
    addPower(){
      this.$set(this.powerModal,'show',true);
      this.getChooseClassTreeData();//获取选择分类的树形图节点
      this.getMjDataFun();//获取全部密级列表
    },
    // 删除前确认
    isDetermineDel(AuthId,OCATId){
      if (!AuthId){
        this.$current.alertMine('当前无选中项，请选中后重试。');
        return false;
      }
      let {type,id} = this.userSelection;
      if (type=='Dep'){
        this.$set(this.beforeDelPower,'show',true);//显示弹框
        this.$set(this.beforeDelPower,'range',0);//
        this.$set(this.beforeDelPower,'power',0);//
        this.$set(this.beforeDelPower,'AuthId',AuthId);//
        this.$set(this.beforeDelPower,'OCATId',OCATId);//
        return false;
      }
      this.$current.confirmMine('提示信息','是否确认删除权限？',()=>{
        this.realDelFun(type,AuthId,0,0,OCATId,id);
      })
    },
    // 批量删除
    realDelFun(type,AuthId,isDelAll,isDelSame,OCATId,treeId){
      this.loading=this.$loading(this.$config.loadingStyle);
      request({
        url:this.$collections.powerRole.delPower,
        params:{
          ty:'DelUsrAuthLst',
          AuthId:AuthId,
          isDelAll:isDelAll,
          isDelSame:isDelSame,
          OCATId:OCATId,
          type:type,
          UsrId:treeId,
          DepId:treeId,
        },
      }).then(res=>{
        this.loading.close();
        if (res.reCode == 0){
          if (type=='Dep'){
            this.$set(this.beforeDelPower,'show',false);
          }
          this.$current.alertMine(res.reMsg);
          this.getTableData(this.userSelection.id,this.userSelection.type);
        }else if (res.reCode ==1){
          this.$current.alertMine(res.reMsg);
        }
      }).catch(err=>{
        this.loading.close();
      });
    },
  },
};
