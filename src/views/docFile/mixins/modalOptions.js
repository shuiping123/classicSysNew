import {request} from '@/network'

export const modalOptions = {
  data() {
    return {
      // 文件夹弹框相关
      folderForm: {
        id: '',// 当前修改的文件夹的id  添加时不验证，修改时需要写值
        type: 'add',//当前的操作形式 add添加 edit修改
        showFolderModal: false,//是否显示添加/修改文件夹弹框
        title: '添加文件夹',
        // 通用项
        formContent: [
          {
            name: '文件夹名称',
            prop: 'FolderName',
            show: true,
            required: true,
            edit: true,
            type: 'text',
            value: '',
            placeholder: '请输入文件夹名称',
            multiple: false,
            data: []
          },
          {
            name: '编号',
            prop: 'FolderCode',
            show: true,
            required: true,
            edit: true,
            type: 'text',
            value: '',
            placeholder: '请输入文件夹编号',
            multiple: false,
            data: []
          },
          {
            name: '密级',
            prop: 'ScrClsJson',
            show: true,
            required: true,
            edit: true,
            type: 'select',
            value: '',
            placeholder: '请选择',
            multiple: true,
            data: []
          },
          {
            name: '保管年限',
            prop: 'StorageId',
            show: true,
            required: true,
            edit: true,
            type: 'select',
            value: '',
            placeholder: '请选择',
            multiple: false,
            data: []
          },
          {
            name: '借阅天数',
            prop: 'FolderTotalDay_Brw',
            show: true,
            required: true,
            edit: true,
            type: 'number',
            value: '',
            placeholder: '',
            multiple: false,
            data: []
          },
          {
            name: '续借天数',
            prop: 'FolderTotalDay_Ren',
            show: true,
            required: true,
            edit: true,
            type: 'number',
            value: '',
            placeholder: '',
            multiple: false,
            data: []
          },
        ],
        // 联动项 或 特殊规则项
        other: {
          HavePro: 1,//是否存在项目
          AttrTypeId: [],//选择分类模板
          AttrTypeData: [],//选择分类模板数据
          showViewTmp: false,
          TmpIds: [],//模板
          TmpData: [],//模板数据


          proInfo: {
            title: '项目相关维护',
            showModal: false,
            multiple: [],
            multiple_pre: [],
            proTableData: [],
            proTableData_pre: [],
          },
          itemInfo: {
            title: '条目相关维护',
            showModal: false,
            multiple: [],
            multiple_pre: [],
            itemTableData: [],
            itemTableData_pre: [],
          }
        }
      },
      // 项目弹框相关
      proForm: {
        ProId: 0,// 当前修改的项目的id  添加时不验证，修改时需要写值
        pid:'',//父级id
        OCFId:'',//当前OCFId
        type: 'add',//当前的操作形式 add添加 edit修改
        showModal: false,//是否显示添加/修改项目弹框
        title: '添加项目',
        // 通用项
        formContent: [
          /**
          // {
          //   "name": "归档开始日期",//label显示
          //   "prop": "ProSDate",//对应字段
          //   "require": true,//是否必填
          //   "defvalue": null,//默认值
          //   "deftext": "",//暂不用
          //   "type": "date",//类型，txt/int/float/date/select/mulSelect
          //   "isdisable": false,//是否禁用
          //   "data": []//下拉菜单数据
          // }
           */
        ],
      },
    }
  },
  watch: {
    // 监听 是否存在项目，0时显示【显示模板】
    'folderForm.other.HavePro'(newVal) {
      this.$set(this.folderForm.other, 'showViewTmp', newVal == 0);
    },
  },
  computed: {
    showTmp: function () {
      let {type} = this.folderForm;
      return !!((type == 'add' && this.rightNode_sideTree && this.rightNode_sideTree.id == 1) || (type == 'edit' && this.rightNode_sideTree && this.rightNode_sideTree.OCFId == this.rightNode_sideTree.id));
    }
  },
  methods: {
    // 初始化，恢复默认设置 添加文件夹
    clearFolderModal(OCFId) {
      this.folderForm.formContent = this.folderForm.formContent.map(item => {
        item.value = ''
        return item;
      });
      this.$set(this.folderForm.other, 'HavePro', 1);
      this.getMjData(OCFId);// 密级下拉菜单
      this.getKeepDateData(OCFId);// 保管年限下拉菜单
      this.getTypeModuleData(OCFId, null, this.getViewTmpData([]));// 分类模板下拉菜单
      this.getFolderOptionInfo(OCFId, 1);// 项目相关维护信息
      this.getFolderOptionInfo(OCFId, 0);// 条目相关维护信息
    },
    // 获取密级下拉菜单
    getMjData(OCFId, defaultId) {
      request({
        url: this.$collections.fileManager.getMjData,
        params: {
          ty: 'GetSecretClassLst',
          OCFId: OCFId
        }
      }).then(res => {
        if (res.reCode == 0) {
          // 更新添加/修改文件夹 密级 数据
          this.$set(this.folderForm, 'formContent', this.folderForm.formContent.map(item => {
            if (item.prop == 'ScrClsJson') {
              item.data = res.reData;
              if (defaultId) {
                item.value = defaultId;
              } else {
                item.value = null;
              }
            }
            return item;
          }));

        } else {
          // 更新添加/修改文件夹 密级 数据
          this.$set(this.folderForm, 'formContent', this.folderForm.formContent.map(item => {
            if (item.prop == 'ScrClsJson') {
              item.data = [];
            }
            return item;
          }));
        }
      })
    },
    // 获取保管年限下拉菜单
    getKeepDateData(OCFId, defaultId) {
      request({
        url: this.$collections.fileManager.getDateData,
        params: {
          ty: 'GetStorageLst',
          OCFId: OCFId
        }
      }).then(res => {
        if (res.reCode == 0) {
          // 更新添加/修改文件夹 保管年限 数据
          this.$set(this.folderForm, 'formContent', this.folderForm.formContent.map(item => {
            if (item.prop == 'StorageId') {
              item.data = res.reData;
              if (defaultId) {
                item.value = defaultId;
              } else {
                item.value = null;
              }
            }
            return item;
          }));
        } else {
          // 更新添加/修改文件夹 保管年限 数据
          this.$set(this.folderForm, 'formContent', this.folderForm.formContent.map(item => {
            if (item.prop == 'StorageId') {
              item.data = [];
            }
            return item;
          }));
        }
      })
    },
    // 获取分类模板
    getTypeModuleData(OCFId, defaultId, callback) {
      request({
        url: this.$collections.fileManager.getTypeModuleData,
        params: {
          ty: 'GetAttrTypeLst',
          OCFId: OCFId
        }
      }).then(res => {
        if (res.reCode == 0) {
          // 更新添加/修改文件夹 分类模板 数据
          this.$set(this.folderForm.other, 'AttrTypeData', res.reData);
          if (defaultId) {
            this.$set(this.folderForm.other, 'AttrTypeId', defaultId)
          } else {
            this.$set(this.folderForm.other, 'AttrTypeId', [])
          }
          if (callback) {
            callback();
          }
        } else {
          // 更新添加/修改文件夹 分类模板 数据
          this.$set(this.folderForm.other, 'AttrTypeData', []);
        }
      })
    },
    // 获取显示模板
    getViewTmpData(AttrTypeId, defaultId) {
      request({
        url: this.$collections.fileManager.getViewTmpData,
        params: {
          ty: 'GetAttrTypeTmpLst',
          AttrTypeId: AttrTypeId.join(','),
        }
      }).then(res => {
        if (res.reCode == 0) {
          // 更新添加/修改文件夹 分类模板 数据
          this.$set(this.folderForm.other, 'TmpData', res.reData);
          if (defaultId) {
            this.$set(this.folderForm.other, 'TmpIds', defaultId)
          } else {
            this.$set(this.folderForm.other, 'TmpIds', [])
          }
        } else {
          // 更新添加/修改文件夹 分类模板 数据
          this.$set(this.folderForm.other, 'TmpData', []);
        }
      })
    },
    // 获得项目/条目 相关维护
    // OCFId 侧边栏树形图的选中项或右键选中项的OCFId
    // IsPro 1项目的title列表 0条目的title列表
    getFolderOptionInfo(OCFId, IsPro) {
      request({
        url: this.$collections.fileManager.getProInfo,
        params: {
          ty: 'GetOCFListDisplay',
          OCFId: OCFId,
          IsPro: IsPro
        }
      }).then(res => {
        if (res.reCode == 0) {
          if (IsPro == 1) {
            this.$set(this.folderForm.other.proInfo, 'proTableData', res.reData1);
            this.$set(this.folderForm.other.proInfo, 'proTableData_pre', res.reData);
          } else {
            this.$set(this.folderForm.other.itemInfo, 'itemTableData', res.reData1);
            this.$set(this.folderForm.other.itemInfo, 'itemTableData_pre', res.reData);
          }
        } else {
          if (IsPro == 1) {
            this.$set(this.folderForm.other.proInfo, 'proTableData', []);
            this.$set(this.folderForm.other.proInfo, 'proTableData_pre', []);
          } else {
            this.$set(this.folderForm.other.itemInfo, 'itemTableData', []);
            this.$set(this.folderForm.other.itemInfo, 'itemTableData_pre', []);
          }
        }
      })
    },
    // 复选框改变 选中项 项目
    changeSelectPro(val) {
      this.$set(this.folderForm.other.proInfo, 'multiple', val);
    },
    // 复选框改变 选中项 条目
    changeSelectItem(val) {
      this.$set(this.folderForm.other.itemInfo, 'multiple', val);
    },
    // 复选框改变 备选项 项目
    changeSelectPro_pre(val) {
      this.$set(this.folderForm.other.proInfo, 'multiple_pre', val);
    },
    // 复选框改变 备选项 条目
    changeSelectItem_pre(val) {
      this.$set(this.folderForm.other.itemInfo, 'multiple_pre', val);
    },
    // 移动到左侧显示列 direction移动方向，toLeft/toRight ， type pro/item
    removeList(direction, type, data) {
      if (direction == 'toLeft') {
        if (type == 'pro') {
          this.$set(this.folderForm.other.proInfo, 'proTableData', [...this.folderForm.other.proInfo.proTableData, ...data]);
          this.$set(this.folderForm.other.proInfo, 'proTableData_pre', this.folderForm.other.proInfo.proTableData_pre.filter(item => {
            return data.filter(dataItem => dataItem.AttrId == item.AttrId).length <= 0;
          }));
        } else {
          this.$set(this.folderForm.other.itemInfo, 'itemTableData', [...this.folderForm.other.itemInfo.itemTableData, ...data]);
          this.$set(this.folderForm.other.itemInfo, 'itemTableData_pre', this.folderForm.other.itemInfo.itemTableData_pre.filter(item => {
            return data.filter(dataItem => dataItem.AttrId == item.AttrId).length <= 0;
          }));
        }
      } else {
        if (type == 'pro') {
          this.$set(this.folderForm.other.proInfo, 'proTableData_pre', [...this.folderForm.other.proInfo.proTableData_pre, ...data]);
          this.$set(this.folderForm.other.proInfo, 'proTableData', this.folderForm.other.proInfo.proTableData.filter(item => {
            return data.filter(dataItem => dataItem.AttrId == item.AttrId).length <= 0;
          }));
        } else {
          this.$set(this.folderForm.other.itemInfo, 'itemTableData_pre', [...this.folderForm.other.itemInfo.itemTableData_pre, ...data]);
          this.$set(this.folderForm.other.itemInfo, 'itemTableData', this.folderForm.other.itemInfo.itemTableData.filter(item => {
            return data.filter(dataItem => dataItem.AttrId == item.AttrId).length <= 0;
          }));
        }
      }

    },
    // 上移 项目
    upRow(index, data, type) {
      if (type == 'pro') {
        this.folderForm.other.proInfo.proTableData.splice(index, 1);
        this.folderForm.other.proInfo.proTableData.splice(index == 0 ? 0 : index - 1, 0, data);
      } else {
        this.folderForm.other.itemInfo.itemTableData.splice(index, 1);
        this.folderForm.other.itemInfo.itemTableData.splice(index == 0 ? 0 : index - 1, 0, data);
      }
    },
    // 下移 项目
    downRow(index, data, type) {
      if (type == 'pro') {
        let length = this.folderForm.other.proInfo.proTableData;
        this.folderForm.other.proInfo.proTableData.splice(index, 1);
        this.folderForm.other.proInfo.proTableData.splice(index >= length - 1 ? length - 1 : index + 1, 0, data);
      } else {
        let length = this.folderForm.other.itemInfo.itemTableData;
        this.folderForm.other.itemInfo.itemTableData.splice(index, 1);
        this.folderForm.other.itemInfo.itemTableData.splice(index >= length - 1 ? length - 1 : index + 1, 0, data);
      }

    },
    // 提交 添加 文件夹
    submit_folder() {
      let data = {};
      this.folderForm.formContent.map(item => {
        data[item.prop] = item.value instanceof Array ? item.value.join(',') : item.value;
      });
      let proTableData = this.folderForm.other.proInfo.proTableData.map(item => {
        let obj = {
          id: item.AttrId,
          w: item.WithPx
        };
        return obj;
      });
      let itemTableData = this.folderForm.other.itemInfo.itemTableData.map(item => {
        let obj = {
          id: item.AttrId,
          w: item.WithPx
        };
        return obj;
      });
      if ((!data.ScrClsJson) || data.ScrClsJson.length == 0) {
        this.$current.alertMine("您未选择密级。");
        return false;
      }
      if (!data.StorageId) {
        this.$current.alertMine("您未选择保管期限。");
        return false;
      }
      if (this.showTmp && ((!this.folderForm.other.AttrTypeId) || this.folderForm.other.AttrTypeId.length == 0)) {
        this.$current.alertMine("您未选择分类模板。");
        return false;
      }
      if (this.showTmp && (this.folderForm.other.HavePro == 0 && ((!this.folderForm.other.TmpIds) || this.folderForm.other.TmpIds.length == 0))) {
        this.$current.alertMine("您未选择显示模板。");
        return false;
      }
      if (this.showTmp && proTableData.length == 0) {
        this.$current.alertMine("项目相关维护未添加。");
        return false;
      }
      if (this.showTmp && itemTableData.length == 0) {
        this.$current.alertMine("条目相关维护未添加。");
        return false;
      }

      request({
        url: this.$collections.fileManager.addFolder,
        params: Object.assign({
          ty: this.folderForm.type == 'add' ? 'AddFolderLst' : 'EditFolderLst',
          ParentFolderId: this.rightNode_sideTree.id,
          id: this.rightNode_sideTree.id,
          Type: '',
          HavePro: this.folderForm.other.HavePro,
          AttrTypeId: this.folderForm.other.AttrTypeId.join(','),
          TmpIds: this.folderForm.other.TmpIds.join(','),
          proTableData: JSON.stringify(proTableData),
          itemTableData: JSON.stringify(itemTableData),
        }, data),
      }).then(res => {
        if (res.reCode == 0) {
          this.$current.alertMine(res.reMsg);
          this.$set(this.folderForm, 'showFolderModal', false);
          // 树形图初始化
          this.getTreeData().then((res) => {
            this.tree_side_data = res.reData;
            this.selection=null;
            this.rightNode_sideTree=null;
          });
        } else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      })


    },
    // 获取项目弹框的信息
    getProAttr(ProId,OCFId,id,type){
      this.$set(this.proForm,'ProId',ProId);
      this.$set(this.proForm,'OCFId',OCFId);
      this.$set(this.proForm,'pid',id);
      request({
        url:this.$collections.fileManager.getProInfoForAdd,
        params:{
          ty:'GetProInfo',
          ProId:ProId,
          OCFId:OCFId,
          id:id
        }
      }).then(res => {
        if (res.reCode==0){
          this.$set(this.proForm,'type',type);
          this.$set(this.proForm,'showModal',true);
          this.$set(this.proForm,'title',type=='add'?'添加项目':'修改项目');
          this.$set(this.proForm,'formContent',res.reData.map(item=>{
            if (item.type == 'mulSelect'){
              item.defvalue=item.defvalue?item.defvalue.split(',').map(item=>{return parseInt(item)}):[];
            }
            return item;
          }));
        }else if (res.reCode==1){
          this.$current.alertMine(res.reMsg);
        }
      })
    },
    // 提交项目添加/修改
    submit_pro() {
      let {ProId,OCFId,pid,type}=this.proForm;
      let err=[];
      let extension = {};
      this.proForm.formContent.map(item => {
        if (item.require&&(!item.defvalue||(item.defvalue&&item.defvalue.length==0))){
          err.push(item.name);
        }
        extension[item.prop] = item.type === 'mulSelect'?item.defvalue.join(','):item.defvalue;
      });
      if (err.length>0){
        this.$current.alertMine(err.join(', ')+'未填写，请补全功能');
        return false;
      }
      request({
        url: this.$collections.fileManager.addOrEditPro,
        params: {
          ty: 'AddOrEditPro',
          ProId: ProId,
          id:pid,
          OCFId: OCFId,
          extension: JSON.stringify(extension),
        }
      }).then(res=>{
        if (res.reCode == 0){
          this.$current.alertMine(res.reMsg);
          this.$set(this.proForm,'showModal',false);
          // 树形图初始化
          this.getTreeData().then((res) => {
            this.tree_side_data = res.reData;
            this.selection=null;
            this.rightNode_sideTree=null;
          });
        }else if (res.reCode == 1){
          this.$current.alertMine(res.reMsg);
        }
      })
    },
  },
};
