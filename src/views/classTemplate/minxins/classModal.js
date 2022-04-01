import {request} from "@/network";

export const classModal = {
  data() {
    return {
      attrModal: {
        show: false,
        type: 'add',
        form: {
          nameCN: '',//中文名
          nameEN: '',//英文名
          propName: '',//字段名
          dataType: 'int',//数据类型
          strLength: 20,//当数据类型为字符型时，显示此条
          allowBeNull: 0,//是否允许为null 1允许 0不允许
          defaultVal: 1,//默认值
        },
      },
      classTmpModal: {
        type: 'add',
        show: false,
        form: {
          name: '',//分类模板名
          dataTableName: '',//数据表名
        }
      },
    }
  },
  computed: {
    disabledEditAttr() {
      return this.attrModal.type !== 'add';
    },
    disabledEditClass() {
      return this.classTmpModal.type !== 'add';
    }
  },
  methods: {
    // 选择右键菜单
    changeMenu(node) {
      let clickNode = node[node.length - 1];
      if (!clickNode) return false;
      let row = this.rightData_table;
      switch (clickNode) {
        // 添加分类模板
        case 'add_modules':
          this.$set(this.classTmpModal, 'show', true);
          this.$set(this.classTmpModal, 'type', 'add');
          this.$set(this.classTmpModal.form, 'name', '');
          this.$set(this.classTmpModal.form, 'dataTableName', '');
          break;
        // 修改模板
        case 'edit_module':
          this.$set(this.classTmpModal, 'show', true);
          this.$set(this.classTmpModal, 'type', 'edit');
          this.$set(this.classTmpModal.form, 'name', this.rightData_tree.text);
          this.$set(this.classTmpModal.form, 'dataTableName', this.rightData_tree.table_Name);
          break;
        // 修改属性
        case 'edit_attr':
          this.$set(this.attrModal, 'show', true);
          this.$set(this.attrModal, 'type', 'edit');
          this.$set(this.attrModal.form, 'nameCN', this.rightData_table.AttrName);
          this.$set(this.attrModal.form, 'nameEN', this.rightData_table.AttrName_Eng);
          this.$set(this.attrModal.form, 'propName', this.rightData_table.AttrFiledName);
          this.$set(this.attrModal.form, 'dataType', this.rightData_table.AttrDataType);
          this.$set(this.attrModal.form, 'strLength', this.rightData_table.AttrDataLen);
          this.$set(this.attrModal.form, 'allowBeNull', parseInt(this.rightData_table.AttrDataIsNull));
          this.$set(this.attrModal.form, 'defaultVal', this.rightData_table.AttrDataValue);
          break;
        // 无效点击
        default:
          this.$current.alertMine("无效的点击事件。");
          return false;
      }
    },
    // 打开弹框
    openAddAttr() {
      this.$set(this.attrModal, 'show', true);
      this.$set(this.attrModal, 'type', 'add');
      this.$set(this.attrModal.form, 'nameCN', '');
      this.$set(this.attrModal.form, 'nameEN', '');
      this.$set(this.attrModal.form, 'propName', '');
      this.$set(this.attrModal.form, 'dataType', 'int');
      this.$set(this.attrModal.form, 'strLength', 20);
      this.$set(this.attrModal.form, 'allowBeNull', 0);
      this.$set(this.attrModal.form, 'defaultVal', 1);
    },
    // 提交添加/修改属性操作
    submitAttrOption() {
      this.loading = this.$loading(this.$config.loadingStyle);
      let {nameCN, nameEN, propName, dataType, strLength, allowBeNull, defaultVal} = this.attrModal.form;
      let AttrId = () => {
        if (this.attrModal.type == 'add') {
          return 0;
        }
        return this.rightData_table.AttrId;
      };
      request({
        url: this.$collections.classTmp.submitAttr,
        params: {
          ty: this.attrModal.type == 'add' ? 'AddAttrLst' : 'EditAttrLst',
          AttrId: AttrId(),
          AttrTypeId: this.selection.id,
          AttrName: nameCN,
          AttrName_Eng: nameEN,
          AttrFiledName: propName,
          AttrDataType: dataType,
          AttrDataLen: strLength,
          AttrDataIsNull: allowBeNull,
          AttrDataValue: defaultVal,
        }
      }).then(res => {
        this.loading.close();
        if (res.reCode == 0) {
          this.$current.alertMine(res.reMsg);
          this.$set(this.attrModal, 'show', false);
          this.searchFun();
        } else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(rej => {
        this.loading.close();
      })
    },
    // 提交添加/修改分类模板操作
    submitClassModule() {
      this.loading = this.$loading(this.$config.loadingStyle);
      let {name, dataTableName} = this.classTmpModal.form;
      let AttrTypeId = () => {
        if (this.classTmpModal.type == 'add') {
          return 0;
        }
        return this.rightData_tree.id;
      };
      request({
        url: this.$collections.classTmp.submitAttr,
        params: {
          ty: this.classTmpModal.type == 'add' ? 'AddAttrTypeLst' : 'EditAttrTypeLst',
          AttrTypeId: AttrTypeId(),
          AttrTypeName: name,
          AttrTypeTable: dataTableName,
        }
      }).then(res => {
        this.loading.close();
        if (res.reCode == 0) {
          this.$current.alertMine(res.reMsg);
          this.$set(this.classTmpModal, 'show', false);
          let data = this.treeData[1].children;
          if (this.classTmpModal.type=='add'){
            if (data.length > 0&&data[0].id!=0) {
              data.push(res.reData);
            }else {
              data.splice(0,data.length,res.reData);
            }
          }else {
            let result = this.$current.searchNodeForTree('id',this.rightData_tree.id,this.treeData,'equal')[0];
            this.$set(result,'text',res.reData.text);
          }

        } else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(rej => {
        this.loading.close();
      })
    },
  }
};


