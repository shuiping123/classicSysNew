import {request} from "@/network";

export const viewTmpModal = {
  data() {
    return {
      loading: null,
      attrsList: {
        data: [],//当前的全部项
        value: [],//当前的选中项
        // 第一个弹框相关
        chooseAttr: {
          show: false,
        },
        // 第二个弹框相关
        attrList: {
          show: false,
        }
      },
      viewTmpModal: {
        show: false,
        type: 'add',
        name: '',
      }
    }
  },
  methods: {
    // 选择右键菜单
    changeMenu(node) {
      let clickNode = node[node.length - 1];
      if (!clickNode) return false;
      let row = this.rightData_table;
      let treeNode = this.rightData_tree;
      switch (clickNode) {
        // 添加显示模板
        case 'add_view':
          this.$set(this.viewTmpModal, 'name', '');
          this.$set(this.viewTmpModal, 'show', true);
          this.$set(this.viewTmpModal, 'type', 'add');
          break;
        // 修改显示模板
        case 'edit_view':
          this.$set(this.viewTmpModal, 'name', treeNode.text);
          this.$set(this.viewTmpModal, 'show', true);
          this.$set(this.viewTmpModal, 'type', 'edit');
          break;
        // 修改属性设置 表格右键修改
        case 'edit_attrSetting':
          this.$set(this.attrsList.attrList, 'show', true);
          this.$set(this.attrsList, 'value', [{
            id:row.AttrId,
            text: row.AttrName,
            isRequired: row.Required==1,//必填
            isEdit: row.Edit==1,//是否可修改
            isDisabled: row.DisplayPop==1,//是否禁用
            showInAttrTable: row.DisplayAttr==1,//是否可在属性表查看
            sort: row.Sort,//属性查看
          }]);
          break;
        // 无效点击
        default:
          this.$current.alertMine("无效的点击事件。");
          return false;
      }
    },
    // 打开添加弹框
    openAddModal() {
      this.getViewTmpSelectData();
    },
    // 点击批量修改
    batchEditFun(){
      this.$set(this.attrsList.attrList,'show',true);
      this.$set(this.attrsList, 'value', this.multipleSelection.map(item=>{
        return {
          id:item.AttrId,
          text: item.AttrName,
          isRequired: item.Required==1,//必填
          isEdit: item.Edit==1,//是否可修改
          isDisabled: item.DisplayPop==1,//是否禁用
          showInAttrTable: item.DisplayAttr==1,//是否可在属性表查看
          sort: item.Sort,//属性查看
        }
      }));
    },
    // 获取全部显示模板 弹框内
    getViewTmpSelectData() {
      request({
        url: this.$collections.viewTmp.getChooseViewLst,
        params: {
          ty: 'GetAttrAllOrNoAdd',
          AttrTypeId: this.selection.AttrTypeId,
          TmpId: this.selection.id,
        }
      }).then(res => {
        if (res.reCode == 0) {
          this.$set(this.attrsList, 'data', [
            {
              id: null,
              text: '全选',
              children: res.reData.map(item => {
                return {
                  id: item.AttrId,
                  text: item.AttrName,
                  isRequired: false,//必填
                  isEdit: false,//是否可修改
                  isDisabled: false,//是否禁用
                  showInAttrTable: false,//是否可在属性表查看
                  sort: 1000,//属性查看
                }
              })
            }
          ]);
          this.$set(this.attrsList, 'value', []);
          if (res.reData.length > 0) {
            this.$set(this.attrsList.chooseAttr, 'show', true);
          } else {
            this.$current.alertMine("此分类模板下，已无可用属性。");
          }
        } else {
          this.$current.alertMine(res.reMsg);
        }
      })
    },
    // 打开下一个弹框
    openNextModal() {
      if (this.attrsList.value.length > 0) {
        this.$set(this.attrsList.attrList, 'show', true);
      } else {
        this.$current.alertMine("当前无选中项，请选中后重试。")
      }
    },
    // 提交添加显示模板
    submitViewTmp() {
      this.loading = this.$loading(this.$config.loadingStyle);
      let TmpId = ()=>{
        if (this.viewTmpModal.type=='add'){
          return 0;
        }else {
          return this.rightData_tree.id;
        }
      };
      request({
        url: this.$collections.viewTmp.submitView,
        params: {
          ty: this.viewTmpModal.type=='add'?'AddAttrType_TmpLst':'EditAttrType_TmpLst',
          TmpId: TmpId(),
          TmpName: this.viewTmpModal.name,
          AttrTypeId: this.rightData_tree.id,
        }
      }).then(res => {
        this.loading.close();
        if (res.reCode == 0) {
          this.$current.alertMine(res.reMsg);
          this.$set(this.viewTmpModal, 'show', false);
          let data;
          if (this.viewTmpModal.type == 'add') {
            this.treeData.forEach((item, key) => {
              if (item.id == this.rightData_tree.id) {
                data = this.treeData[key].children;
              }
            });
            if (data.length > 0 && data[0].id != 0) {
              data.push(res.reData);
            } else {
              data.splice(0, data.length, res.reData);
            }
          } else {
            this.treeData.forEach((item, key) => {
              if (item.id == this.rightData_tree.parent.id) {
                data = this.treeData[key];
              }
            });
            this.$set(data, 'children', data.children.map(item => {
              if (item.id == this.rightData_tree.id) {
                item.text = res.reData.text;
                return item;
              }
              return item;
            }));
          }
        } else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(err => {
        this.loading.close();
      })
    },
    // 提交设置属性 即添加第二个弹框，或修改的弹框
    subSetAttr(){
      this.loading = this.$loading(this.$config.loadingStyle);
      request({
        url:this.$collections.viewTmp.subAttrSettings,
        params: {
          ty:'AddOrEditTmpAttrLst',
          TmpId:this.selection.id,
        },
        data:{
          attrLst:JSON.stringify(this.attrsList.value.map(item=>{
            return {i:item.id,r:item.isRequired?1:0,e:item.isEdit?1:0,p:item.isDisabled?1:0,a:item.showInAttrTable?1:0,s:item.sort}
          }))
        }
      }).then(res=>{
        this.loading.close();
        if (res.reCode==0){
          this.$current.alertMine(res.reMsg);
          this.searchFun();
          this.$set(this.attrsList.chooseAttr,'show',false);
          this.$set(this.attrsList.attrList,'show',false);
        }else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(err=>{
        this.loading.close();
      })
    },
  }
};
