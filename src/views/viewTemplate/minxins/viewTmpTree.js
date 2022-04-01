import {request} from "@/network";

export const viewTmpTree = {
  data() {
    return {
      treeData: [],
      treeLoading: false,//树loading
      rightData_tree: null,//当前右键的值
      selection: null,//当前选中的值
    }
  },
  mounted() {
    // 初始化部门树
    this.getTreeData();
  },
  methods: {
    // 当选中项发生改变的时候
    selectionChange(node) {
      this.selection = node;
      if (node) {
        this.$set(this.search, 'name', '');
        this.getTableData('', 1);
      }
    },
    // 当展开父级的时候 用于懒加载
    onNodeExpand() {
    },
    // 点击右键 用于调出右键菜单
    rightClickMenu(arg) {
      let {node, originalEvent} = arg;
      this.rightData_tree = node;
      let menu = [];
      // 显示右键菜单
      if (node.type == 'attr') {
        menu = [
          {
            value: 'add_view',
            label: '添加显示模板',
            disabled: false,
          },
        ];
      } else {
        menu = [
          {
            value: 'edit_view',
            label: '修改',
            disabled: false,
          },
        ];
      }
      this.$refs.rightMenu.openMenu(menu, originalEvent.pageX, originalEvent.pageY);
    },
    // 获取数据 侧边树 PDepId初始化时传0
    getTreeData() {
      //清空树上的选中项
      this.treeLoading = true;
      request({
        url: this.$collections.viewTmp.getTree,
        params: {
          ty: 'GetAttr_TmpLstTree',
        },
      }).then(res => {
        this.treeLoading = false;
        if (res.reCode == 0) {
          this.treeData = res.reData;
          if (this.selection) {
            this.$refs.classAndViewTree.selectNode(this.selection);
          }
        } else if (res.reCode == 1) {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(rej => {
        this.treeLoading = false
      })
    },
  }
};
