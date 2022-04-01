import {request} from "@/network";

export const modal = {
  data() {
    return {
      powerModal: {
        show: false,
        // 选择分类节点
        chooseClass: {
          search: {
            name: '',//模糊查询
          },
          loading: false,
          selection: null,//选中项
          data: [],//树形图数据
        },
        searchFileName_resultArr_usrPowerOption: [],// 选中分类节点 查找的名称后的结果集
        searchFileName_resultArr_this_usrPowerOption: 0,// 选中分类节点 查找的名称后的结果集 当前选中值
        // 选择操作权限
        choosePower: {
          loading: false,
          data: [],//树形图数据
          selection: [],//选中项
        },
        mjData: [],
        mj_checkbox:[],
        isOpenDate:false,
        startDate:'',
        endDate:'',
        isSetAll:0,
        btnType:"应用",//应用时，提交成功不关闭弹框，确定关闭弹框
        // 提交出错，报错信息 的弹框
        errTip:{
          show:false,
          tip:'',
          successData:'',
          data:{
            title:[],
            data:[],
            msg:''
          }
        },
      },
      beforeDelPower:{
        show:false,
        AuthId:'',
        OCATId:'',
        range:0,//删除范围
        power:0,//删除权限
      }
    }
  },
  mounted() {
    // 加载操作权限的树形图
    this.getPowerTreeData();
  },
  methods: {
    // 获取选择节点的树数据
    getChooseClassTreeData(OCATId) {
      this.$set(this.powerModal.chooseClass, 'loading', true);
      request({
        url: this.$collections.powerRole.getChooseClassTree,
        params: {
          ty: 'GetAuthFolderLst'
        },
      }).then(res => {
        this.$set(this.powerModal.chooseClass, 'loading', false);
        if (res.reCode == 0) {
          this.$set(this.powerModal.chooseClass, 'data', res.reData);
          if (OCATId) {
            let node= this.$current.searchNodeForTree('OCATId',OCATId,res.reData,'equal')[0];
            this.$refs.chooseClass.selectNode(node);
          } else {
            this.$refs.chooseClass.selectNode(res.reData[0]);
          }
        } else if (res.reCode == 1) {
          this.$set(this.powerModal.chooseClass, 'data', []);
          this.$current.alertMine(res.reMsg);
        }
      }).catch(err => {
        this.$set(this.powerModal.chooseClass, 'loading', false);
      })

    },
    // 选中项发生改变的时候 选择分类节点
    selectionChange_chooseClass(node) {
      this.$set(this.powerModal.chooseClass, 'selection', node);
      if (node) {
        this.checkedClear_usrPowerOption();//清空全部复选框
        this.getChoosedPowerData();//获取已有选择权限
      }
    },
    // 选择分类节点 - 查找定位 - 默认选中第一条
    search_fileTree_usrPowerOption() {
      // 如果为空，清空结果集
      let name = this.powerModal.chooseClass.search.name;
      if (!name) {
        this.searchFileName_resultArr_usrPowerOption = [];
        this.searchFileName_resultArr_this_usrPowerOption = 0;
        return false;
      }
      this.searchFileName_resultArr_usrPowerOption = this.$current.searchNodeForTree('text', name, this.powerModal.chooseClass.data, 'include');
      this.searchFileName_resultArr_this_usrPowerOption = 0;
      this.$refs.chooseClass.selectNode(this.searchFileName_resultArr_usrPowerOption[0])
    },
    // 选择分类节点 - 查找定位 - 上一条
    search_fileTree_toPre_usrPowerOption() {
      let data = this.searchFileName_resultArr_usrPowerOption;
      let thisOne = this.searchFileName_resultArr_this_usrPowerOption;
      if (data.length > 0 && thisOne > 0) {
        this.searchFileName_resultArr_this_usrPowerOption--;
        this.$refs.chooseClass.selectNode(data[this.searchFileName_resultArr_this_usrPowerOption])
      }
    },
    // 选择分类节点 - 查找定位 - 下一条
    search_fileTree_toNext_usrPowerOption() {
      let data = this.searchFileName_resultArr_usrPowerOption;
      let thisOne = this.searchFileName_resultArr_this_usrPowerOption;
      if (data.length > 0 && thisOne < (data.length - 1)) {
        this.searchFileName_resultArr_this_usrPowerOption++;
        this.$refs.chooseClass.selectNode(data[this.searchFileName_resultArr_this_usrPowerOption])
      }
    },
    // 获取操作权限的树数据  完整的权限树
    getPowerTreeData() {
      this.$set(this.powerModal.choosePower, 'loading', true);
      request({
        url: this.$collections.powerRole.getChoosePowerTree,
        params: {
          ty: 'GetFullAuthLst'
        },
      }).then(res => {
        this.$set(this.powerModal.choosePower, 'loading', false);
        if (res.reCode == 0) {
          this.$set(this.powerModal.choosePower, 'data', res.reData);
        } else if (res.reCode == 1) {
          this.$set(this.powerModal.choosePower, 'data', []);
          this.$current.alertMine(res.reMsg);
        }
      }).catch(err => {
        this.$set(this.powerModal.choosePower, 'loading', false);
      })

    },
    // 获取操作权限的数据 已选择的权限
    getChoosedPowerData() {
      this.$set(this.powerModal.choosePower, 'loading', true);
      request({
        url: this.$collections.powerRole.choosedPower,
        params: {
          ty: 'GetChooseAuth',
          OCATId: this.powerModal.chooseClass.selection.OCATId,
          UsrId: this.userSelection.id,
          DepId: this.userSelection.id,
          type: this.userSelection.type,
        },
      }).then(res => {
        this.$set(this.powerModal.choosePower, 'loading', false);
        if (res.reCode == 0) {
          for (let key in res.reData[0]) {
            // 判断是否在操作权限的树形图中查找到了值
            if (res.reData[0][key]){
              let node = this.$current.searchNodeForTree('AuthName',key,this.powerModal.choosePower.data,'equal')[0];
              this.$refs.choosePower.checkNode(node);
            }
          }
          this.powerModal.mj_checkbox=res.reData1[0].ScrClsJson?res.reData1[0].ScrClsJson.split(',').map(item=>{return parseInt(item)}):[];
          this.powerModal.isOpenDate=res.reData1[0].AuthSDate?true:false;//是否启用
          this.powerModal.startDate=res.reData1[0].AuthSDate;//开始日期
          this.powerModal.endDate=res.reData1[0].AuthEDate;//结束日期
        } else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(err => {
        this.$set(this.powerModal.choosePower, 'loading', false);

      })
    },
    // 选中项发生改变的时候 选择操作权限
    checkChange_choosePower(node) {
      this.$set(this.powerModal.choosePower, 'selection',node);
    },
    // 操作权限 - 全选
    checkedAllFun_usrPowerOption() {
      this.powerModal.choosePower.data.map(item => {
        this.$refs.choosePower.checkNode(item);
      })
    },
    // 操作权限 - 清空
    checkedClear_usrPowerOption() {
      this.$refs.choosePower.uncheckAllNodes();
    },
    // 获取密级复选框数据 - 第二个弹框
    getMjDataFun(){
      request({
        url: this.$collections.powerRole.getMjData,
        params: {ty: 'GetSecretClassLst'},
      }).then(res => {
        if (res.reCode == 0) {
          this.$set(this.powerModal,'mjData',res.reData);
        } else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
          this.$set(this.powerModal,'mjData',[]);
        }
      })
    },
    // 添加修改点击提交 setType是否覆盖 subType应用还是确定 OCATId如果传值使用传值，如果不传值，会自动使用选择分类选中节点的OCATId
    submitPowerOptionFun(setType,OCATId){
      let chooseClass = this.powerModal.chooseClass.selection;
      let choosePower = this.powerModal.choosePower.selection;
      let mjData = this.powerModal.mj_checkbox;
      let openData = this.powerModal.isOpenDate;
      let startDate = this.powerModal.startDate;
      let endDate = this.powerModal.endDate;
      let isSetAll = this.powerModal.isSetAll;
      // 判断是否启用日期
      if (openData){
        if ((!startDate)||(!endDate)){
          this.$current.alertMine("您已启用权限生效时间，请填写开始日期及结束日期！");
          return false;
        }
      }
      // 获取完整的权限列表
      let all = this.$current.searchNodeForTree('IsAuth','1',this.powerModal.choosePower.data,'equal')
      let obj={
        ScrClsJson:mjData.join(','),
        AuthSDate:openData?startDate:null,
        AuthEDate:openData?endDate:null,
      };
      // 权限赋值
      all.map(item=>{
        if (item.AuthName){
          obj[item.AuthName] = choosePower.filter(filterItem => {
            return filterItem.AuthName === item.AuthName
          }).length > 0;
        }
      });
      this.loading = this.$loading(this.$config.loadingStyle);
      request({
        url:this.$collections.powerRole.submitPower,
        params:{
          ty:'AddOrEditUsrAuthLst',
          type:this.userSelection.type,
          UsrId:this.userSelection.id,
          DepId:this.userSelection.id,
          OCATId:OCATId?OCATId:chooseClass.OCATId,
          SetType:setType,
          isSetAll:isSetAll,
          extension:JSON.stringify(obj),
        },
      }).then(res=>{
        this.loading.close();
        if (res.reCode==0){
          this.$current.alertMine(res.reMsg);
          this.getTableData(this.userSelection.id,this.userSelection.type);
          if (this.powerModal.btnType=="确定"){
            this.$set(this.powerModal,'show',false);
          }
        }else if (res.reCode == 1) {
          if (res.reData.data.length>0){
            this.$set(this.powerModal.errTip,'show',true);
            this.$set(this.powerModal.errTip,'tip',res.reMsg);
            this.$set(this.powerModal.errTip,'data',res.reData);
            this.$set(this.powerModal.errTip,'successData',res.reData1);
          }else {
            this.$current.alertMine(res.reMsg);
          }
        }
      }).catch(err=>{this.loading.close();})

    },
    // 点击右键菜单
    changeMenu(node){
      let clickNode = node[node.length - 1];
      if (!clickNode) return false;
      switch (clickNode){
        case 'edit':
          this.$set(this.powerModal,'show',true);
          this.getChooseClassTreeData(this.rightClick_powerList.OCATId);//获取选择分类的树形图节点
          this.getMjDataFun();//获取全部密级列表
          break;
        case 'del':
          this.isDetermineDel(this.rightClick_powerList.AuthId,this.rightClick_powerList.OCATId);
          break;
        default:
          this.$current.alertMine("请发请求，请重试。");
          return false;
      }
    },
    // 提交部门删除权限
    submitDelPower(){
      let {AuthId,OCATId,range,power} =this.beforeDelPower;
      this.realDelFun('Dep',AuthId,range,power,OCATId,this.userSelection.id);
    },
  },
};




