<template>
  <div class="fullscreen-parent-mine docFile">
    <div class="form-inline fullscreen-parent-mine">
      <!--侧边栏-->
      <div v-Resizable="{minWidth:100,minHeight:'100%'}" style="width:200px;height:100%;overflow:auto">
        <el-card shadow="hover" class="fullscreen-parent-mine"
                 :body-style="{padding:'10px',width:'100%',height:'100%',overflow:'auto',display: 'flex'}"
                 style="border-radius: 0;">
          <!--树形图-->
          <div style="width:auto;height:auto;" @contextmenu.prevent>
            <Tree :data="tree_side_data"
                  ref="sideTree"
                  style="flex-shrink:0"
                  @nodeContextMenu="rightClickMenu($event)"
                  @nodeExpand="onNodeExpand($event)"
                  @nodeClick="nodeClickFun($event)"></Tree>
          </div>
        </el-card>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;" v-if="selection&&(selection.Type!='Folder'&&selection.Type!='CFolder')">
        <tab-mine :data="tabsList" :active_tab.sync="activeName"></tab-mine>
        <div style="flex:1;width:100%;">
          <!--项目表-->
          <table-content
            v-if="activeName=='pro'"
            filter="tablePro"
            @cell-click="cellClick_pro"
            @row-dbclick="dbclickFun_pro"
            @reloadTableForThisPage="reloadTableForThisPage_pro"
            :page_bottom="true"
            :page_head="true"
            :data="tableData_pro">
            <div slot="t_header">
              <div style="padding:7px 0" class="form-inline">
                <el-input v-model="search_pro.name" size="mini" class="tableInputText" placeholder="请输入名称"></el-input>
                <el-input v-model="search_pro.code" size="mini" class="tableInputText" placeholder="请输入项目编号"></el-input>
                <el-button type="primary" icon="el-icon-search" size="mini" class="tableInputCircleBtn" circle plain></el-button>
                <el-button type="primary" icon="el-icon-close" size="mini" class="tableInputCircleBtn" circle plain></el-button>
                <el-button type="primary" size="mini" class="tableInputBtn" plain>添加</el-button>
                <el-button type="danger" size="mini" class="tableInputBtn" plain>批量删除</el-button>
              </div>
            </div>
          </table-content>
          <!--条目表-->
          <table-content
            v-if="activeName=='item'"
            filter="tableItem"
            @cell-click="cellClick_item"
            @row-dbclick="dbclickFun_item"
            @reloadTableForThisPage="reloadTableForThisPage_item"
            :page_bottom="true"
            :page_head="true"
            :data="tableData_item">
            <div slot="t_header">
              <div style="padding:7px 0;align-items: center;" class="form-inline">
                <el-input v-model="search_item.name" size="mini" class="tableInputText" placeholder="请输入名称"></el-input>
                <el-input v-model="search_item.code" size="mini" class="tableInputText" placeholder="请输入条目编号"></el-input>
                <el-checkbox v-model="search_item.isHaveFile" size="mini" class="tableInputCheck">包含电子文件</el-checkbox>
                <el-button type="primary" icon="el-icon-search" size="mini" class="tableInputCircleBtn" circle plain></el-button>
                <el-button type="primary" icon="el-icon-close" size="mini" class="tableInputCircleBtn" circle plain></el-button>
                <el-button type="primary" size="mini" class="tableInputBtn" plain>添加</el-button>
                <el-button type="danger" size="mini" class="tableInputBtn" plain>批量删除</el-button>
              </div>
            </div>
          </table-content>
          <!--卷内件-->
          <table-content
            v-if="activeName=='vol'"
            filter="tableVol"
            @cell-click="cellClick"
            @row-dbclick="dbclickFun"
            @reloadTableForThisPage="reloadTableForThisPage_pro"
            :page_bottom="true"
            :page_head="true"
            :data="tableData_pro">
            <div slot="t_header">
              <div style="height: 30px">

              </div>
            </div>
          </table-content>
          <!--电子文件-->
          <table-content
            v-if="activeName=='file'"
            filter="tableFile"
            @cell-click="cellClick"
            @row-dbclick="dbclickFun"
            @reloadTableForThisPage="reloadTableForThisPage_pro"
            :page_bottom="true"
            :page_head="true"
            :data="tableData_pro">
            <div slot="t_header">
              <div style="height: 30px">

              </div>
            </div>
          </table-content>
        </div>
      </div>
    </div>

    <!--右键菜单 树形图-->
    <right-menu ref="rightMenu"/>
  </div>
</template>

<script>
  import tableContent from "@/components_coment/tableContent";
  import tabMine from "@/components_coment/tabMine";
  import rightMenu from "@/components_coment/rightMenu";

  import {tablePro} from './mixins/tablePro'
  import {tableItem} from './mixins/tableItem'
  import {tree} from './mixins/tree'
  import {navTabs} from './mixins/navTabs'

  export default {
    name: "index",
    components: {tableContent, tabMine,rightMenu},
    mixins: [tablePro,tableItem, tree, navTabs],
    data() {
      return {}
    },
    mounted() {
    },
    methods: {},
  }
</script>

<style scoped>

</style>
<style>
  .tableInputText {
    width: 120px;
    margin-left: 5px!important;

  }
  .tableInputCircleBtn{
    margin-left: 5px!important;
  }
  .tableInputBtn{
    margin-left: 5px!important;
  }
  .tableInputCheck{
    margin-left: 5px!important;
  }
</style>

