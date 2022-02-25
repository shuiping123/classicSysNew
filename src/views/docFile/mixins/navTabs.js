export const navTabs = {
  data() {
    return {
      activeName: 'pro',// 当前在选中状态的导航位置
      tabsList: [
        {name:'pro',label:'项目',showClose:false,show:true},
        {name:'item',label:'条目',showClose:false,show:true},
        {name:'vol',label:'卷内件',showClose:true,show:true},
        {name:'file',label:'电子文件',showClose:true,show:true},
      ]
    }
  },
  methods: {
    tabClickFun() {
    },
    // 刷新整个右侧表格
    refreshAllTables(){
      if (this.selection){
        // ============== 点击树形节点后加载表格 - 项目/条目 ===============
        let node=this.selection;
        // 初始化项目的查询条件 和 页码
        this.$set(this.search_pro,'name','');
        this.$set(this.search_pro,'code','');
        this.$set(this.search_item,'name','');
        this.$set(this.search_item,'code','');
        this.$set(this.search_item,'isHaveFile',false);
        this.$set(this.tabsList[2],'show',false);
        this.$set(this.tabsList[3],'show',false);
        this.reloadTableForThisPage_pro(node.id, node.Type,'','', 1);
        this.reloadTableForThisPage_item(node.id, node.Type,'','', 1);
        // 默认选中标签
        this.activeName=this.tabsList.filter(item=>item.show)[0].name;
        // ============== 点击树形节点后加载表格 - 项目/条目 ===============
      }
    }
  }
}
