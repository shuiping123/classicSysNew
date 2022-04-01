import {request} from "@/network";

export const depOptions = {
  data(){
    return {
      depModal: {
        show: false,//是否显示弹框
        type: 'add',
        name: '',
        code: '',
        chooseZY_document: [],//选择专业 文档专业
        chooseZY_img: [],//选择专业 图档专业
        ZYData: [],//专业下拉列表
      }
    }
  },
  methods: {
    // 打开添加部门
    openAddDep() {
      this.$set(this.depModal, 'show', true);
      this.$set(this.depModal, 'type', 'add');
      this.$set(this.depModal, 'name', '');
      this.$set(this.depModal, 'code', '');
      this.getZYData([],'depModal');
    },
    // 提交部门操作
    submitDepOption() {
      this.loading = this.$loading(this.$config.loadingStyle);
      let {type, name, code, chooseZY_document,chooseZY_img} = this.depModal;
      let ty = type == 'add' ? 'AddUsrDepLst' : 'EditUsrDepLst';
      let DepId=()=>{
        if (type=='add'){
          return 0;
        }else {
          return this.rightData_table.DepId
        }
      };
      request({
        url: this.$collections.depPage.submitDep,
        params: {
          ty: ty,
          DepId: DepId(),
          DepName: name,
          PDepId: this.selection.id,
          MajorId: chooseZY_document.join(','),
          Drw_MajorId: chooseZY_img.join(','),
          DepCode: code,
        }
      }).then(res => {
        this.loading.close();
        if (res.reCode == 0) {
          this.$current.alertMine(res.reMsg);
          this.$set(this.depModal, 'show', false);
          this.getTreeData(this.selection.id);
          this.searchFun();
        } else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(err => {
        this.loading.close();
      })
    },
    // 部门 删除前检测
    real_depDelCheckFun(id){
      this.loading = this.$loading(this.$config.loadingStyle);
      request({
        url:this.$collections.depPage.depDelCheck,
        params: {
          ty:'CheckBeforeDel',
          DepId:id
        }
      }).then(res => {
        this.loading.close();
        if (res.reCode==0){
          this.$current.confirmMine('提示信息',res.reMsg,()=>{
            this.real_depDelFun(id);
          });
        }else if (res.reCode == 1){
          this.$current.alertMine(res.reMsg);
        }
      }).catch(err => {
        this.loading.close();
      })
    },
    // 部门 删除
    real_depDelFun(id){
      this.loading = this.$loading(this.$config.loadingStyle);
      request({
        url:this.$collections.depPage.depDel,
        params:{
          ty:'DelUsrDepLst',
          DepId:id
        }
      }).then(res => {
        this.loading.close();
        if (res.reCode==0){
          this.$current.alertMine(res.reMsg);
          this.searchFun();
          this.getTreeData(this.selection.id)
        }else if (res.reCode == 1){
          this.$current.alertMine(res.reMsg);
        }
      }).catch(rej=>{
        this.loading.close();
      })
    },
  }
};
