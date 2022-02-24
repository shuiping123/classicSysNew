import {request} from '@/network'

export const tablePro = {
  data() {
    return {
      rightData_pro:null,
      tableData_pro: {
        title: [],
        data: [],
        limit: 10,
        count: 10
      },
      search_pro: {
        name: '',//名称
        code: '',//编号
      },
    }
  },
  computed: {
    showAddButton_pro: function () {
      let {optionRole} = this.$store.state.stateMine.UsrRole;
      return optionRole.IsProNew;
    },
    showEditButton_pro:function(){
      let {optionRole} = this.$store.state.stateMine.UsrRole;
      return optionRole.IsProUpdate;
    },
  },
  methods: {
    cellClick_pro() {
    },
    rightClick_pro(arg){
      let {row, column, event} = arg;
      this.rightData_pro=row;
      let {optionRole} = this.$store.state.stateMine.UsrRole;
      let menu=[
        {
          value: 'edit_pro',
          label: '编辑',
          disabled:!this.showEditButton_pro,
        },
        {
          value: 'del_pro',
          label: '删除',
          disabled:!optionRole.IsProDel,
        },
      ];
      this.$refs.rightMenu.openMenu(menu, event.pageX, event.pageY);

    },
    dbclickFun_pro(row, column, event) {
      let data = row.row;
      // 清空查询条件
      this.search_item = {name: '', code: '', isHaveFile: false};
      // 展示条目列表
      this.reloadTableForThisPage_item(data.Id, data.Type, '', '', 1);
      // 条目标签获得焦点
      this.activeName = 'item';
    },
    // 点击查询
    searchFun_pro(){
      let {name,code} = this.search_pro;
      let {id,Type} = this.selection;
      this.reloadTableForThisPage_pro(id,Type,name,code,1);
    },
    // 取消查询
    clearSeachFun_pro(){
      this.$set(this.search_pro, 'name','');
      this.$set(this.search_pro, 'code','');
      let {id,Type} = this.selection;
      this.reloadTableForThisPage_pro(id,Type,'','',1);
    },
    reloadTableForThisPage_pro(id, Type, searchName, searchCode, pageNow) {
      this.$set(this.tableData_pro, 'loading', true);
      request({
        url: this.$collections.fileManager.getTablePro,
        params: {
          ty: 'GetProFileInfo_Auth',
          id: id,
          Type: Type,
          SearchName: searchName,
          SearchArchNo: searchCode,
          isSelection: true,//是否开启多选框
          page: 1,
          pageNow: pageNow,
          ProId: 0,
          isPro: 1,//1项目列表，0条目列表
        }
      }).then(res => {
        this.$set(this.tableData_pro, 'loading', false);
        let {title, data, limit} = res.reData;
        if (res.reCode == 0) {
          this.$set(this.tableData_pro, 'title', title);
          this.$set(this.tableData_pro, 'data', data);
          this.$set(this.tableData_pro, 'limit', limit);
          this.$set(this.tableData_pro, 'count', res.reCount);
        } else {
          this.$set(this.tableData_pro, 'title', title);
          this.$set(this.tableData_pro, 'data', data);
          this.$set(this.tableData_pro, 'limit', limit);
          this.$set(this.tableData_pro, 'count', res.reCount);
          this.$set(this.tableData_pro, 'msg', res.reMsg);
        }
      })
    },
    // 点击添加项目
    addProInfo(){
      let {OCFId,id}=this.selection;
      this.getProAttr(0,OCFId,id,'add');
    },
    // 获取项目弹框的信息
    getProAttr(ProId, OCFId, id, type) {
      this.$set(this.proForm, 'ProId', ProId);
      this.$set(this.proForm, 'OCFId', OCFId);
      this.$set(this.proForm, 'pid', id);
      this.loading=this.$loading(this.$config.loadingStyle);
      request({
        url: this.$collections.fileManager.getProInfoForAdd,
        params: {
          ty: 'GetProInfo',
          ProId: ProId,
          OCFId: OCFId,
          id: id
        }
      }).then(res => {
        this.loading.close();
        if (res.reCode == 0) {
          this.$set(this.proForm, 'type', type);
          this.$set(this.proForm, 'showModal', true);
          this.$set(this.proForm, 'title', type == 'add' ? '添加项目' : '修改项目');
          this.$set(this.proForm, 'formContent', res.reData.map(item => {
            if (item.type == 'mulSelect') {
              item.defvalue = item.defvalue ? item.defvalue.split(',').map(item => {
                return parseInt(item)
              }) : [];
            }
            return item;
          }));
        } else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(rej=>{
        this.loading.close();
      })
    },
    // 提交项目添加/修改
    submit_pro() {
      let {ProId, OCFId, pid, type} = this.proForm;
      let err = [];
      let extension = {};
      this.proForm.formContent.map(item => {
        if (item.require && (!item.defvalue || (item.defvalue && item.defvalue.length == 0))) {
          err.push(item.name);
        }
        extension[item.prop] = item.type === 'mulSelect' ? item.defvalue.join(',') : item.defvalue;
      });
      if (err.length > 0) {
        this.$current.alertMine(err.join(', ') + '未填写，请补全功能');
        return false;
      }
      this.loading = this.$loading(this.$config.loadingStyle);
      request({
        url: this.$collections.fileManager.addOrEditPro,
        params: {
          ty: 'AddOrEditPro',
          ProId: ProId,
          id: pid,
          OCFId: OCFId,
          extension: JSON.stringify(extension),
        }
      }).then(res => {
        this.loading.close();
        if (res.reCode == 0) {
          this.$current.alertMine(res.reMsg);
          this.$set(this.proForm, 'showModal', false);
          // 树形图初始化
          this.refreshTreeNode(this.selection);
          // this.getTreeData().then((res) => {
          //   this.tree_side_data = res.reData;
          //   this.selection=null;
          //   this.rightNode_sideTree=null;
          // });
        } else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(rej=>{
        this.loading.close();
      })
    },


  }
}
