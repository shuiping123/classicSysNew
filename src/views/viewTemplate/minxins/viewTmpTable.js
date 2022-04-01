import {request} from "@/network"

export const viewTmpTable = {
  data() {
    return {
      loading: null,
      rightData_table: null,//表格右键的行数据
      multipleSelection: [],//表格复选框选中的数据
      tableData: {
        title: [],
        data: [],
        msg: '',
        limit: 10,
        count: 10,
        loading: false,
      },
      search: {
        name: '',//模糊查询名称
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
      let menu = [
        {
          value: 'edit_attrSetting',
          label: '修改',
          disabled: false,
        }
      ];
      this.$refs.rightMenu.openMenu(menu, event.pageX, event.pageY);

    },
    cellClick_table() {
    },
    dbclickFun_table() {
    },
    // 点击搜索
    searchFun() {
      let {name} = this.search;
      if (this.selection) {
        this.getTableData(name, 1);
      }
    },
    // 取消搜索
    clearSeachFun() {
      this.$set(this.search, 'name', '');
      this.getTableData('', 1);
    },
    // 获取表格信息 AttrName模糊查询 pageNow当前页码
    getTableData(AttrName, pageNow) {
      this.$set(this.tableData, 'loading', true);
      this.rightData_table = null;
      this.multipleSelection = [];
      request({
        url: this.$collections.viewTmp.getTableData,
        params: {
          ty: 'GetAttrTypeTmpRequiredLst',
          page: 1,
          pageNow: pageNow,
          TmpId: this.selection.id,
          AttrName: AttrName,
          isSelection: true
        },
      }).then(res => {
        this.$set(this.tableData, 'loading', false);
        if (res.reCode == 0) {
          let {data, title, limit} = res.reData;
          this.$set(this.tableData, 'data', data);
          this.$set(this.tableData, 'title', title);
          this.$set(this.tableData, 'limit', limit);
          this.$set(this.tableData, 'count', res.reCount);
          this.$set(this.tableData, 'msg', res.Msg);
        } else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(err => {
        this.$set(this.tableData, 'loading', false);
      })
    },
  },
};
