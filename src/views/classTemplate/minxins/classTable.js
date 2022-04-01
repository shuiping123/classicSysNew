import {request} from "@/network"

export const classTable = {
  data() {
    return {
      loading: null,
      rightData_table: null,//表格右键的行数据
      multipleSelection: [],//表格复选框选中的数据
      tableData: {
        title: [],
        data: [],
        msg: '',
        limit:10,
        count:10,
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
    },
  },
  methods: {
    // 右键表格
    rightClick_table(arg) {
      let {row, column, event} = arg;
      this.rightData_table = row;
      let  menu = [
        {
          value: 'edit_attr',
          label: '修改',
          disabled: false,
        },
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
        this.getTableData(this.selection.id, name, 1);
      }
    },
    // 取消搜索
    clearSeachFun() {
      this.$set(this.search, 'name', '');
      this.getTableData(this.selection.id, '', 1);
    },
    // 点击翻页的时候
    reloadTableForThisPage(page){
      let {name} = this.search;
      if (this.selection) {
        this.getTableData(this.selection.id, name, page);
      }
    },
    // 获取表格信息 AttrTypeId侧边选中的树id  AttrName名称模糊查询 pageNow当前页码
    getTableData(AttrTypeId,AttrName,pageNow) {
      this.$set(this.tableData, 'loading', true);
      this.rightData_table=null;
      this.multipleSelection = [];
      request({
        url: this.$collections.classTmp.getTableData,
        params: {
          ty: 'GetAttrTypeAttrLst',
          page:1,
          pageNow:pageNow,
          AttrName:AttrName,
          AttrTypeId:AttrTypeId,
          isSelection:true,
        },
      }).then(res => {
        this.$set(this.tableData, 'loading', false);
        if (res.reCode == 0) {
          let {data, title,limit} = res.reData;
          this.$set(this.tableData, 'data', data);
          this.$set(this.tableData, 'title', title);
          this.$set(this.tableData, 'limit', limit);
          this.$set(this.tableData, 'count', res.reCount);
        } else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(err => {
        this.$set(this.tableData, 'loading', false);
      })
    },

  },
};
