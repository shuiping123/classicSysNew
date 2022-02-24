import {request} from '@/network'

export const modalOptions = {
  data() {
    return {
      loading:null,//记录全局loading的对象，不能通过直接修改loading的方式触发
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
        pid: '',//父级id
        OCFId: '',//当前OCFId
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
      // 删除文件夹
      delModal_folder: {
        show: false,//删除文件夹的弹框是否显示
        desc: '',//删除说明
        tip: '',//提示信息
      },
      // 删除项目
      delModal_pro: {
        show: false,//删除项目的弹框是否显示
        desc: '',//删除说明
        tip: '',//提示信息
      },
      // 下级节点排序
      nodeSort: {
        show: false,//是否显示弹框
        data: [],//表格数据
      },
      // 条目弹框相关
      itemForm: {
        // 第一个弹框
        first: {
          havProShow: false,//是否显示弹框 有项目文件夹
          noProShow: false,//是否显示弹框 无项目文件夹
          // 选择分类
          chooseClsValue: '',//选择分类选中项
          // 选择分类数据
          chooseClsData: [],
          // 选择模板
          chooseTmpValue:'',
          // 选择模板数据
          chooseTmpData: [],
        },
        // 第二个弹框 正式要提交的弹框
        second: {
          show: false,//是否显示弹框
          type:'add',//添加add 修改edit
          data:{
            ClsId:'',
            TmpId:'',
          },
          formContent:[],//动态的提交条件
        },
      },
      // 删除条目
      delModal_item: {
        show: false,//删除项目的弹框是否显示
        desc: '',//删除说明
        tip: '',//提示信息
      },
      // 删除条目 批量删除
      delModal_items: {
        show: false,//删除项目的弹框是否显示
        desc: '',//删除说明
        tip: '',//提示信息
      },
    }
  },
  watch: {
    // 监听 是否存在项目，0时显示【显示模板】
    'folderForm.other.HavePro'(newVal) {
      this.$set(this.folderForm.other, 'showViewTmp', newVal == 0);
    },
    // 监听文本框 搜索选择分类的树
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {
    showTmp: function () {
      let {type} = this.folderForm;
      return !!((type == 'add' && this.rightNode_sideTree && this.rightNode_sideTree.id == 1) || (type == 'edit' && this.rightNode_sideTree && this.rightNode_sideTree.OCFId == this.rightNode_sideTree.id));
    }
  },
  methods: {
    // 点击右键菜单
    changeMenu(node) {
      let clickNode = node[node.length - 1];

      // console.log(111,this.rightNode_sideTree)
      // return false;
      switch (clickNode) {
        case 'addFolder':
          this.$set(this.folderForm, 'type', 'add');
          this.$set(this.folderForm, 'showFolderModal', true);
          this.$set(this.folderForm, 'title', '添加文件夹');
          this.clearFolderModal(this.rightNode_sideTree.OCFId);
          break;
        case 'addPro':
          this.getProAttr(0, this.rightNode_sideTree.OCFId, this.rightNode_sideTree.id, 'add');
          break;
        case 'edit':
          /// Folder=根目录，右侧不显示
          /// NoHPro=无项目文件夹，右侧显示条目标签
          /// HPro_Self=文件夹节点，其下有项目，项目用自己的归档范围，点击时：右侧刷新显示项目、条目列表；
          /// HPro_Public=文件夹节点，其下有项目,项目用公共的归档范围，点击时：右侧刷新显示项目、条目列表；
          if (this.rightNode_sideTree.Type == 'Folder' || this.rightNode_sideTree.Type == 'NoHPro' || this.rightNode_sideTree.Type == 'HPro_Self' || this.rightNode_sideTree.Type == 'HPro_Public') {
            let {OCFId, id} = this.rightNode_sideTree;

            // let {OCFId,id}=this.rightNode_sideTree;
            request({
              url: this.$collections.fileManager.getFolderInfo,
              params: {
                ty: 'GetFolderLstById',
                Id: id
              }
            }).then(res => {
              if (res.reCode == 0) {
                this.$set(this.folderForm, 'type', 'edit');
                this.$set(this.folderForm, 'showFolderModal', true);
                this.$set(this.folderForm, 'title', '修改文件夹');

                this.$set(this.folderForm, 'formContent', this.folderForm.formContent.map(item => {
                  switch (item.prop) {
                    case 'FolderName':
                      item.value = res.reData.FolderName;
                      break;
                    case 'FolderCode':
                      item.value = res.reData.FolderCode;
                      break;
                    // case 'ScrClsJson':
                    //   item.value=res.reData.ScrClsJson.split(',');
                    //   break;
                    // case 'StorageId':
                    //   item.value=res.reData.StorageId;
                    //   break;
                    case 'FolderTotalDay_Brw':
                      item.value = res.reData.FolderTotalDay_Brw;
                      break;
                    case 'FolderTotalDay_Ren':
                      item.value = res.reData.FolderTotalDay_Ren;
                      break;
                  }
                  return item;
                }));
                this.$set(this.folderForm.other, 'HavePro', res.reData.HavePro);
                this.$set(this.folderForm.other, 'id', res.reData.FolderId);
                this.getMjData(OCFId, res.reData.ScrClsJson.split(',').map(item => {
                  return parseInt(item)
                }));// 密级下拉菜单
                this.getKeepDateData(OCFId, res.reData.StorageId);// 保管年限下拉菜单
                this.getTypeModuleData(OCFId, res.reData.AttrTypeId.split(',').map(item => {
                  return parseInt(item)
                }), this.getViewTmpData(res.reData.AttrTypeId.split(','), res.reData.TmpIds.split(',')));// 分类模板下拉菜单
                this.$set(this.folderForm.other.proInfo, 'proTableData', res.reData1.proTableData);
                this.$set(this.folderForm.other.proInfo, 'proTableData_pre', res.reData1.proTableData_pre);
                this.$set(this.folderForm.other.itemInfo, 'itemTableData', res.reData1.itemTableData);
                this.$set(this.folderForm.other.itemInfo, 'itemTableData_pre', res.reData1.itemTableData_pre);
              } else {
                this.$current.alertMine(res.reMsg);
              }
            })
          } else {
            this.getProAttr(this.rightNode_sideTree.id, this.rightNode_sideTree.OCFId, 0, 'edit');
          }
          break;
        case 'edit_pro':
          // 项目表格功能区右键 点击编辑项目
          this.getProAttr(this.rightData_pro.Id, this.rightData_pro.OCFId, this.selection.id, 'edit');
          break;
        case 'edit_item':
          let {Id,ClsId,TmpId} = this.rightData_item;//当前修改条目的id
          let directNowId=this.search_item.id;//当前条目所在目录的id
          let directNowType=this.search_item.Type;//当前条目所在目录的Type
          this.getItemAttr_second(Id,directNowId,directNowType,ClsId,TmpId);
          break;
        case 'del_item':
          // 删除前检测
          this.beforeDel_item(this.rightData_item.Id,'rightDel');
          break;
        case 'del':
          // 如果是文件夹
          if (this.rightNode_sideTree.Type == 'Folder' || this.rightNode_sideTree.Type == 'NoHPro' || this.rightNode_sideTree.Type == 'HPro_Self' || this.rightNode_sideTree.Type == 'HPro_Public') {
            request({
              url: this.$collections.fileManager.checkDelFolder,
              params: {
                ty: 'DelCheckFolderLst',
                Type: this.rightNode_sideTree.Type,
                FolderId: this.rightNode_sideTree.id
              },
            }).then(res => {
              if (res.reCode == 0) {
                this.$set(this.delModal_folder, 'show', true);//显示弹框
                this.$set(this.delModal_folder, 'tip', res.reMsg);//提示信息
                this.$set(this.delModal_folder, 'desc', '');//清空说明
              } else if (res.reCode == 1) {
                this.$set(this.delModal_folder, 'show', true);//显示弹框
                this.$set(this.delModal_folder, 'tip', res.reMsg);//提示信息
                this.$set(this.delModal_folder, 'desc', '');//清空说明
              }
            })
          } else {
            this.del_pro_type='tree';
            // 如果是项目
            request({
              url: this.$collections.fileManager.checkDelPro,
              params: {
                ty: 'DelCheckProject',
                ProId: this.rightNode_sideTree.id
              },
            }).then(res => {
              if (res.reCode == 0) {
                this.$set(this.delModal_pro, 'show', true);//显示弹框
                this.$set(this.delModal_pro, 'tip', res.reMsg);//提示信息
                this.$set(this.delModal_pro, 'desc', '');//清空说明
              } else if (res.reCode == 1) {
                this.$set(this.delModal_pro, 'show', true);//显示弹框
                this.$set(this.delModal_pro, 'tip', res.reMsg);//提示信息
                this.$set(this.delModal_pro, 'desc', '');//清空说明
              }
            })
          }

          break;
        case 'refresh':
          this.refreshTreeNode(this.rightNode_sideTree)
          break;
        case 'sort':
          this.$set(this.nodeSort,'show',true);
          this.getNodeSortTable();
          break;
        case 'del_pro':
          this.del_pro_type='table';
          // 如果是项目
          request({
            url: this.$collections.fileManager.checkDelPro,
            params: {
              ty: 'DelCheckProject',
              ProId: this.rightData_pro.Id
            },
          }).then(res => {
            if (res.reCode == 0) {
              this.$set(this.delModal_pro, 'show', true);//显示弹框
              this.$set(this.delModal_pro, 'tip', res.reMsg);//提示信息
              this.$set(this.delModal_pro, 'desc', '');//清空说明
            } else if (res.reCode == 1) {
              this.$set(this.delModal_pro, 'show', true);//显示弹框
              this.$set(this.delModal_pro, 'tip', res.reMsg);//提示信息
              this.$set(this.delModal_pro, 'desc', '');//清空说明
            }
          })
          break;
        // 预览
        case 'view_file':
          this.openViewModal();
          break;
      }
    },
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
      } else if (type == 'item') {
        this.folderForm.other.itemInfo.itemTableData.splice(index, 1);
        this.folderForm.other.itemInfo.itemTableData.splice(index == 0 ? 0 : index - 1, 0, data);
      } else if (type == 'sort') {
        this.nodeSort.data.splice(index, 1);
        this.nodeSort.data.splice(index == 0 ? 0 : index - 1, 0, data);
      }
    },
    // 下移 项目
    downRow(index, data, type) {
      if (type == 'pro') {
        let length = this.folderForm.other.proInfo.proTableData.length;
        this.folderForm.other.proInfo.proTableData.splice(index, 1);
        this.folderForm.other.proInfo.proTableData.splice(index >= length - 1 ? length - 1 : index + 1, 0, data);
      } else if (type == 'item') {
        let length = this.folderForm.other.itemInfo.itemTableData.length;
        this.folderForm.other.itemInfo.itemTableData.splice(index, 1);
        this.folderForm.other.itemInfo.itemTableData.splice(index >= length - 1 ? length - 1 : index + 1, 0, data);
      } else if (type == 'sort') {
        let length = this.nodeSort.data.length;
        this.nodeSort.data.splice(index, 1);
        this.nodeSort.data.splice(index >= length - 1 ? length - 1 : index + 1, 0, data);
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
      this.loading = this.$loading(this.$config.loadingStyle);
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
        this.loading.close();//关闭loading
        if (res.reCode == 0) {
          this.$current.alertMine(res.reMsg);
          this.$set(this.folderForm, 'showFolderModal', false);
          // 树形图初始化
          this.refreshTreeNode(this.rightNode_sideTree)
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
    // 获取下级节点排序表格
    getNodeSortTable() {
      this.loading=this.$loading(this.$config.loadingStyle);
      request({
        url: this.$collections.fileManager.nodeSort,
        params: {
          ty: 'GetOneChildMain',
          id: this.rightNode_sideTree.id,
          Type: this.rightNode_sideTree.Type,
          OCFId: this.rightNode_sideTree.OCFId,
        }
      }).then(res => {
        this.loading.close();
        if (res.reCode == 0) {
          this.$set(this.nodeSort, 'data', res.reData);
        } else {
          this.$set(this.nodeSort, 'data', []);
        }
      }).catch(rej=>{
        this.loading.close();
      })
    },
    // 提交下级节点排序结果
    submit_nodeSort() {
      this.loading=this.$loading(this.$config.loadingStyle);
      request({
        url: this.$collections.fileManager.subNodeSort,
        params: {
          ty: 'SetMainSort',
          id: this.nodeSort.data.map(item => {
            return item.id;
          }).join(',')
        }
      }).then(res => {
        this.loading.close();
        if (res.reCode == 0) {
          this.$current.alertMine(res.reMsg);
          this.$set(this.nodeSort, 'show', false);
          this.refreshTreeNode(this.rightNode_sideTree);
        } else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(rej=>{
        this.loading.close();
      })
    },
    // 对树节点进行筛选
    filterNode_item(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

  },
};
