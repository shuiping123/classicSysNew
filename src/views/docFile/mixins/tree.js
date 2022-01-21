import {request} from '@/network'
import '@/assets/css/icon.css'

export const tree = {
  data() {
    return {
      tree_side_data: [],//树形结构的数据
      selection: null,//当前选中的节点
      rightNode_sideTree: null,//右键的节点
    };
  },
  watch: {
    // 根据当前树形节点的选中项，判断右侧标签的显示
    selection(newVal) {
      if (newVal&&newVal.Type!='Folder'&&newVal.Type!='CFolder') {
        let arr = [];//显示标签
        switch (newVal.Type) {
          /// NoHPro=无项目文件夹，右侧显示条目标签
          case 'NoHPro':
            arr = ['item'];
            break;
          /// HPro_Self=文件夹节点，其下有项目，项目用自己的归档范围，点击时：右侧刷新显示项目、条目列表；
          case 'HPro_Self':
            arr = ['pro', 'item'];
            break;
          /// HPro_Public=文件夹节点，其下有项目,项目用公共的归档范围，点击时：右侧刷新显示项目、条目列表；
          case 'HPro_Public':
            arr = ['pro', 'item'];
            break;
          /// Pro_Self=项目节点、用自己的归档范围，点击时：右侧刷新条目列表，关闭项目列表
          case 'Pro_Self':
            arr = ['item'];
            break;
          /// Pro_Public=项目节点、用公共的归档范围，点击时：右侧刷新条目列表，关闭项目列表
          case 'Pro_Public':
            arr = ['item'];
            break;
        }
        // 修改标签显示设置
        this.tabsList = this.tabsList.map((item, key) => {
          item.show = arr.filter(arrItem => arrItem == item.name).length > 0;
          return item;
        });
        // 修改默认选中标签
        let showTabs = this.tabsList.filter(item => item.show);
        this.activeName = showTabs[0].name;

      }
    },
  },
  mounted() {
    // 树形图初始化
    this.getTreeData().then((res) => {
      this.tree_side_data = res.reData;
      this.selection=null;
      this.rightNode_sideTree=null;
    });
  },
  methods: {
    // 右键节点,根据当前节点的Type和权限判断是否禁用菜单
    rightClickMenu(arg) {
      let {node, originalEvent} = arg;
      this.rightNode_sideTree = node;
      if (node.Type != 'CFolder') {
          let menu = [];
          let {optionRole}=this.$store.state.stateMine.UsrRole;
          switch (node.Type) {
            /// Folder=根文件夹，禁用添加项目
            case 'Folder':
              menu = [
                {
                  value: 'add',
                  label: '添加',
                  disabled: !optionRole.IsFolderNew,
                  children: [
                    {
                      value: 'addFolder',
                      label: '文件夹',
                      disabled: !optionRole.IsFolderNew,
                    },
                    {
                      value: 'addPro',
                      label: '项目',
                      disabled: 'disabled'
                    },
                  ]
                },
                {
                  value: 'edit',
                  label: '编辑',
                  disabled:true,
                },
                {
                  value: 'del',
                  label: '删除',
                  disabled:true,
                },
                {
                  value: 'refresh',
                  label: '刷新',
                },
                {
                  value: 'sort',
                  label: '下级节点排序',
                  disabled:!optionRole.IsFolderNew,
                },
              ];
              break;
            /// NoHPro=无项目文件夹,禁用添加项目
            case 'NoHPro':
              menu = [
                {
                  value: 'add',
                  label: '添加',
                  disabled: !optionRole.IsFolderNew,
                  children: [
                    {
                      value: 'addFolder',
                      label: '文件夹',
                      disabled: !optionRole.IsFolderNew,
                    },
                    {
                      value: 'addPro',
                      label: '项目',
                      disabled: 'disabled'
                    },
                  ]
                },
                {
                  value: 'edit',
                  label: '编辑',
                  disabled:!optionRole.IsFolderUpdate,
                },
                {
                  value: 'del',
                  label: '删除',
                  disabled:!optionRole.IsFolderDel,
                },
                {
                  value: 'refresh',
                  label: '刷新',
                },
                {
                  value: 'sort',
                  label: '下级节点排序',
                  disabled:!optionRole.IsFolderNew,
                },
              ];
              break;
            /// HPro_Self=文件夹节点
            case "HPro_Self":
              menu = [
                {
                  value: 'add',
                  label: '添加',
                  disabled:!optionRole.IsFolderNew&&!optionRole.IsProNew,
                  children: [
                    {
                      value: 'addFolder',
                      label: '文件夹',
                      disabled:!optionRole.IsFolderNew,
                    },
                    {
                      value: 'addPro',
                      label: '项目',
                      disabled:!optionRole.IsProNew,
                    },
                  ]
                },
                {
                  value: 'edit',
                  label: '编辑',
                  disabled:!optionRole.IsFolderNew,
                },
                {
                  value: 'del',
                  label: '删除',
                  disabled:!optionRole.IsFolderDel,
                },
                {
                  value: 'refresh',
                  label: '刷新',
                },
                {
                  value: 'sort',
                  label: '下级节点排序',
                  disabled:!optionRole.IsFolderNew,
                },
              ];
              break;
            // HPro_Public=文件夹节点
            case "HPro_Public":
              menu = [
                {
                  value: 'add',
                  label: '添加',
                  disabled:!optionRole.IsFolderNew&&!optionRole.IsProNew,
                  children: [
                    {
                      value: 'addFolder',
                      label: '文件夹',
                      disabled:!optionRole.IsFolderNew,
                    },
                    {
                      value: 'addPro',
                      label: '项目',
                      disabled:!optionRole.IsProNew,
                    },
                  ]
                },
                {
                  value: 'edit',
                  label: '编辑',
                  disabled:!optionRole.IsFolderUpdate,
                },
                {
                  value: 'del',
                  label: '删除',
                  disabled:!optionRole.IsFolderDel,
                },
                {
                  value: 'refresh',
                  label: '刷新',
                },
                {
                  value: 'sort',
                  label: '下级节点排序',
                  disabled:!optionRole.IsFolderNew,
                },
              ];
              break;
            /// Pro_Self=项目节点、用自己的归档范围，点击时：右侧刷新条目列表，关闭项目列表
            case "Pro_Self":
              menu = [
                {
                  value: 'add',
                  label: '添加',
                  disabled:'disabled',
                  children: [
                    {
                      value: 'addFolder',
                      label: '文件夹',
                      disabled:'disabled',
                    },
                    {
                      value: 'addPro',
                      label: '项目',
                      disabled:'disabled',
                    },
                  ]
                },
                {
                  value: 'edit',
                  label: '编辑',
                  disabled:!optionRole.IsProUpdate,
                },
                {
                  value: 'del',
                  label: '删除',
                  disabled:!optionRole.IsProDel,
                },
                {
                  value: 'refresh',
                  label: '刷新',
                },
                {
                  value: 'sort',
                  label: '下级节点排序',
                  disabled:!optionRole.IsFolderNew,
                },
              ];
              break;
            /// Pro_Public=项目节点
            case "Pro_Public":
              menu = [
                {
                  value: 'add',
                  label: '添加',
                  disabled:'disabled',
                  children: [
                    {
                      value: 'addFolder',
                      label: '文件夹',
                      disabled:'disabled',
                    },
                    {
                      value: 'addPro',
                      label: '项目',
                      disabled:'disabled',
                    },
                  ]
                },
                {
                  value: 'edit',
                  label: '编辑',
                  disabled:!optionRole.IsProUpdate,
                },
                {
                  value: 'del',
                  label: '删除',
                  disabled:!optionRole.IsProDel,
                },
                {
                  value: 'refresh',
                  label: '刷新',
                },
                {
                  value: 'sort',
                  label: '下级节点排序',
                  disabled:!optionRole.IsFolderNew,
                },
              ];
              break;
          }
          menu.push(node.isCollect ? {
            value: 'collect',
            label: '取消收藏',
          } : {
            value: 'collect',
            label: '收藏',
          });
          this.$refs.rightMenu.openMenu(menu, originalEvent.pageX, originalEvent.pageY);

      }
      // console.log(node);
      // console.log(this.folderRightMenuList);
      // if (this.folderRightMenuList.length > 0) {
      //   this.$refs.menu.show(originalEvent.pageX, originalEvent.pageY)
      // }
    },
    // 懒加载获取数据 - 展开按钮触发
    onNodeExpand(event) {
      let node = event;
      if (!node.children.length) {
        this.getTreeData(node).then(res => {
          if (res.reCode == 0) {
            if (res.reData.length) {
              this.$set(node, "children", res.reData);
            } else {
              this.$set(node, "children", [{id: null, text: "无下级目录", iconCls: 'ico_blank'}]);
            }
          } else if (res.reCode == 1) {
            this.$current.messageMine(res.reMsg, 'error');
          }
        });
      }
    },
    // 选中节点 - 选中节点触发
    nodeClickFun(node) {
      this.selection = node
      if (node.Type=='Folder'||node.Type=='CFolder'){
        return false;
      }
      if (node.id) {
        // ============== 点击树形节点后加载表格 - 项目 ===============
        // 初始化项目的查询条件 和 页码
        this.$set(this.search_pro,'name','');
        this.$set(this.search_pro,'code','');
        this.$set(this.search_item,'name','');
        this.$set(this.search_item,'code','');
        this.$set(this.search_item,'isHaveFile',false);
        this.reloadTableForThisPage_pro(node.id, node.Type, node.ProId,this.search_pro.name,this.search_pro.code, 1);
        this.reloadTableForThisPage_item(node.id, node.Type, node.ProId,this.search_pro.name,this.search_pro.code, 1);
        // 默认选中标签
        this.activeName=this.tabsList.filter(item=>item.show)[0].name;
        // ============== 点击树形节点后加载表格 - 项目 ===============

      }
    },
    // 获取数据
    getTreeData(nowNode) {
      let ty = 'GetMainLst_Auth';
      let data;
      if (nowNode) {
        // 懒加载
        data = {
          ty: ty,
          id: nowNode.id,
          Type: nowNode.Type,
        }
      } else {
        // 初始化
        this.selection = null;
        data = {
          ty: ty,
          id: 0,
          Type: 'Folder',
        }
      }
      return request({
        url: this.$collections.fileManager.sideTree,
        params: data,
      })
    },
  }
}
