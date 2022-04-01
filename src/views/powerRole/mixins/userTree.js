import {request} from "@/network";

export const userTree = {
  data(){
    return {
      userTree:[],//用户树形图数据
      userSelection:null,//用户树形图选中数据
    }
  },
  mounted(){
    // 初始化用户树
    this.getUserTreeData();
  },
  methods: {
    // 节点展开 懒加载
    onNodeExpand(event){
      let node = event;
      if (!(node.children && node.children.length>0)) {
        this.getUserTreeData(node);
      }
    },
    // 当选中项发生改变
    selectionChange(event){
      this.userSelection=event;
      if (event)
        this.getTableData(event.id,event.type);
    },
    // 加载树节点
    getUserTreeData(nowNode){
      let getId=()=>{
        if (nowNode)return nowNode.id;
        else return 0;
      };
      request({
        url: this.$collections.powerRole.userTree,
        params: {
          ty:'GetUsrAndDepLst',
          PDepId:getId()
        },
      }).then(res=>{
        if (res.reCode == 0){
          if (nowNode){
            if (res.reData.length>0) {
              this.$set(nowNode, "children", res.reData);
            } else {
              this.$set(nowNode, "children", [{id: null, text: "无下级目录", iconCls: 'ico_blank'}]);
              // this.$set(node, "iconCls", 'tree-folder');
              // this.$delete(node,'children');
              // this.$delete(node,'state');

              // this.$set(node, "state", 'open');
            }
          }else {
            this.userTree = res.reData;
            this.userSelection = null;
            this.$refs.userTree.selectNode(res.reData[0]);
          }

        }else if (res.reCode == 1){
          this.$current.alertMine(res.reMsg);
        }
      })
    },
  }
};
