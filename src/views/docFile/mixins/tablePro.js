import {request} from '@/network'
import store from "@/store";

export const tablePro = {
  data() {
    return {
      multipleSelection_pro: [],//记录复选框选中的项目信息
      rightData_pro: null,
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
    showEditButton_pro: function () {
      let {optionRole} = this.$store.state.stateMine.UsrRole;
      return optionRole.IsProUpdate;
    },
    showDelButton_pro: function () {
      let {optionRole} = this.$store.state.stateMine.UsrRole;
      return optionRole.IsProDel;
    },
  },
  methods: {
    cellClick_pro() {
    },
    rightClick_pro(arg) {
      let {row, column, event} = arg;
      this.rightData_pro = row;
      let menu = [
        {
          value: 'viewAttr_pro',
          label: '查看属性',
          disabled: false,
        },
        {
          value: 'copyAdd_pro',
          label: '复制添加',
          disabled: !this.showAddButton_pro,
        },
        {
          value: 'edit_pro',
          label: '编辑',
          disabled: !this.showEditButton_pro,
        },
        {
          value: 'del_pro',
          label: '删除',
          disabled: !this.showDelButton_pro,
        },
      ];
      this.$refs.rightMenu.openMenu(menu, event.pageX, event.pageY);

    },
    dbclickFun_pro(row, column, event) {
      let data = row.row;
      // 清空查询条件
      this.$set(this.search_item,'name','');
      this.$set(this.search_item,'code','');
      this.$set(this.search_item,'isHaveFile',false);
      this.$set(this.search_item,'haveVersion',false);
      // 展示条目列表
      this.reloadTableForThisPage_item(data.Id, data.Type, '', '', 1);
      // 条目标签获得焦点
      this.activeName = 'item';
    },
    // 点击查询
    searchFun_pro() {
      let {name, code} = this.search_pro;
      let {id, Type} = this.selection;
      this.reloadTableForThisPage_pro(id, Type, name, code, 1);
    },
    // 取消查询
    clearSeachFun_pro() {
      this.$set(this.search_pro, 'name', '');
      this.$set(this.search_pro, 'code', '');
      let {id, Type} = this.selection;
      this.reloadTableForThisPage_pro(id, Type, '', '', 1);
    },
    reloadTable_pro(page){
      let {name, code} = this.search_pro;
      let {id, Type} = this.selection;
      this.reloadTableForThisPage_pro(id, Type, name, code, page);
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
        if (res.reCode == 0) {
        let {title, data, limit} = res.reData;
          this.$set(this.tableData_pro, 'title', title);
          this.$set(this.tableData_pro, 'data', data);
          this.$set(this.tableData_pro, 'limit', limit);
          this.$set(this.tableData_pro, 'count', res.reCount);0.
        } else if (res.reCode==1){
          this.$current.alertMine(res.reMsg);
        }
      })
    },
    // 点击添加项目
    addProInfo() {
      let {OCFId, id} = this.selection;
      this.$set(this.proForm,'type','add');
      this.getProAttr(0, OCFId, id, 'add');
    },
    // 获取项目弹框的信息
    getProAttr(ProId, OCFId, id, type) {
      this.$set(this.proForm, 'ProId', ProId);
      this.$set(this.proForm, 'OCFId', OCFId);
      this.$set(this.proForm, 'pid', id);
      this.loading = this.$loading(this.$config.loadingStyle);
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
      }).catch(rej => {
        this.loading.close();
      })
    },
    // 点击批量删除
    delProsFun() {
      this.del_pro_type = 'table';
      if (this.multipleSelection_pro.length === 0) {
        this.$current.alertMine("当前无选中项，请选中后重试。");
        return false;
      }
      let ids = this.multipleSelection_pro.map(item => {
        return item.Id;
      });
      this.beforeDel_pro(ids.join(","));
    },
    // 删除前检测
    beforeDel_pro(ids) {
      this.loading = this.$loading(this.$config.loadingStyle);
      request({
        url: this.$collections.fileManager.checkDelPro,
        params: {
          ty: 'DelCheckProject',
          ProId: ids
        },
      }).then(res => {
        this.loading.close();
        if (res.reCode == 0) {
          this.$set(this.delModal_pro, 'show', true);//显示弹框
          this.$set(this.delModal_pro, 'tip', res.reMsg);//提示信息
          this.$set(this.delModal_pro, 'desc', '');//清空说明
        } else if (res.reCode == 1) {
          this.$set(this.delModal_pro, 'show', true);//显示弹框
          this.$set(this.delModal_pro, 'tip', res.reMsg);//提示信息
          this.$set(this.delModal_pro, 'desc', '');//清空说明
        }
      }).catch(rej => {
        this.loading.close();
      })
    },
    // 删除项目操作
    submit_del_pro_tree() {
      if (this.del_pro_type == 'tree') {
        let parentNode = this.rightNode_sideTree.parent;
        this.realDel_pro(this.rightNode_sideTree.id, this.delModal_pro.desc, parentNode);
      } else if (this.del_pro_type == 'table-right') {
        let arr = this.$current.searchNodeForTree('Type', this.rightData_pro.Type, this.tree_side_data, 'equal');
        let result;
        if (arr.length > 0) {
          let resultArr = arr.filter(item => item.id == this.rightData_pro.Id);
          result = resultArr.length > 0 ? resultArr[0] : null;
        }
        this.realDel_pro(this.rightData_pro.Id, this.delModal_pro.desc, result ? result.parent : null);
      } else {
        // 批量删除提交
        this.realDel_pro(this.multipleSelection_pro.map(item => {
          return item.Id
        }).join(','), this.delModal_pro.desc, this.selection);
      }

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
          ProId: type=='add'?0:ProId,
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
          this.refreshAllTables();
          // this.getTreeData().then((res) => {
          //   this.tree_side_data = res.reData;
          //   this.selection=null;
          //   this.rightNode_sideTree=null;
          // });
        } else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(rej => {
        this.loading.close();
      })
    },
    /**
     * 真正的删除操作
     * ids 需要删除的id 例1,2,3
     * desc 删除说明
     * parent 在树上的父节点，选填，如果传值，讲刷新父节点
     * */
    realDel_pro(ids, desc, parent) {
      this.loading = this.$loading(this.$config.loadingStyle);
      request({
        url: this.$collections.fileManager.delPro,
        params: {
          ty: 'DelProjectLstById',
          ProId: ids,
          DelNote: desc
        }
      }).then(res => {
        this.loading.close();
        if (res.reCode == 0) {
          this.$set(this.delModal_pro, 'show', false);
          // 去获取导航权限
          this.$current.alertMine(res.reMsg, () => {
            if (parent) {
              // 刷新树
              this.refreshTreeNode(parent);
              // 如果还有选中项,刷新右侧表格
              this.refreshAllTables();
            }
            // 如果还有选中项,刷新右侧表格
            this.refreshAllTables();
          });
        } else if (res.reCode == 1) {
          if (res.reData.data.length > 0) {
            this.$set(this.tipModal_current,'show',true);
            this.$set(this.tipModal_current,'type','proDel');
            this.$set(this.tipModal_current,'data',res.reData);
            this.$set(this.tipModal_current,'tip',res.reMsg);
            this.$set(this.tipModal_current,'successData',res.reData1);
            this.$set(this.delModal_pro,'show',false);
          } else {
            this.$current.alertMine(res.reMsg)
          }
        }
      }).catch(rej => {
        this.loading.close();
      })
    },
    // 获取归档范围
    getTreeTableData_GD_pro(){
      request({
        url:this.$collections.fileManager.getGDtreeTable,
        params:{
          ty:'GetProjArcScope',
          ProId:this.rightData_pro.Id,
        }
      }).then(res=>{
        if (res.reCode == 0){
          this.$set(this.viewAttrModal,'formContent4',res.reData);
        }else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      })
    },
  }
}
