import {request} from "@/network";

export const depTree = {
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
      if (node){
        this.$set(this.search,'name','');
        this.$set(this.search,'type','1');
        this.getTableData(node.id,'','1');
      }
    },
    // 当展开父级的时候 用于懒加载
    onNodeExpand() {},
    // 点击右键 用于调出右键菜单
    rightClickMenu(arg) {
      let {node, originalEvent} = arg;
      this.rightData_tree = node;
    },
    // 获取数据 侧边树 PDepId初始化时传0
    getTreeData(PDepId) {
      //清空树上的选中项
      this.treeLoading = true;
      request({
        url: this.$collections.depPage.getTree,
        params: {
          ty: 'GetUsrDepMain',
          PDepId: PDepId ? PDepId : 0
        },
      }).then(res => {
        this.treeLoading = false;
        if (res.reCode == 0) {
          if (PDepId) {
            let node = this.$current.searchNodeForTree('id', PDepId, this.treeData, 'equal')[0];
            if (res.reData.length > 0) {
              this.$set(node, "children", res.reData);
            } else {
              this.$set(node, "children", [{id: null, text: "无下级部门", iconCls: 'ico_blank'}]);
            }
            if (this.selection) {
              this.$refs.depTree.selectNode(this.selection);
            }
          } else {
            this.treeData = res.reData;
            this.$refs.depTree.selectNode(res.reData[0]);
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
