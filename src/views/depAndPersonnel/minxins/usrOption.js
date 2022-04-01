import {request} from "@/network";

export const usrOption = {
  data(){
    return {
      usrModal: {
        show: false,//是否显示弹框
        type: 'add',
        name: '',//姓名
        loginName:'',//登录名
        code: '',//编号
        email:'',//邮箱
        tel:'',//电话
        phone:'',//手机号
        chooseZY_document: [],//选择专业 文档专业
        chooseZY_img: [],//选择专业 图档专业
        ZYData: [],//专业下拉列表
        borrowNum:0,//借阅天数
        power:false,//是否开启审批流程权限
        disabled:false,//是否禁用
        language:'CN',//默认语言 CN中文 EN英文
      },
      delUsrModal:{
        show:false,
        searchName:'',//查询条件
        multipleSelection_delUsr:[],//表格复选框选中项
        tableData:{
          loading:false,
          title:[],
          data:[],
          msg:''
        },
      },
      personnelTransferModal:{
        show:false,
        selection:null,//选中项
        keepUsrPower:0,//保留用户已设置权限
      }
    }
  },
  methods: {
    // 点击添加用户
    openAddUsr(){
      this.$set(this.usrModal,'type','add');
      this.$set(this.usrModal,'show',true);
      this.$set(this.usrModal,'name','');
      this.$set(this.usrModal,'loginName','');
      this.$set(this.usrModal,'code','');
      this.$set(this.usrModal,'email','');
      this.$set(this.usrModal,'tel','');
      this.$set(this.usrModal,'phone','');
      this.getZYData([],'usrModal');
      this.$set(this.usrModal,'borrowNum',0);
      this.$set(this.usrModal,'power',0);
      this.$set(this.usrModal,'disabled',0);
    },
    // 提交用户 添加或修改
    submitUsrOption(){
      this.loading = this.$loading(this.$config.loadingStyle);
      let {type,name,loginName,code,chooseZY_document,chooseZY_img,email,tel,phone,language,power,disabled,borrowNum} = this.usrModal;
      request({
        url:this.$collections.depPage.submitUsr,
        params:{
          ty:type=='add'?'AddUsrLst':'EditUsrLst',
          UsrId:type=='add'?0:this.rightData_table.UsrId,
          DepId:this.selection.id,
          ADId:1,
          RoleId:type=='add'?'':this.rightData_table.RoleId,
          UsrName:loginName,
          UsrRealName:name,
          UsrState:disabled,
          UsrCardNo:code,
          UsrCardCode:code,
          UsrTel:tel,
          UsrMobile:phone,
          UsrMail:email,
          UsrLanguage:language,
          UsrHaveAppr:power,
          UsrAllowBrwNum:borrowNum,
          MajorId:chooseZY_document.join(','),
          Drw_MajorId:chooseZY_img.join(','),
        }
      }).then(res=>{
        this.loading.close();
        if (res.reCode == 0){
          this.$current.alertMine(res.reMsg);
          this.$set(this.usrModal,'show',false);
          this.searchFun();
        }else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(err=>{
        this.loading.close();
      })
    },
    // 删除用户
    real_delUsrFun(ids){
      this.loading = this.$loading(this.$config.loadingStyle);
      request({
        url:this.$collections.depPage.delUsr,
        params:{
          ty:'DelUsrLstByUsrId',
          UsrId:ids,
        },
      }).then(res=>{
        this.loading.close();
        if (res.reCode == 0){
          this.$current.alertMine(res.reMsg);
          this.searchFun();
        }else if (res.reCode == 1){
          this.$current.alertMine(res.reMsg);
        }
      }).catch(err=>{
        this.loading.close();
      })
    },
    // 点击表格头部 批量删除用户
    BatchDelUsrFun(){
      let data=this.multipleSelection;
      if (data.length == 0){
        this.$current.alertMine("当前无选中项，请选中后重试。");
        return false;
      }
      this.$current.confirmMine("提示信息","确定删除表格选框选中用户吗？",()=>{
        this.real_delUsrFun(data.map(item=>item.UsrId).join(','));
      })
    },
    // 批量禁用 state 1正常 0禁用
    batchDisabledUsrFun(state){
      let data=this.multipleSelection;
      if (data.length == 0){
        this.$current.alertMine("当前无选中项，请选中后重试。");
        return false;
      }
      this.$current.confirmMine("提示信息","确定禁用表格选框选中用户吗？",()=>{
        this.real_disabledUsrFun(data.map(item=>item.UsrId).join(','),state);
      })
    },
    // 禁用/取消禁用 state 1正常 0禁用
    real_disabledUsrFun(ids,state){
      this.loading = this.$loading(this.$config.loadingStyle);
      request({
        url:this.$collections.depPage.disabledUsr,
        params:{
          ty:'SetUsrState',
          UsrId:ids,
          UsrState:state,
        },
      }).then(res=>{
        this.loading.close();
        if (res.reCode == 0){
          this.$current.alertMine(res.reMsg);
          this.searchFun();
        }else if (res.reCode == 1){
          this.$current.alertMine(res.reMsg);
        }
      }).catch(err=>{
        this.loading.close();
      })
    },
    // 打开已删人员管理 弹框
    openDelUsrModal(){
      this.$set(this.delUsrModal,'show',true);
      this.$set(this.delUsrModal,'searchName','');
      this.getTableForDelUsr(this.selection.id,'');
    },
    // 获取已删人员管理的列表
    getTableForDelUsr(DepId,SearchName){
      this.$set(this.delUsrModal.tableData,'loading',true);
      request({
        url:this.$collections.depPage.getDelUsrTable,
        params: {
          ty:'GetDelteUsrLst',
          DepId:DepId,
          SearchName:SearchName,
        }
      }).then(res=>{
        this.$set(this.delUsrModal.tableData,'loading',false);
        if (res.reCode == 0){
          this.$set(this.delUsrModal.tableData,'title',res.reData.title);
          this.$set(this.delUsrModal.tableData,'data',res.reData.data);
        }else if (res.reCode == 1){
          this.$current.alertMine(res.reMsg);
        }
      }).catch(rej=>{
        this.$set(this.delUsrModal.tableData,'loading',false);
      })
    },
    // 已删人员管理 查询
    searchForDelUsrList(){
      this.getTableForDelUsr(this.selection.id,this.delUsrModal.searchName);
    },
    // 已删人员管理 取消查询
    clearSearchForDelUsrList(){
      this.$set(this.delUsrModal,'searchName','');
      this.getTableForDelUsr(this.selection.id,'');
    },
    // 点击恢复 恢复已删人员
    batchRecoveryUsrFun(){
      let data=this.delUsrModal.multipleSelection_delUsr;
      if (data.length === 0){
        this.$current.alertMine("当前无选中人员，请选中后重试。");
        return false;
      }
      this.$current.confirmMine('提示信息','请确定是否恢复选中用户？',()=>{
        request({
          url:this.$collections.depPage.recoveryUsr,
          params:{
            ty:'RecoverUsrByUsrId',
            UsrId:data.map(item =>item.UsrId).join(','),
          },
        }).then(res=>{
          if (res.reCode == 0){
            this.$current.alertMine(res.reMsg);
            this.searchForDelUsrList();
            this.searchFun();
          }else if (res.reCode == 1){
            this.$current.alertMine(res.reMsg);
          }
        }).catch(err=>{})
      })

    },
    // 点击彻底删除 彻底删除已删人员
    batchDeepDelUsrFun(){
      let data=this.delUsrModal.multipleSelection_delUsr;
      if (data.length === 0){
        this.$current.alertMine("当前无选中人员，请选中后重试。");
        return false;
      }
      this.$current.confirmMine('提示信息','彻底删除将无法恢复，请确定是否删除选中用户？',()=>{
        request({
          url:this.$collections.depPage.deepDelUsr,
          params:{
            ty:'DelUsrTrueByUsrId',
            UsrId:data.map(item =>item.UsrId).join(','),
          },
        }).then(res=>{
          if (res.reCode == 0){
            this.$current.alertMine(res.reMsg);
            this.searchForDelUsrList();
          }else if (res.reCode == 1){
            this.$current.alertMine(res.reMsg);
          }
        }).catch(err=>{})
      })

    },
    // 点击人员调转 打开弹框
    openPersonnelTransferModal(){
      let data=this.multipleSelection;
      if (data.length == 0){
        this.$current.alertMine("当前无选中项，请选中后重试。");
        return false;
      }
      this.$set(this.personnelTransferModal,'show',true);
      this.$set(this.personnelTransferModal,'keepUsrPower',0);
    },
    // 提交人员调转
    submitPersonnelTransfer(){
      let data=this.multipleSelection;
      if (!this.personnelTransferModal.selection){
        this.$current.alertMine("请选择调转部门后重试。");
        return false;
      }
      this.loading=this.$loading(this.$config.loadingStyle);
      request({
        url:this.$collections.depPage.personnelTransfer,
        params:{
          ty:'TransferUsrs',
          UsrId:data.map(item =>item.UsrId).join(','),
          TargetDepId:this.personnelTransferModal.selection.id,
          IsKeepAuth:this.personnelTransferModal.keepUsrPower,
        },
      }).then(res => {
        this.loading.close();
        if (res.reCode == 0){
          this.$current.alertMine(res.reMsg);
          this.searchFun();
          this.$set(this.personnelTransferModal,'show',false);
        }else if (res.reCode == 1){
          this.$current.alertMine(res.reMsg);
        }
      }).catch(err => {
        this.loading.close();
      })
    },
  }
};
