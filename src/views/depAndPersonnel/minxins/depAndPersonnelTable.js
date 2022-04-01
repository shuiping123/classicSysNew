import {request} from "@/network"

export const depAndPersonnelTable = {
  data() {
    return {
      loading: null,
      rightData_table: null,//表格右键的行数据
      multipleSelection: [],//表格复选框选中的数据
      tableData: {
        title: [],
        data: [],
        msg: '',
        loading: false,
      },
      search: {
        name: '',//模糊查询名称
        type: '1',//选择分类 1全部 2仅部门 3仅用户
      },

    }
  },
  computed: {
    showOptionButton() {
      let {optionRole} = this.$store.state.stateMine.UsrRole;
      return optionRole.IsSysSet;
    }
  },
  methods: {
    // 右键表格
    rightClick_table(arg) {
      let {row, column, event} = arg;
      this.rightData_table = row;
      let menu = [];
      // 显示右键菜单
      if (row.DType == 'Dep') {
        menu = [
          {
            value: 'edit_dep_table',
            label: '修改',
            disabled: !this.showOptionButton,
          },
          {
            value: 'del_dep_table',
            label: '删除',
            disabled: !this.showOptionButton,
          },
        ];
      } else {
        menu = [
          {
            value: 'edit_usr',
            label: '修改',
            disabled: !this.showOptionButton,
          },
          {
            value: 'del_usr',
            label: '删除',
            disabled: !this.showOptionButton,
          },
        ];
      }
      this.$refs.rightMenu.openMenu(menu, event.pageX, event.pageY);

    },
    // 选择右键菜单
    changeMenu(node) {
      let clickNode = node[node.length - 1];
      if (!clickNode) return false;
      let row = this.rightData_table;
      switch (clickNode) {
        // 修改部门
        case 'edit_dep_table':
          this.$set(this.depModal, 'type', 'edit');
          this.$set(this.depModal, 'show', true);
          this.$set(this.depModal, 'name', row.Name);
          this.$set(this.depModal, 'code', row.UsrCardNo);
          this.getZYData(row.MajorId ? row.MajorId.split(',').map(item => {
            return parseInt(item)
          }) : [], 'depModal');
          break;
        // 删除部门
        case 'del_dep_table':
          this.real_depDelCheckFun(row.DepId);
          break;
        // 修改用户
        case 'edit_usr':
          this.$set(this.usrModal, 'type', 'edit');
          this.$set(this.usrModal, 'show', true);
          this.$set(this.usrModal, 'name', row.Name);
          this.$set(this.usrModal, 'loginName', row.UsrName);
          this.$set(this.usrModal, 'code', row.UsrCardNo);
          this.$set(this.usrModal, 'email', row.UsrMail);
          this.$set(this.usrModal, 'tel', row.UsrTel);
          this.$set(this.usrModal, 'phone', row.UsrMobile);
          this.getZYData(row.MajorId ? row.MajorId.split(',').map(item => {
            return parseInt(item)
          }) : [], 'usrModal');
          this.$set(this.usrModal, 'borrowNum', row.UsrAllowBrwNum);
          this.$set(this.usrModal, 'power', parseInt(row.UsrHaveAppr));
          this.$set(this.usrModal, 'disabled', parseInt(row.UsrState));
          this.$set(this.usrModal, 'language', row.UsrLanguage);
          break;
        // 删除用户
        case 'del_usr':
          this.$current.confirmMine('提示信息', '请确定是否删除此用户？', () => {
            this.real_delUsrFun(row.UsrId);
          });
          break;
        // 无效点击
        default:
          this.$current.alertMine("无效的点击事件。");
          return false;
      }
    },
    cellClick_table() {
    },
    dbclickFun_table() {
    },

    // 点击搜索
    searchFun() {
      let {name, type} = this.search;
      if (this.selection) {
        this.getTableData(this.selection.id, name, type);
      }
    },
    // 取消搜索
    clearSeachFun() {
      this.$set(this.search, 'name', '');
      this.$set(this.search, 'type', '1');
      this.getTableData(this.selection.id, '', '1');
    },
    // 获取表格信息 DepId左侧树选中项的id SearchName名称模糊查询 SearchType搜索全部/仅部              门/仅用户
    getTableData(DepId, SearchName, SearchType) {
      this.$set(this.tableData, 'loading', true);
      this.rightData_table=null;
      this.multipleSelection = [];
      request({
        url: this.$collections.depPage.getTableData,
        params: {
          ty: 'GetDepUsrLst',
          DepId: DepId,
          SearchName: SearchName,
          SearchType: SearchType,
          isSelection: true
        },
      }).then(res => {
        this.$set(this.tableData, 'loading', false);
        if (res.reCode == 0) {
          let {data, title} = res.reData;
          this.$set(this.tableData, 'data', data);
          this.$set(this.tableData, 'title', title);
        } else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(err => {
        this.$set(this.tableData, 'loading', false);
      })
    },
    // 获取专业下拉菜单 propData更新到什么里面，存放下拉菜单的数据的地方 chooseZY选中项的值
    // 此项封装性没有那么高，规定按照chooseZY和ZYData存值，且放在data最外层结构里
    getZYData(chooseZY, propData) {
      request({
        url: this.$collections.depPage.getZY,
        params: {
          ty: 'GetMajorLst'
        },
      }).then(res => {
        if (res.reCode == 0) {
          this.$set(this[propData], 'ZYData', res.reData);
          if (chooseZY&&chooseZY.length>0) {
            this.$set(this[propData], 'chooseZY_document', chooseZY);
            this.$set(this[propData], 'chooseZY_img', chooseZY);
          } else {
            this.$set(this[propData], 'chooseZY_document', []);
            this.$set(this[propData], 'chooseZY_img', []);
          }
        } else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      })
    },
  },
};
