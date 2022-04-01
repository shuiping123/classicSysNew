<template>
  <div id="viewTemplate" class="fullscreen-parent-mine">
    <div class="fullscreen-parent-mine form-inline content">
      <!--侧边栏-->
      <div v-loading="treeLoading" class="borderStyle" v-Resizable="{minWidth:100,minHeight:'100%'}">
        <div @contextmenu.prevent>
          <Tree :data="treeData"
                style="flex-shrink:0"
                ref="classAndViewTree"
                @nodeContextMenu="rightClickMenu($event)"
                @selectionChange="selectionChange($event)"
                @nodeExpand="onNodeExpand($event)"></Tree>
        </div>
      </div>
      <!--表格-->
      <div>
        <table-content
          v-if="selection&&selection.type=='view'&&selection.id!=0"
          filter="table"
          @rightClick="rightClick_table"
          @cell-click="cellClick_table"
          @row-dbclick="dbclickFun_table"
          @reloadTableForThisPage="(page)=>{getTableData(search.name,page)}"
          @handleSelectionChange="multipleSelection=$event"
          :page_bottom="true"
          :page_head="true"
          :data="tableData">
          <div slot="t_header">
            <div style="padding:7px 0" class="form-inline">
              <el-input v-model="search.name" size="mini" class="tableInputText" placeholder="请输入名称"></el-input>
              <el-button type="primary" icon="el-icon-search" size="mini" class="tableInputCircleBtn" circle
                         @click="searchFun"
                         plain></el-button>
              <el-button type="primary" icon="el-icon-close" size="mini" class="tableInputCircleBtn" circle
                         @click="clearSeachFun"
                         plain></el-button>
              <!--添加部门-->
              <el-button type="primary" size="mini" class="tableInputBtn" @click="openAddModal" plain>添加</el-button>
              <!--批量修改-->
              <el-button type="primary" size="mini" class="tableInputBtn" @click="batchEditFun" plain>批量修改</el-button>
            </div>
          </div>
        </table-content>
      </div>
    </div>

    <!--右键菜单 树形图-->
    <right-menu ref="rightMenu" @changeRightMenu="changeMenu"/>

    <!--点击树形图添加-->
    <el-dialog width="370px" :close-on-click-modal="false" :title="viewTmpModal.type=='add'?'添加显示模板':'修改'" :visible.sync="viewTmpModal.show">
      <form-mine ref="chooseAttr" @submit="submitViewTmp()" size="mini" label-width="80px">
        <form-item-mine label="名称 *">
          <el-input v-model="viewTmpModal.name" required size="mini" class="formWidth" placeholder="请输入内容"></el-input>
        </form-item-mine>
        <div style="width:100%;text-align: center">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(viewTmpModal,'show',false)">取消</el-button>
        </div>
      </form-mine>
    </el-dialog>

    <!--添加属性 选择属性 点击表格添加-->
    <el-dialog width="470px" :close-on-click-modal="false" title="选择属性" :visible.sync="attrsList.chooseAttr.show">
      <form-mine ref="chooseAttr" @submit="openNextModal()" size="mini" label-width="140px">
        <div style="height:300px;overflow:auto">
          <Tree :data="attrsList.data" :checkbox="true" @checkChange="attrsList.value=$event.filter(item=>{return item.id!==null})"></Tree>
        </div>
        <div style="width:100%;text-align: center">
          <el-button size="mini" type="primary" native-type="submit">下一步</el-button>
          <el-button size="mini" @click="$set(attrsList.chooseAttr,'show',false)">取消</el-button>
        </div>
      </form-mine>
    </el-dialog>

    <!--第二个弹框  添加的下一步  修改的弹框-->
    <el-dialog width="700px" :close-on-click-modal="false" title="设置属性" :visible.sync="attrsList.attrList.show">
      <!--<form-mine ref="chooseAttr" size="mini" label-width="140px">-->
      <form-mine ref="chooseAttr" @submit="subSetAttr()" size="mini" label-width="140px">
        <div style="height:300px;overflow:auto">
          <el-table size="mini" :data="attrsList.value" height="250" border style="width: 100%">
            <el-table-column prop="text" label="名称" width="180"></el-table-column>
            <el-table-column label="启用" align="center" width="60">
              <template slot-scope="scope">
                <el-checkbox size="mini" v-model="scope.row.isDisabled"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="必填" align="center" width="60">
              <template slot-scope="scope">
                <el-checkbox size="mini" v-model="scope.row.isRequired"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="维护" align="center" width="60">
              <template slot-scope="scope">
                <el-checkbox size="mini" v-model="scope.row.isEdit"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="显示在属性表" align="center" width="110">
              <template slot-scope="scope">
                <el-checkbox size="mini" v-model="scope.row.showInAttrTable"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="顺序" align="center">
              <template slot-scope="scope">
                <el-input-number size="mini" v-model="scope.row.sort" :min="1"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="width:100%;text-align: center">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(attrsList.attrList,'show',false)">取消</el-button>
        </div>
      </form-mine>
    </el-dialog>




  </div>
</template>

<script>
  import '@/assets/css/icon.css'

  import {viewTmpTree} from './minxins/viewTmpTree'
  import {viewTmpTable} from './minxins/viewTmpTable'
  import {viewTmpModal} from './minxins/viewTmpModal'

  import tableContent from "@/components_coment/tableContent";
  import rightMenu from "@/components_coment/rightMenu";
  import btnGroupMine from "@/components_coment/btnGroupMine";
  import btnGroupItem from "@/components_coment/btnGroupMine/btnGroupItem";

  export default {
    name: "TemplateManagement",
    mixins: [viewTmpTree, viewTmpTable, viewTmpModal],
    components: {tableContent, rightMenu, btnGroupMine,btnGroupItem},
    data() {
      return {
      }
    },
    mounted() {
    },
    methods: {},
  }
</script>

<style lang="less" scope>
  @color: red;
  #viewTemplate {
    > .content {
      > div {
        height: 100%;
      }

      /*侧边栏*/
      > div:first-child {
        width: 200px;
        padding: 10px;
        overflow: auto;
        display: flex;

        > div {
          width: auto;
          height: auto
        }
      }

      > div:last-child {
        flex: 1;
      }
    }

    .formWidth {
      width: 200px;
    }
  }
</style>

